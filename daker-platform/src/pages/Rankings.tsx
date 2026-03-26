import { useEffect, useRef, useState } from 'react';
import { getHackathons, getLeaderboards, getProfile, getTeams } from '../lib/storage';
import {
  CalendarIcon,
  ChevronRightIcon,
  GlobeIcon,
  FileIcon,
  Medal1Icon,
  Medal2Icon,
  Medal3Icon,
  SearchIcon,
} from '../components/Icons';
import type { Hackathon, LeaderboardData } from '../types';

/* ── helpers ─────────────────────────────────────────────── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatScore(score: number) {
  if (score % 1 === 0) return score.toLocaleString('ko-KR');
  // up to 4 decimal places, strip trailing zeros
  return parseFloat(score.toFixed(4)).toString();
}

const statusMeta = {
  ongoing: {
    label: '진행중',
    dot: 'bg-emerald-500 animate-pulse',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  },
  upcoming: {
    label: '예정',
    dot: 'bg-violet-400',
    badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border border-violet-200 dark:border-violet-800',
  },
  ended: {
    label: '종료',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
};

/* ── component ───────────────────────────────────────────── */
export default function Rankings() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [leaderboards, setLeaderboards] = useState<LeaderboardData[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [myTeamNames, setMyTeamNames] = useState<string[]>([]);
  const [myParticipatedSlugs, setMyParticipatedSlugs] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hacks = getHackathons();
    const lbs = getLeaderboards();
    setHackathons(hacks);
    setLeaderboards(lbs);

    // my teams
    const profile = getProfile();
    const allTeams = getTeams();
    const myTeams = allTeams.filter((t) => profile.myTeamCodes.includes(t.teamCode));
    setMyTeamNames(myTeams.map((t) => t.name));
    setMyParticipatedSlugs([...new Set(myTeams.map((t) => t.hackathonSlug))]);

    // default: first hackathon that has leaderboard data, prefer ongoing
    const slugsWithData = new Set(lbs.map((l) => l.hackathonSlug));
    const ordered = [
      ...hacks.filter((h) => h.status === 'ongoing' && slugsWithData.has(h.slug)),
      ...hacks.filter((h) => h.status === 'upcoming' && slugsWithData.has(h.slug)),
      ...hacks.filter((h) => h.status === 'ended' && slugsWithData.has(h.slug)),
    ];
    if (ordered.length > 0) setSelectedSlug(ordered[0].slug);
  }, []);

  /* derived */
  const slugsWithData = new Set(leaderboards.map((l) => l.hackathonSlug));

  const filteredHackathons = hackathons.filter(
    (h) =>
      slugsWithData.has(h.slug) &&
      (!sidebarSearch || h.title.toLowerCase().includes(sidebarSearch.toLowerCase()))
  );

  // group by status order
  const grouped = [
    { status: 'ongoing' as const, items: filteredHackathons.filter((h) => h.status === 'ongoing') },
    { status: 'upcoming' as const, items: filteredHackathons.filter((h) => h.status === 'upcoming') },
    { status: 'ended' as const, items: filteredHackathons.filter((h) => h.status === 'ended') },
  ].filter((g) => g.items.length > 0);

  const selectedHackathon = hackathons.find((h) => h.slug === selectedSlug) ?? null;
  const selectedLB = leaderboards.find((l) => l.hackathonSlug === selectedSlug) ?? null;
  const entries = selectedLB?.entries ?? [];
  const top3 = entries.slice(0, 3);

  const hasScoreBreakdown = entries.some((e) => e.scoreBreakdown !== undefined);
  const hasArtifacts = entries.some((e) => e.artifacts?.webUrl || e.artifacts?.pdfUrl);

  const podiumOrder = [
    {
      rank: 2,
      label: '2위',
      blockH: 64,
      MedalIcon: Medal2Icon,
      accent: 'from-slate-100 to-white dark:from-slate-800 dark:to-slate-900',
      border: 'border-slate-300 dark:border-slate-600',
      medalColor: 'text-slate-400',
      scoreColor: 'text-slate-600 dark:text-slate-300',
    },
    {
      rank: 1,
      label: '1위',
      blockH: 96,
      MedalIcon: Medal1Icon,
      accent: 'from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-slate-900',
      border: 'border-amber-400 dark:border-amber-600',
      medalColor: 'text-amber-500',
      scoreColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      rank: 3,
      label: '3위',
      blockH: 48,
      MedalIcon: Medal3Icon,
      accent: 'from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-slate-900',
      border: 'border-orange-300 dark:border-orange-700',
      medalColor: 'text-orange-400',
      scoreColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  function selectHackathon(slug: string) {
    setSelectedSlug(slug);
    setMobileOpen(false);
  }

  /* ── 참여 해커톤 ── */
  const participatedHackathons = hackathons.filter(
    (h) => myParticipatedSlugs.includes(h.slug) && slugsWithData.has(h.slug)
  );

  /* ── sidebar section wrapper ── */
  function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="px-3 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2">
          {title}
        </p>
        {children}
      </div>
    );
  }

  /* ── sidebar hackathon item ── */
  function HackathonItem({ h }: { h: Hackathon }) {
    const lb = leaderboards.find((l) => l.hackathonSlug === h.slug);
    const count = lb?.entries.length ?? 0;
    const isSelected = selectedSlug === h.slug;
    const myEntry = lb?.entries.find((e) => myTeamNames.includes(e.teamName));
    return (
      <button
        onClick={() => selectHackathon(h.slug)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
          isSelected
            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <span className="truncate text-left">{h.title}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {myEntry && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
              {myEntry.rank}위
            </span>
          )}
          <span className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
            isSelected
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
          }`}>
            {count}
          </span>
        </div>
      </button>
    );
  }

  /* ── sidebar (shared between desktop and mobile) ── */
  const SidebarContent = (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* 검색 */}
      <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon size={14} />
          </span>
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="해커톤 검색..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors duration-150"
          />
        </div>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* 내 참여 대회 */}
        {participatedHackathons.length > 0 && !sidebarSearch && (
          <SidebarSection title="내 참여 대회">
            <div className="space-y-0.5">
              {participatedHackathons.map((h) => (
                <HackathonItem key={h.slug} h={h} />
              ))}
            </div>
          </SidebarSection>
        )}

        {/* 대회 목록 */}
        <SidebarSection title="대회 목록">
          {filteredHackathons.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
              검색 결과가 없습니다
            </p>
          ) : (
            <div className="space-y-3">
              {grouped.map((group) => (
                <div key={group.status}>
                  {/* group label */}
                  <div className="flex items-center gap-1.5 px-1 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusMeta[group.status].dot}`} />
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      {statusMeta[group.status].label}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((h) => (
                      <HackathonItem key={h.slug} h={h} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SidebarSection>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          랭킹
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          해커톤별 리더보드를 확인하세요
        </p>
      </div>

      {/* ── Mobile: hackathon selector button ── */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-150"
        >
          <div className="flex items-center gap-2 min-w-0">
            {selectedHackathon ? (
              <>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusMeta[selectedHackathon.status].dot}`} />
                <span className="truncate">{selectedHackathon.title}</span>
              </>
            ) : (
              <span className="text-slate-400">해커톤을 선택하세요</span>
            )}
          </div>
          <ChevronRightIcon
            size={16}
            className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${mobileOpen ? 'rotate-90' : ''}`}
          />
        </button>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg max-h-72">
            {SidebarContent}
          </div>
        )}
      </div>

      {/* ── Main layout ── */}
      <div className="flex gap-0 lg:gap-6">

        {/* ── Desktop Sidebar ── */}
        <aside
          ref={sidebarRef}
          className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl self-start sticky top-20 overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* sidebar header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              해커톤 선택
            </p>
          </div>
          {SidebarContent}
        </aside>

        {/* ── Right panel ── */}
        <div className="flex-1 min-w-0">
          {!selectedHackathon ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <CalendarIcon size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
                해커톤을 선택하세요
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                왼쪽 목록에서 리더보드를 확인할 해커톤을 선택하세요
              </p>
            </div>
          ) : (
            <div>
              {/* ── Selected hackathon header ── */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${statusMeta[selectedHackathon.status].badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta[selectedHackathon.status].dot}`} />
                        {statusMeta[selectedHackathon.status].label}
                      </span>
                      {selectedLB && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          업데이트 {formatDate(selectedLB.updatedAt)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {selectedHackathon.title}
                    </h2>
                  </div>
                  {entries.length > 0 && (
                    <span className="flex-shrink-0 text-sm font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5">
                      {entries.length}팀
                    </span>
                  )}
                </div>
              </div>

              {entries.length === 0 ? (
                /* No leaderboard data */
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <CalendarIcon size={22} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    아직 리더보드 데이터가 없습니다
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    대회 진행 중 집계된 결과가 여기에 표시됩니다
                  </p>
                </div>
              ) : (
                <>
                  {/* ── Podium ── */}
                  {top3.length >= 2 && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-5">
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center mb-8">
                        TOP 3
                      </p>
                      <div className="flex items-end justify-center gap-4">
                        {podiumOrder.map((p) => {
                          const entry = entries.find((e) => e.rank === p.rank);
                          if (!entry) return null;
                          const { MedalIcon } = p;
                          return (
                            <div key={p.rank} className="flex flex-col items-center" style={{ width: 130 }}>
                              {/* info above podium */}
                              <div className="text-center mb-3 w-full px-1">
                                <div className={`flex justify-center mb-2 ${p.medalColor}`}>
                                  <MedalIcon size={22} />
                                </div>
                                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                                  {entry.teamName}
                                </p>
                                <p className={`text-sm font-black font-mono mt-0.5 ${p.scoreColor}`}>
                                  {formatScore(entry.score)}
                                </p>
                              </div>
                              {/* podium block */}
                              <div
                                className={`w-full rounded-t-xl border-t-2 ${p.border} bg-gradient-to-b ${p.accent} flex items-center justify-center`}
                                style={{ height: p.blockH }}
                              >
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                  {p.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Leaderboard table ── */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-16">
                              순위
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              팀명
                            </th>
                            <th className="py-3 px-4 text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              점수
                            </th>
                            {hasScoreBreakdown && (
                              <>
                                <th className="py-3 px-4 text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                  참가자
                                </th>
                                <th className="py-3 px-4 text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                  심사위원
                                </th>
                              </>
                            )}
                            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                              제출일시
                            </th>
                            {hasArtifacts && (
                              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                결과물
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {entries.map((entry, idx) => {
                            const isTop3 = entry.rank <= 3;
                            const isMyTeam = myTeamNames.includes(entry.teamName);
                            const rowBorder =
                              entry.rank === 1
                                ? 'border-l-2 border-l-amber-400'
                                : entry.rank === 2
                                ? 'border-l-2 border-l-slate-400'
                                : entry.rank === 3
                                ? 'border-l-2 border-l-orange-400'
                                : isMyTeam
                                ? 'border-l-2 border-l-indigo-400'
                                : '';
                            return (
                              <tr
                                key={`${entry.rank}-${entry.teamName}`}
                                className={`transition-colors duration-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${rowBorder} ${
                                  isMyTeam
                                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30'
                                    : idx % 2 === 1
                                    ? 'bg-slate-50/40 dark:bg-slate-900/40'
                                    : ''
                                }`}
                              >
                                {/* rank */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2">
                                    {entry.rank === 1 ? (
                                      <span className="text-amber-500"><Medal1Icon size={14} /></span>
                                    ) : entry.rank === 2 ? (
                                      <span className="text-slate-400"><Medal2Icon size={14} /></span>
                                    ) : entry.rank === 3 ? (
                                      <span className="text-orange-400"><Medal3Icon size={14} /></span>
                                    ) : null}
                                    <span
                                      className={`font-semibold tabular-nums ${
                                        entry.rank === 1
                                          ? 'text-amber-600 dark:text-amber-400'
                                          : entry.rank === 2
                                          ? 'text-slate-500'
                                          : entry.rank === 3
                                          ? 'text-orange-500 dark:text-orange-400'
                                          : 'text-slate-400 dark:text-slate-500'
                                      }`}
                                    >
                                      {entry.rank}
                                    </span>
                                  </div>
                                </td>
                                {/* team name */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-medium ${isTop3 || isMyTeam ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {entry.teamName}
                                    </span>
                                    {isMyTeam && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                        내 팀
                                      </span>
                                    )}
                                  </div>
                                </td>
                                {/* score */}
                                <td className="py-3.5 px-4 text-right">
                                  <span className={`font-mono font-bold text-sm ${
                                    entry.rank === 1
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-indigo-600 dark:text-indigo-400'
                                  }`}>
                                    {formatScore(entry.score)}
                                  </span>
                                </td>
                                {/* score breakdown */}
                                {hasScoreBreakdown && (
                                  <>
                                    <td className="py-3.5 px-4 text-right text-xs font-mono text-slate-500 dark:text-slate-400 hidden md:table-cell">
                                      {entry.scoreBreakdown?.participant !== undefined
                                        ? entry.scoreBreakdown.participant
                                        : '—'}
                                    </td>
                                    <td className="py-3.5 px-4 text-right text-xs font-mono text-slate-500 dark:text-slate-400 hidden md:table-cell">
                                      {entry.scoreBreakdown?.judge !== undefined
                                        ? entry.scoreBreakdown.judge
                                        : '—'}
                                    </td>
                                  </>
                                )}
                                {/* submitted at */}
                                <td className="py-3.5 px-4 text-xs text-slate-400 dark:text-slate-500 hidden lg:table-cell whitespace-nowrap">
                                  {formatDate(entry.submittedAt)}
                                </td>
                                {/* artifacts */}
                                {hasArtifacts && (
                                  <td className="py-3.5 px-4">
                                    <div className="flex gap-2">
                                      {entry.artifacts?.webUrl && (
                                        <a
                                          href={entry.artifacts.webUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                          <GlobeIcon size={12} />
                                          웹
                                        </a>
                                      )}
                                      {entry.artifacts?.pdfUrl && (
                                        <a
                                          href={entry.artifacts.pdfUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:underline"
                                        >
                                          <FileIcon size={12} />
                                          PDF
                                        </a>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
