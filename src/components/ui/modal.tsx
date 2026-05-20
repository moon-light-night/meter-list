import { type ReactNode, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  isCloseDisabled?: boolean;
}

export function Modal({
  isOpen,
  title,
  children,
  footer,
  onClose,
  closeOnOverlayClick = true,
  isCloseDisabled = false,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isCloseDisabled) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, isCloseDisabled]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onClick={() => {
        if (closeOnOverlayClick && !isCloseDisabled) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isCloseDisabled}
          aria-label="Закрыть модальное окно"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-[#697180] transition-colors hover:bg-slate-100 hover:text-[#1D2432] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ×
        </button>

        <div className="mb-4 pr-10">
          <h2 id={titleId} className="text-lg font-semibold text-[#1D2432]">
            {title}
          </h2>
        </div>

        {children ? (
          <div className="text-sm leading-6 text-[#697180]">{children}</div>
        ) : null}

        {footer ? (
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
