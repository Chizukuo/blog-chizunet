export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-cheese-200 dark:border-stone-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-cheese-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-cheese-900/40 dark:text-cheese-100/40 font-bold animate-pulse">
        Loading thoughts...
      </p>
    </div>
  );
}
