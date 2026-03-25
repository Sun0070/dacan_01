import { useNavigate } from 'react-router-dom';
import type { Hackathon } from '../types';

interface HackathonCardProps {
  hackathon: Hackathon;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  compact?: boolean;
}

function getDday(deadline: string): { text: string; className: string } {
  const now = new Date();
  const target = new Date(deadline);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: '마감', className: 'text-slate-400 dark:text-slate-500' };
  if (diffDays === 0) return { text: 'D-Day', className: 'text-rose-600 dark:text-rose-400 font-black' };
  if (diffDays <= 5) return { text: `D-${diffDays}`, className: 'text-rose-600 dark:text-rose-400 font-bold' };
  if (diffDays <= 15) return { text: `D-${diffDays}`, className: 'text-amber-600 dark:text-amber-400 font-semibold' };
  return { text: `D-${diffDays}`, className: 'text-slate-500 dark:text-slate-400' };
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
    badgeClass: 'inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded-full',
    dotClass: 'w-1.5 h-1.5 rounded-full bg-violet-400',
  },
  ongoing: {
    label: '진행중',
    badgeClass: 'inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full',
    dotClass: 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse',
  },
  ended: {
    label: '종료',
    badgeClass: 'inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full',
    dotClass: 'w-1.5 h-1.5 rounded-full bg-slate-400',
  },
};

export default function HackathonCard({ hackathon, onBookmark, isBookmarked, compact: _compact }: HackathonCardProps) {
  const navigate = useNavigate();
  const { label, badgeClass, dotClass } = statusConfig[hackathon.status];
  const dday = getDday(hackathon.period.submissionDeadlineAt);

  return (
    <div
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200 flex flex-col gap-3"
      onClick={() => navigate(`/hackathons/${hackathon.slug}`)}
    >
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
            className={`text-lg leading-none hover:scale-110 transition-transform duration-150 ${
              isBookmarked ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
            }`}
            aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
        {hackathon.title}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {hackathon.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: deadline + dday */}
      <div className="flex items-center justify-between pt-1 mt-auto border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          마감 {formatDeadline(hackathon.period.submissionDeadlineAt)}
        </span>
        <span className={`text-xs ${dday.className}`}>
          {dday.text}
        </span>
      </div>
    </div>
  );
}
