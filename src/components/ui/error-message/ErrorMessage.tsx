import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm">
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
      <div>{message}</div>
    </div>
  );
}
