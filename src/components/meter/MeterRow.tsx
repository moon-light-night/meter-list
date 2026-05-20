import { memo, useCallback, useMemo } from 'react';
import type { MouseEvent, ComponentType } from 'react';
import { formatDate } from '@/lib/formatDate';
import {
  ADDRESS_TEXT,
  METER_TYPE_LABEL,
  type Meter,
  type MeterTypeViewLabel,
  formatAutomatic,
  formatDescription,
  formatInitialValues,
  formatMeterType,
} from '@/entities/meter/model';
import { formatAreaAddress, type Area } from '@/entities/area/model';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TrashIcon } from '@/components/ui/icons/Trash';
import { GvsIcon } from '@/components/ui/icons/Gvs';
import { HvsIcon } from '@/components/ui/icons/Hvs';
import { TplIcon } from '@/components/ui/icons/Tpl';
import { EldtIcon } from '@/components/ui/icons/Eldt';

interface MeterRowProps {
  meter: Meter;
  rowIndex: number;
  offset: number;
  area?: Area;
  areaId?: string;
  isDeleting: boolean;
  onDelete: (meter: Meter) => void;
}

type IconComponent = ComponentType<{ className?: string }>;

const METER_TYPE_ICON_BY_LABEL: Partial<
  Record<MeterTypeViewLabel, IconComponent>
> = {
  [METER_TYPE_LABEL.HOT_WATER]: GvsIcon,
  [METER_TYPE_LABEL.COLD_WATER]: HvsIcon,
  [METER_TYPE_LABEL.HEAT]: TplIcon,
  [METER_TYPE_LABEL.ELECTRICITY]: EldtIcon,
};

const DELETE_BUTTON_ARIA_LABEL = 'Удалить счетчик';

const SmallLoader = memo(() => (
  <span className="inline-flex h-4 w-4 animate-spin items-center justify-center rounded-full border-2 border-slate-300 border-t-slate-700 text-slate-700" />
));

export const MeterRow = memo(function MeterRow({
  meter,
  rowIndex,
  offset,
  area,
  areaId,
  isDeleting,
  onDelete,
}: MeterRowProps) {
  const viewModel = useMemo(
    () => ({
      serialIndex: offset + rowIndex + 1,
      type: formatMeterType(meter._type),
      date: formatDate(meter.installation_date),
      automatic: formatAutomatic(meter.is_automatic),
      values: formatInitialValues(meter.initial_values),
      note: formatDescription(meter.description),
    }),
    [
      meter._type,
      meter.description,
      meter.initial_values,
      meter.installation_date,
      meter.is_automatic,
      offset,
      rowIndex,
    ]
  );

  const isLoadingAddress = Boolean(areaId && !area);

  const address = useMemo(() => {
    if (!areaId) {
      return ADDRESS_TEXT.EMPTY;
    }

    return area ? formatAreaAddress(area) : ADDRESS_TEXT.LOADING;
  }, [area, areaId]);

  const TypeIcon = METER_TYPE_ICON_BY_LABEL[viewModel.type];

  const handleDeleteClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDelete(meter);
    },
    [meter, onDelete]
  );

  return (
    <tr className="group cursor-pointer border-b border-slate-200 transition-colors hover:bg-[#F7F8F9]">
      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm text-[#5E6674]">
        {viewModel.serialIndex}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#1D2432]">
        <div className="flex items-center gap-2">
          {TypeIcon && <TypeIcon className="h-5 w-5" />}

          <span>{viewModel.type}</span>
        </div>
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#1D2432]">
        {viewModel.date}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#1D2432]">
        {viewModel.automatic}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#1D2432]">
        {viewModel.values}
      </td>

      <td className="w-[430px] min-w-[430px] max-w-[430px] overflow-hidden px-3 py-4 text-sm text-[#1D2432]">
        <Tooltip content={address}>
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
            {isLoadingAddress ? (
              <span className="inline-flex items-center gap-2 text-slate-500">
                <SmallLoader />
              </span>
            ) : (
              address
            )}
          </span>
        </Tooltip>
      </td>

      <td className="max-w-xs truncate whitespace-nowrap px-3 py-4 text-sm text-[#5E6674]">
        {viewModel.note}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-right">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          aria-label={DELETE_BUTTON_ARIA_LABEL}
          className="h-10 min-w-[40px] rounded-[8px] bg-[#FEE3E3] px-3 py-[10px] text-[#C53030] opacity-100 transition-opacity duration-200 hover:bg-[#FED7D7] hover:text-[#9B2C2C] disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
});
