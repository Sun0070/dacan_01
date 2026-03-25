interface SkeletonCardProps {
  variant?: 'hackathon' | 'team';
}

export default function SkeletonCard({ variant = 'hackathon' }: SkeletonCardProps) {
  if (variant === 'team') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-2/5" />
          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-16" />
        </div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/5" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-20" />
          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-24" />
        </div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
        <div className="border-t border-slate-100 dark:border-slate-800" />
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-24" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-16" />
        <div className="h-5 w-5 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
      <div className="flex gap-1.5">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-14" />
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-20" />
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-16" />
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 pt-1 flex items-center justify-between">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12" />
      </div>
    </div>
  );
}
