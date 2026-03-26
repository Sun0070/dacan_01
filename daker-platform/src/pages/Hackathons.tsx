import { useEffect, useState } from 'react';
import HackathonCard from '../components/HackathonCard';
import SkeletonCard from '../components/SkeletonCard';
import { FilterIcon, SearchIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';
import { getHackathons, getProfile, setProfile } from '../lib/storage';
import { getRecommended, type ScoredHackathon } from '../lib/recommend';
import type { Hackathon } from '../types';

type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'ended';
type SortOption = 'latest' | 'deadline';

const STATUS_OPTIONS: { value: StatusFilter; label: string; dot: string }[] = [
  { value: 'all',     label: '전체',   dot: 'bg-slate-400' },
  { value: 'ongoing', label: '진행중', dot: 'bg-emerald-500 animate-pulse' },
  { value: 'upcoming',label: '예정',   dot: 'bg-violet-400' },
  { value: 'ended',   label: '종료',   dot: 'bg-slate-300' },
];

/* ── sidebar section wrapper ── */
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function Hackathons() {
  const [hackathons, setHackathons]   = useState<Hackathon[]>([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption]   = useState<SortOption>('latest');
  const [search, setSearch]           = useState('');
  const [tagFilter, setTagFilter]     = useState('');
  const [bookmarks, setBookmarks]     = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [recommended, setRecommended] = useState<ScoredHackathon[]>([]);
  const [profileName, setProfileName] = useState('');
  const [recPage, setRecPage] = useState(0);

  useEffect(() => {
    const data = getHackathons();
    const profile = getProfile();
    setHackathons(data);
    setBookmarks(profile.bookmarks);
    setProfileName(profile.name);
    setRecommended(getRecommended(data, profile));
    setLoading(false);
  }, []);

  function toggleBookmark(slug: string) {
    const profile = getProfile();
    const updated = profile.bookmarks.includes(slug)
      ? profile.bookmarks.filter((b) => b !== slug)
      : [...profile.bookmarks, slug];
    setProfile({ ...profile, bookmarks: updated });
    setBookmarks(updated);
  }

  /* derived */
  const allTags = Array.from(new Set(hackathons.flatMap((h) => h.tags))).sort();

  const counts: Record<StatusFilter, number> = {
    all:      hackathons.length,
    ongoing:  hackathons.filter((h) => h.status === 'ongoing').length,
    upcoming: hackathons.filter((h) => h.status === 'upcoming').length,
    ended:    hackathons.filter((h) => h.status === 'ended').length,
  };

  const filtered = hackathons
    .filter((h) => statusFilter === 'all' || h.status === statusFilter)
    .filter((h) =>
      !search ||
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((h) => !tagFilter || h.tags.includes(tagFilter))
    .sort((a, b) => {
      if (sortOption === 'latest') {
        return new Date(b.period.endAt).getTime() - new Date(a.period.endAt).getTime();
      }
      // 마감임박순: 종료된 대회는 맨 뒤, 나머지는 마감일 오름차순
      const aEnded = a.status === 'ended' ? 1 : 0;
      const bEnded = b.status === 'ended' ? 1 : 0;
      if (aEnded !== bEnded) return aEnded - bEnded;
      return new Date(a.period.submissionDeadlineAt).getTime() - new Date(b.period.submissionDeadlineAt).getTime();
    });

  const hasActiveFilter = statusFilter !== 'all' || search !== '' || tagFilter !== '';

  function resetFilters() {
    setStatusFilter('all');
    setSearch('');
    setTagFilter('');
  }

  /* ── sidebar content (shared desktop/mobile) ── */
  const SidebarContent = (
    <>
      {/* 검색 */}
      <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon size={14} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목 또는 태그 검색..."
            className="w-full pl-8 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors duration-150"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <XIcon size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 상태 필터 */}
      <SidebarSection title="상태">
        <div className="space-y-0.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                statusFilter === opt.value
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${opt.dot}`} />
                {opt.label}
              </div>
              <span
                className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
                  statusFilter === opt.value
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {counts[opt.value]}
              </span>
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* 정렬 */}
      <SidebarSection title="정렬">
        <div className="space-y-0.5">
          {([['latest', '최신순'], ['deadline', '마감임박순']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortOption(val)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                sortOption === val
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                sortOption === val
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-slate-300 dark:border-slate-600'
              }`} />
              {label}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* 태그 */}
      {allTags.length > 0 && (
        <SidebarSection title="태그">
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-150 ${
                  tagFilter === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </SidebarSection>
      )}

      {/* 필터 초기화 */}
      {hasActiveFilter && (
        <div className="px-4 py-3">
          <button
            onClick={resetFilters}
            className="w-full text-sm text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-medium py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors duration-150"
          >
            필터 초기화
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            해커톤
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            데이터 경진대회 목록을 탐색하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen((v) => !v)}
            className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-150 ${
              hasActiveFilter
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <FilterIcon size={14} />
            필터
            {hasActiveFilter && (
              <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center">
                {[statusFilter !== 'all', search !== '', tagFilter !== ''].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile filter panel */}
      {mobileFilterOpen && (
        <div className="lg:hidden mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {SidebarContent}
        </div>
      )}

      <div className="flex gap-6">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden self-start sticky top-20">
          {SidebarContent}
        </aside>

        {/* ── Right panel ── */}
        <div className="flex-1 min-w-0">

          {/* 맞춤 대회 추천 - 필터 없을 때만 표시 */}
          {!loading && recommended.length > 0 && !hasActiveFilter && (() => {
            const PER_PAGE = 3;
            const totalPages = Math.ceil(recommended.length / PER_PAGE);
            const pageItems = recommended.slice(recPage * PER_PAGE, (recPage + 1) * PER_PAGE);
            return (
              <div className="mb-6">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-indigo-600 dark:bg-indigo-700 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">
                      {profileName ? `${profileName}님 맞춤 추천` : '맞춤 대회 추천'}
                    </span>
                    <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 font-semibold">
                      {recommended.length}개
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-indigo-200 text-xs hidden sm:block">
                      역할 · 스킬 · 관심 분야 기반 자동 분석
                    </p>
                    {totalPages > 1 && (
                      <span className="text-white/60 text-xs tabular-nums">
                        {recPage + 1}/{totalPages}
                      </span>
                    )}
                  </div>
                </div>
                {/* Cards with outside arrows */}
                <div className="relative border border-t-0 border-indigo-200 dark:border-indigo-800 rounded-b-2xl bg-indigo-50 dark:bg-indigo-950/40">
                  {totalPages > 1 && (
                    <button
                      onClick={() => setRecPage((p) => Math.max(0, p - 1))}
                      disabled={recPage === 0}
                      className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-600 dark:text-slate-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                    {pageItems.map((h) => (
                      <HackathonCard
                        key={h.slug}
                        hackathon={h}
                        isBookmarked={bookmarks.includes(h.slug)}
                        onBookmark={() => toggleBookmark(h.slug)}
                        matchPct={h.matchPct}
                        matchReasons={h.matchReasons}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <button
                      onClick={() => setRecPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={recPage === totalPages - 1}
                      className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-600 dark:text-slate-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Result count */}
          {!loading && (
            <div className="flex items-center gap-3 mb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {hasActiveFilter
                  ? <><span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}개</span> 결과</>
                  : <>{filtered.length}개의 해커톤</>
                }
              </p>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="flex justify-center mb-5">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="text-slate-200 dark:text-slate-700">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
                  <circle cx="24" cy="26" r="3" fill="currentColor" />
                  <circle cx="40" cy="26" r="3" fill="currentColor" />
                  <path d="M20 44c0 0 4-6 12-6s12 6 12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-500 dark:text-slate-400 mb-1">
                해당하는 해커톤이 없습니다
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">
                다른 필터를 시도해보세요
              </p>
              <button
                onClick={resetFilters}
                className="text-sm font-medium px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-150"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((h) => (
                <HackathonCard
                  key={h.slug}
                  hackathon={h}
                  isBookmarked={bookmarks.includes(h.slug)}
                  onBookmark={() => toggleBookmark(h.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
