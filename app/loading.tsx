export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      {/* Spinning cheese wedge rings */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-[3px] border-cheese-200/50 dark:border-stone-800/60 rounded-full" />
        <div className="absolute inset-0 border-[3px] border-transparent border-t-cheese-500 rounded-full animate-spin" />
        <div
          className="absolute inset-[5px] border-[2px] border-transparent border-t-cheese-300 rounded-full animate-spin"
          style={{ animationDuration: '0.7s', animationDirection: 'reverse' }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cheese-500 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-bold text-cheese-900/50 dark:text-cheese-100/40 animate-pulse tracking-wide">
          Loading
        </p>
      </div>
    </div>
  );
}
