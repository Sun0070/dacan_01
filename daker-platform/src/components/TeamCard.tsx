import type { Team } from '../types';
import { EditIcon, TrashIcon, ExternalLinkIcon } from './Icons';

interface TeamCardProps {
  team: Team;
  hackathonTitle?: string;
  userRole?: string;
  matchPct?: number;
  matchReasons?: string[];
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

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-sky-500',
];

function getAvatarColor(teamCode: string): string {
  const idx = teamCode.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getAvatarText(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export default function TeamCard({ team, hackathonTitle, userRole, matchPct, matchReasons, onEdit, onDelete }: TeamCardProps) {
  const avatarColor = getAvatarColor(team.teamCode);
  const avatarText = getAvatarText(team.name);
  const maxDots = Math.min(team.memberCount, 5);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:shadow-sm transition-all duration-200">
      {/* Top section */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header: avatar + name + status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${avatarColor}`}
          >
            {avatarText}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
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
              {matchPct !== undefined && (
                <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                  {matchPct}% 매칭
                </span>
              )}
            </div>
            {hackathonTitle && (
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-0.5 truncate">
                {hackathonTitle}
              </p>
            )}
          </div>
        </div>

        {/* Match reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 -mt-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center">추천 이유</span>
            {matchReasons.map((reason) => (
              <span
                key={reason}
                className="text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 px-1.5 py-0.5 rounded-md"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* Intro text */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {team.intro}
        </p>

        {/* Looking for chips */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {team.lookingFor.length === 0 ? (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">모집 직군 미정</span>
          ) : (
            <>
              <span className="text-xs text-slate-400 dark:text-slate-500">찾는 역할</span>
              {team.lookingFor.map((role) => {
                const isMatch = userRole && role === userRole;
                return (
                  <span
                    key={role}
                    className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                      isMatch
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900'
                    }`}
                  >
                    {role}{isMatch && ' ✓'}
                  </span>
                );
              })}
            </>
          )}
        </div>

        {/* Member count + dots */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            현재 {team.memberCount}명
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-[10px] leading-none ${
                  i < maxDots
                    ? 'text-indigo-500 dark:text-indigo-400'
                    : 'text-slate-200 dark:text-slate-700'
                }`}
              >
                {i < maxDots ? '●' : '○'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
        <a
          href={team.contact.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity duration-150"
        >
          연락하기
          <ExternalLinkIcon size={11} />
        </a>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors duration-150"
            >
              <EditIcon size={12} />
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors duration-150"
            >
              <TrashIcon size={12} />
              삭제
            </button>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {getDaysAgo(team.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
