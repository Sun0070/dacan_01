import type { Team } from '../types';

interface TeamCardProps {
  team: Team;
  hackathonTitle?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

function getDaysAgo(dateStr: string): string {
  const now = new Date();
  const created = new Date(dateStr);
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
}

export default function TeamCard({ team, hackathonTitle, onEdit, onDelete }: TeamCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
      {/* Header: team name + open/closed badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
          {team.name}
        </h3>
        <span
          className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
            team.isOpen
              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800'
              : 'text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {team.isOpen ? '모집중' : '마감'}
        </span>
      </div>

      {/* Hackathon name */}
      {hackathonTitle && (
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          ▸ {hackathonTitle}
        </p>
      )}

      {/* Member count */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">현재 {team.memberCount}명</span>
      </div>

      {/* Looking for chips */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {team.lookingFor.length === 0 ? (
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">모집 직군 미정</span>
        ) : (
          team.lookingFor.map((role) => (
            <span
              key={role}
              className="text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 rounded-md"
            >
              {role}
            </span>
          ))
        )}
      </div>

      {/* Intro text */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{team.intro}</p>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-800" />

      {/* Actions + footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={team.contact.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-colors duration-150"
          >
            연락하기
          </a>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-150"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-150"
            >
              삭제
            </button>
          )}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {getDaysAgo(team.createdAt)}
        </span>
      </div>
    </div>
  );
}
