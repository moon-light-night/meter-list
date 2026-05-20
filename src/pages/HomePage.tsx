import { useCallback, useEffect, useMemo, useState } from 'react';
import { Droplets } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { StoreProvider, useStore } from '@/store';
import { Pagination } from '@/components/paination';
import { Loader } from '@/components/ui/loader/Loader';
import { ErrorMessage } from '@/components/ui/error-message/ErrorMessage';
import { Card } from '@/components/ui/card';
import { MetersTable } from '@/components/meter';

const PAGE_TEXT = {
  TITLE: 'Список счетчиков',
  EMPTY: 'Данные отсутствуют',
} as const;

const HomePageContent = observer(() => {
  const store = useStore();
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  useEffect(() => {
    let isMounted = true;

    store.fetchMeters(store.currentPage).finally(() => {
      if (isMounted) {
        setHasLoadedInitial(true);
      }
    });

    return () => {
      isMounted = false;
      store.abortMetersRequest();
    };
  }, [store]);

  const isEmpty = useMemo(
    () =>
      hasLoadedInitial &&
      !store.isMetersLoading &&
      !store.error &&
      store.meters.length === 0,
    [hasLoadedInitial, store.error, store.isMetersLoading, store.meters.length]
  );

  const showLoader = useMemo(
    () => store.isMetersLoading || !hasLoadedInitial,
    [hasLoadedInitial, store.isMetersLoading]
  );

  const handlePrevPage = useCallback(() => {
    store.goToPage(store.currentPage - 1);
  }, [store]);

  const handleNextPage = useCallback(() => {
    store.goToPage(store.currentPage + 1);
  }, [store]);

  const handlePageChange = useCallback(
    (page: number) => {
      store.goToPage(page);
    },
    [store]
  );

  const handleDeleteMeter = useCallback(
    (meterId: string) => store.deleteMeter(meterId),
    [store]
  );

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 text-slate-950">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-2 overflow-hidden px-2 py-2 sm:gap-4 sm:px-4 sm:py-4">
        <header className="flex-shrink-0 space-y-1 sm:space-y-2">
          <div className="flex items-center justify-center gap-2 sm:justify-start sm:gap-3">
            <h1 className="w-full text-center text-xl font-medium leading-7 tracking-tight text-slate-900 sm:w-auto sm:text-left sm:text-2xl sm:leading-8">
              {PAGE_TEXT.TITLE}
            </h1>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg">
            <div className="min-h-0 flex-1 overflow-hidden">
              {store.error ? (
                <div className="flex items-start p-3 sm:p-6">
                  <ErrorMessage message={store.error} />
                </div>
              ) : showLoader ? (
                <div className="flex h-full min-h-[260px] items-center justify-center sm:min-h-[320px]">
                  <Loader />
                </div>
              ) : isEmpty ? (
                <div className="flex h-full min-h-[260px] items-center justify-center sm:min-h-[320px]">
                  <div className="px-4 py-10 text-center sm:py-12">
                    <Droplets className="mx-auto mb-3 h-10 w-10 text-slate-300 sm:mb-4 sm:h-12 sm:w-12" />

                    <p className="text-base text-slate-500 sm:text-lg">
                      {PAGE_TEXT.EMPTY}
                    </p>
                  </div>
                </div>
              ) : (
                <MetersTable
                  meters={store.meters}
                  offset={store.offset}
                  areasById={store.areasById}
                  deletingMeterIds={store.deletingMeterIds}
                  onDelete={handleDeleteMeter}
                />
              )}
            </div>

            {store.pagesCount > 0 && !isEmpty && (
              <div className="flex flex-shrink-0 justify-center border-t border-slate-200 px-2 py-1.5 sm:justify-end sm:px-3 sm:py-2">
                <div className="origin-center scale-90 sm:scale-100">
                  <Pagination
                    currentPage={store.currentPage}
                    pagesCount={store.pagesCount}
                    isLoading={store.isMetersLoading}
                    onPrev={handlePrevPage}
                    onNext={handleNextPage}
                    onPage={handlePageChange}
                  />
                </div>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
});

export const HomePage = () => (
  <StoreProvider>
    <HomePageContent />
  </StoreProvider>
);
