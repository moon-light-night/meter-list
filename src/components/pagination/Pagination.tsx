import { memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  pagesCount: number;
  isLoading?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPage: (page: number) => void;
}

const PAGINATION = {
  MAX_VISIBLE_PAGES: 7,
  START_PAGE: 0,
  EDGE_PAGES_COUNT: 3,
  LAST_EDGE_OFFSET: 3,
  PAGE_DISPLAY_OFFSET: 1,
} as const;

const PAGINATION_ELLIPSIS = 'ellipsis' as const;
const PAGINATION_ELLIPSIS_LABEL = '…';

type PaginationItem = number | typeof PAGINATION_ELLIPSIS;

const pageButtonBaseClassName =
  'inline-flex h-8 w-8 items-center justify-center rounded-[6px] border text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2';

const activePageButtonClassName =
  'border-[#CED5DE] bg-slate-100 text-slate-900';

const defaultPageButtonClassName =
  'border-[#CED5DE] bg-white text-slate-700 hover:bg-slate-50';

const navigationButtonClassName =
  'group h-8 w-8 rounded-[6px] border-[#CED5DE] bg-white text-slate-700 hover:bg-slate-50';

const buildPageItems = (
  currentPage: number,
  pagesCount: number
): PaginationItem[] => {
  if (pagesCount <= PAGINATION.MAX_VISIBLE_PAGES) {
    return Array.from({ length: pagesCount }, (_, index) => index);
  }

  const lastPage = pagesCount - 1;
  const items: PaginationItem[] = [PAGINATION.START_PAGE];

  if (currentPage <= PAGINATION.EDGE_PAGES_COUNT - 1) {
    return [...items, 1, 2, PAGINATION_ELLIPSIS, lastPage];
  }

  if (currentPage >= pagesCount - PAGINATION.LAST_EDGE_OFFSET) {
    return [
      ...items,
      PAGINATION_ELLIPSIS,
      pagesCount - 4,
      pagesCount - 3,
      pagesCount - 2,
      lastPage,
    ];
  }

  return [
    ...items,
    PAGINATION_ELLIPSIS,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    PAGINATION_ELLIPSIS,
    lastPage,
  ];
};

export const Pagination = memo(function Pagination({
  currentPage,
  pagesCount,
  isLoading = false,
  onPrev,
  onNext,
  onPage,
}: PaginationProps) {
  const pageItems = useMemo(
    () => buildPageItems(currentPage, pagesCount),
    [currentPage, pagesCount]
  );

  const isPrevDisabled = isLoading || currentPage === PAGINATION.START_PAGE;
  const isNextDisabled = isLoading || currentPage + 1 >= pagesCount;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={isPrevDisabled}
        className={navigationButtonClassName}
      >
        <ChevronLeft className="h-5 w-5 text-slate-700 group-hover:text-slate-700" />
      </Button>

      <div className="flex items-center gap-2">
        {pageItems.map((item, index) =>
          item === PAGINATION_ELLIPSIS ? (
            <span
              key={`${PAGINATION_ELLIPSIS}-${index}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#CED5DE] bg-white text-sm font-medium text-slate-500"
            >
              {PAGINATION_ELLIPSIS_LABEL}
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPage(item)}
              disabled={isLoading}
              className={`${pageButtonBaseClassName} disabled:cursor-not-allowed disabled:opacity-50 ${
                item === currentPage
                  ? activePageButtonClassName
                  : defaultPageButtonClassName
              }`}
            >
              {item + PAGINATION.PAGE_DISPLAY_OFFSET}
            </button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={isNextDisabled}
        className={navigationButtonClassName}
      >
        <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-slate-700" />
      </Button>
    </div>
  );
});