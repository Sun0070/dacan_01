interface Milestone {
  name: string;
  at: string;
}

interface TimelineProps {
  milestones: Milestone[];
  currentDate?: Date;
}

export default function Timeline({ milestones, currentDate }: TimelineProps) {
  const now = currentDate ?? new Date();

  function getMilestoneState(index: number): 'past' | 'current' | 'future' {
    const milestoneDate = new Date(milestones[index].at);
    if (milestoneDate < now) {
      const nextDate = index + 1 < milestones.length ? new Date(milestones[index + 1].at) : null;
      if (nextDate && nextDate >= now) {
        return 'current';
      }
      return 'past';
    }
    if (index === 0) return 'current';
    const prevDate = new Date(milestones[index - 1].at);
    if (prevDate < now) return 'current';
    return 'future';
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getDaysUntil(dateStr: string): string | null {
    const target = new Date(dateStr);
    const diffMs = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return null;
    if (diffDays === 1) return 'D-1';
    return `D-${diffDays}`;
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-0">
        {milestones.map((milestone, index) => {
          const state = getMilestoneState(index);
          const isLast = index === milestones.length - 1;
          const daysUntil = state === 'future' ? getDaysUntil(milestone.at) : null;

          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                {state === 'past' && (
                  <div className="w-4 h-4 rounded-full flex-shrink-0 mt-1 bg-slate-300 dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">✓</span>
                  </div>
                )}
                {state === 'current' && (
                  <div className="w-4 h-4 rounded-full flex-shrink-0 mt-1 bg-indigo-600 dark:bg-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 ring-4 ring-indigo-100 dark:ring-indigo-900/50" />
                )}
                {state === 'future' && (
                  <div className="w-4 h-4 rounded-full flex-shrink-0 mt-1 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600" />
                )}
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 mt-1 ${state === 'past' ? 'bg-slate-300 dark:bg-slate-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    style={{ minHeight: '2rem' }}
                  />
                )}
              </div>
              <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-medium ${
                    state === 'past'
                      ? 'text-slate-400 dark:text-slate-500'
                      : state === 'current'
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {milestone.name}
                  </p>
                  {state === 'current' && (
                    <span className="inline-flex text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full px-2 py-0.5 font-medium">
                      현재
                    </span>
                  )}
                  {daysUntil && (
                    <span className="inline-flex text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full px-2 py-0.5 font-medium">
                      {daysUntil}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDate(milestone.at)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
