import { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  DELETE_METER_MODAL_TEXT,
  formatMeterType,
  getAreaId,
  type Meter,
} from '@/entities/meter/model';
import type { Area } from '@/entities/area/model';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { MeterRow } from '@/components/meter';

interface MetersTableProps {
  meters: readonly Meter[];
  offset: number;
  areasById: Record<string, Area>;
  deletingMeterIds: readonly string[];
  onDelete: (id: string) => void | Promise<void>;
}

const TABLE_COLUMNS = [
  {
    id: 'number',
    title: '№',
    className:
      'bg-[#F0F3F7] py-2 pl-4 pr-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:pl-6 sm:pr-3 sm:text-xs',
  },
  {
    id: 'type',
    title: 'Тип',
    className:
      'bg-[#F0F3F7] px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:px-3 sm:text-xs',
  },
  {
    id: 'installationDate',
    title: 'Дата установки',
    className:
      'bg-[#F0F3F7] px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:px-3 sm:text-xs',
  },
  {
    id: 'automatic',
    title: 'Автоматический',
    className:
      'bg-[#F0F3F7] px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:px-3 sm:text-xs',
  },
  {
    id: 'values',
    title: 'Текущие показания',
    className:
      'bg-[#F0F3F7] px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:px-3 sm:text-xs',
  },
  {
    id: 'address',
    title: 'Адрес',
    className:
      'w-[320px] min-w-[320px] max-w-[320px] bg-[#F0F3F7] px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:w-[430px] sm:min-w-[430px] sm:max-w-[430px] sm:px-3 sm:text-xs',
  },
  {
    id: 'description',
    title: 'Примечание',
    className:
      'bg-[#F0F3F7] px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:px-3 sm:text-xs',
  },
  {
    id: 'actions',
    title: '',
    className:
      'bg-[#F0F3F7] px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-[#697180] whitespace-nowrap sm:px-3 sm:text-xs',
  },
] as const;

export const MetersTable = observer(function MetersTable({
  meters,
  offset,
  areasById,
  deletingMeterIds,
  onDelete,
}: MetersTableProps) {
  const [meterToDelete, setMeterToDelete] = useState<Meter | null>(null);

  const deletingMeterIdsSet = useMemo(
    () => new Set(deletingMeterIds),
    [deletingMeterIds]
  );

  const isModalOpen = Boolean(meterToDelete);

  const isDeletingSelectedMeter = useMemo(
    () => Boolean(meterToDelete && deletingMeterIdsSet.has(meterToDelete.id)),
    [deletingMeterIdsSet, meterToDelete]
  );

  const handleOpenDeleteModal = useCallback((meter: Meter) => {
    setMeterToDelete(meter);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (isDeletingSelectedMeter) {
      return;
    }

    setMeterToDelete(null);
  }, [isDeletingSelectedMeter]);

  const handleConfirmDelete = useCallback(async () => {
    if (!meterToDelete) {
      return;
    }

    await onDelete(meterToDelete.id);
    setMeterToDelete(null);
  }, [meterToDelete, onDelete]);

  const tableRows = useMemo(
    () =>
      meters.map((meter, index) => {
        const areaId = getAreaId(meter);
        const area = areaId ? areasById[areaId] : undefined;

        return (
          <MeterRow
            key={meter.id}
            meter={meter}
            rowIndex={index}
            offset={offset}
            area={area}
            areaId={areaId}
            isDeleting={deletingMeterIdsSet.has(meter.id)}
            onDelete={handleOpenDeleteModal}
          />
        );
      }),
    [areasById, deletingMeterIdsSet, handleOpenDeleteModal, meters, offset]
  );

  return (
    <>
      <div className="h-full min-h-0 w-full overflow-hidden bg-white shadow-sm">
        <div className="h-full min-h-0 overflow-auto">
          <table className="w-full min-w-[920px] md:min-w-full">
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-slate-200 bg-[#F0F3F7]">
                {TABLE_COLUMNS.map((column) => (
                  <th key={column.id} className={column.className}>
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-xs font-normal leading-5 text-[#697180] sm:text-sm sm:leading-6">
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={DELETE_METER_MODAL_TEXT.TITLE}
        onClose={handleCloseModal}
        closeOnOverlayClick={!isDeletingSelectedMeter}
        isCloseDisabled={isDeletingSelectedMeter}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isDeletingSelectedMeter}
              className="w-full sm:w-auto"
            >
              {DELETE_METER_MODAL_TEXT.CANCEL}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleConfirmDelete}
              disabled={isDeletingSelectedMeter}
              className="w-full bg-[#C53030] text-white hover:bg-[#9B2C2C] sm:w-auto"
            >
              {isDeletingSelectedMeter
                ? DELETE_METER_MODAL_TEXT.DELETING
                : DELETE_METER_MODAL_TEXT.DELETE}
            </Button>
          </>
        }
      >
        {meterToDelete && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1D2432]">
            <div>
              <span className="text-[#697180]">
                {DELETE_METER_MODAL_TEXT.TYPE_LABEL}
              </span>

              <span className="font-medium">
                {formatMeterType(meterToDelete._type)}
              </span>
            </div>

            <div className="mt-1">
              <span className="text-[#697180]">
                {DELETE_METER_MODAL_TEXT.ID_LABEL}
              </span>

              <span className="break-all font-medium">{meterToDelete.id}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
});
