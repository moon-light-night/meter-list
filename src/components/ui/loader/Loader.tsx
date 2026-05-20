export function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#697180]"
        role="status"
        aria-label="Загрузка"
      />
      <span className="text-sm ml-2 text-slate-600">Загрузка...</span>
    </div>
  );
}
