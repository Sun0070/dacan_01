import { useNavigate } from 'react-router-dom';
import type { Hackathon } from '../types';
import { BookmarkIcon, BookmarkFilledIcon } from './Icons';

interface HackathonCardProps {
  hackathon: Hackathon;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  compact?: boolean;
}

function getDday(deadline: string): { text: string; badgeClass: string } {
  const now = new Date();
  const target = new Date(deadline);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: '종료됨',
      badgeClass: 'text-slate-400 dark:text-slate-500 text-xs',
    };
  }
  if (diffDays === 0) {
    return {
      text: 'D-Day',
      badgeClass: 'rounded-full px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    };
  }
  if (diffDays <= 3) {
    return {
      text: `D-${diffDays}`,
      badgeClass: 'rounded-full px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    };
  }
  if (diffDays <= 14) {
    return {
      text: `D-${diffDays}`,
      badgeClass: 'rounded-full px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    };
  }
  return {
    text: `D-${diffDays}`,
    badgeClass: 'rounded-full px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  };
}

function formatDeadline(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

const statusConfig = {
  upcoming: {
    label: '예정',
    borderColor: 'border-t-violet-500',
    badgeClass:
      'inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded-full',
    dotClass: 'w-1.5 h-1.5 rounded-full bg-violet-400',
  },
  ongoing: {
    label: '진행중',
    borderColor: 'border-t-emerald-500',
    badgeClass:
      'inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full',
    dotClass: 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse',
  },
  ended: {
    label: '종료',
    borderColor: 'border-t-slate-300',
    badgeClass:
      'inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full',
    dotClass: 'w-1.5 h-1.5 rounded-full bg-slate-400',
  },
};

export default function HackathonCard({
  hackathon,
  onBookmark,
  isBookmarked,
  compact: _compact,
}: HackathonCardProps) {
  const navigate = useNavigate();
  const { label, borderColor, badgeClass, dotClass } = statusConfig[hackathon.status];
  const dday = getDday(hackathon.period.submissionDeadlineAt);

  return (
    <div
      className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-[3px] ${borderColor} rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col`}
      onClick={() => navigate(`/hackathons/${hackathon.slug}`)}
    >
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header row: status badge + bookmark */}
        <div className="flex items-start justify-between">
          <span className={badgeClass}>
            <span className={dotClass} />
            {label}
          </span>
          {onBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
              className={`transition-all duration-150 hover:scale-110 ${
                isBookmarked
                  ? 'text-amber-400'
                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
              }`}
              aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
            >
              {isBookmarked ? (
                <BookmarkFilledIcon size={16} />
              ) : (
                <BookmarkIcon size={16} />
              )}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold leading-snug line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
          {hackathon.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {hackathon.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-slate-100 dark:bg-slate-800 rounded-md px-1.5 py-0.5 text-slate-500 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          마감 {formatDeadline(hackathon.period.submissionDeadlineAt)}
        </span>
        <span className={dday.badgeClass}>{dday.text}</span>
      </div>
    </div>
  );
}
