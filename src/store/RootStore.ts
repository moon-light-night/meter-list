import { flow, types } from 'mobx-state-tree';
import type { Instance } from 'mobx-state-tree';
import { getAreasByIds, getMeters, deleteMeter as deleteMeterApi } from '@/api';
import type { Area, AreasResponse } from '@/entities/area/model';
import {
  getAreaIdsFromMeters,
  type Meter,
  type MetersResponse,
} from '@/entities/meter/model';

const DEFAULT_PAGE_LIMIT = 20;
const DEFAULT_PAGE = 0;
const MIN_PAGES_COUNT = 1;
const NEXT_AFTER_DELETE_LIMIT = 1;
const PAGE_STEP = 1;
const ABORT_ERROR_NAME = 'AbortError';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === ABORT_ERROR_NAME;

const getPagesCount = (count: number, limit: number): number =>
  Math.max(MIN_PAGES_COUNT, Math.ceil(count / limit));

export const RootStore = types
  .model('RootStore', {
    meters: types.optional(types.frozen<Meter[]>([]), []),
    areasById: types.optional(types.frozen<Record<string, Area>>({}), {}),
    count: types.optional(types.number, 0),
    limit: types.optional(types.number, DEFAULT_PAGE_LIMIT),
    offset: types.optional(types.number, 0),
    currentPage: types.optional(types.number, DEFAULT_PAGE),
    isMetersLoading: types.optional(types.boolean, false),
    isAreasLoading: types.optional(types.boolean, false),
    error: types.optional(types.maybeNull(types.string), null),
    deletingMeterIds: types.optional(types.array(types.string), []),
  })
  .volatile(() => ({
    metersAbortController: null as AbortController | null,
  }))
  .views((self) => ({
    get pagesCount() {
      return getPagesCount(self.count, self.limit);
    },
  }))
  .actions((self) => {
    const setError = (message: string | null) => {
      self.error = message;
    };

    const setUnknownError = (error: unknown) => {
      self.error = getErrorMessage(error);
    };

    const abortMetersRequest = () => {
      self.metersAbortController?.abort();
      self.metersAbortController = null;
      self.isMetersLoading = false;
    };

    const getMissingAreaIds = (ids: readonly string[]): string[] =>
      Array.from(new Set(ids)).filter((id) => !self.areasById[id]);

    const fetchMissingAreas = flow(function* fetchMissingAreas(
      ids: readonly string[]
    ) {
      const missingIds = getMissingAreaIds(ids);

      if (!missingIds.length) {
        return;
      }

      self.isAreasLoading = true;

      try {
        const response = (yield getAreasByIds(missingIds)) as AreasResponse;

        self.areasById = response.results.reduce<Record<string, Area>>(
          (areasById, area) => {
            if (area.id) {
              areasById[area.id] = area;
            }

            return areasById;
          },
          { ...self.areasById }
        );
      } catch (error) {
        setUnknownError(error);
      } finally {
        self.isAreasLoading = false;
      }
    });

    const fetchMeters = flow(function* fetchMeters(page = DEFAULT_PAGE) {
      abortMetersRequest();

      const controller = new AbortController();
      const nextOffset = page * self.limit;

      self.metersAbortController = controller;
      self.isMetersLoading = true;
      self.error = null;
      self.currentPage = page;
      self.offset = nextOffset;

      try {
        const response = (yield getMeters(
          {
            limit: self.limit,
            offset: nextOffset,
          },
          controller.signal
        )) as MetersResponse;

        if (self.metersAbortController !== controller) {
          return;
        }

        self.count = response.count;
        self.meters = response.results;

        const areaIds = getAreaIdsFromMeters(response.results);

        void fetchMissingAreas(areaIds);
      } catch (error) {
        if (isAbortError(error) || self.metersAbortController !== controller) {
          return;
        }

        setUnknownError(error);
      } finally {
        if (self.metersAbortController === controller) {
          self.isMetersLoading = false;
          self.metersAbortController = null;
        }
      }
    });

    const loadNextMeterAfterDelete = flow(function* loadNextMeterAfterDelete() {
      try {
        const nextOffset = self.offset + self.meters.length;

        const response = (yield getMeters({
          limit: NEXT_AFTER_DELETE_LIMIT,
          offset: nextOffset,
        })) as MetersResponse;

        const [nextMeter] = response.results;

        if (!nextMeter) {
          return;
        }

        self.meters = [...self.meters, nextMeter];
        self.count = response.count;

        const areaIds = getAreaIdsFromMeters(response.results);

        yield fetchMissingAreas(areaIds);
      } catch (error) {
        setUnknownError(error);
      }
    });

    const removeDeletingMeterId = (meterId: string) => {
      self.deletingMeterIds.replace(
        self.deletingMeterIds.filter((id) => id !== meterId)
      );
    };

    const shouldLoadPreviousPage = (): boolean =>
      self.meters.length === 0 && self.currentPage > DEFAULT_PAGE;

    const shouldLoadNextMeter = (): boolean =>
      self.meters.length < self.limit &&
      self.count > self.offset + self.meters.length;

    const deleteMeter = flow(function* deleteMeter(meterId: string) {
      if (self.deletingMeterIds.includes(meterId)) {
        return;
      }

      self.deletingMeterIds.push(meterId);
      self.error = null;

      try {
        yield deleteMeterApi(meterId);

        self.meters = self.meters.filter((meter) => meter.id !== meterId);
        self.count = Math.max(0, self.count - 1);

        if (shouldLoadPreviousPage()) {
          yield fetchMeters(self.currentPage - PAGE_STEP);
          return;
        }

        if (shouldLoadNextMeter()) {
          yield loadNextMeterAfterDelete();
        }
      } catch (error) {
        setUnknownError(error);
      } finally {
        removeDeletingMeterId(meterId);
      }
    });

    const goToPage = (page: number) => {
      const pagesCount = getPagesCount(self.count, self.limit);
      const isPageOutOfRange = page < DEFAULT_PAGE || page >= pagesCount;

      if (isPageOutOfRange) {
        return;
      }

      void fetchMeters(page);
    };

    return {
      setError,
      abortMetersRequest,
      fetchMissingAreas,
      fetchMeters,
      loadNextMeterAfterDelete,
      deleteMeter,
      goToPage,
    };
  });

export const createRootStore = () => RootStore.create({});

export type RootStoreType = Instance<typeof RootStore>;
