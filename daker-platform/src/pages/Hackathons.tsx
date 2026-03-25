import { useEffect, useState } from 'react';
import HackathonCard from '../components/HackathonCard';
import SkeletonCard from '../components/SkeletonCard';
import { getHackathons, getProfile, setProfile } from '../lib/storage';
import type { Hackathon } from '../types';

type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'ended';
type SortOption = 'latest' | 'deadline';

export default function Hackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const data = getHackathons();
    const profile = getProfile();
    setHackathons(data);
    setBookmarks(profile.bookmarks);
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

  const filtered = hackathons
    .filter((h) => statusFilter === 'all' || h.status === statusFilter)
    .filter(
      (h) =>
        !search ||
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOption === 'latest') {
        return (
          new Date(b.period.endAt).getTime() - new Date(a.period.endAt).getTime()
        );
      }
      return (
        new Date(a.period.submissionDeadlineAt).getTime() -
        new Date(b.period.submissionDeadlineAt).getTime()
      );
    });

  const ongoingCount = hackathons.filter((h) => h.status === 'ongoing').length;
  const upcomingCount = hackathons.filter((h) => h.status === 'upcoming').length;
  const endedCount = hackathons.filter((h) => h.status === 'ended').length;

  const statusButtons: { value: StatusFilter; label: string; count: number }[] = [
    { value: 'all', label: '전체', count: hackathons.length },
    { value: 'upcoming', label: '예정', count: upcomingCount },
    { value: 'ongoing', label: '진행중', count: ongoingCount },
    { value: 'ended', label: '종료', count: endedCount },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-1.5">
          해커톤
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          데이터 경진대회 목록을 탐색하세요.
        </p>
      </div>

      {/* Ongoing banner */}
      {!loading && ongoingCount > 0 && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
            현재 {ongoingCount}개의 해커톤이 진행 중입니다
          </span>
          <button
            onClick={() => setStatusFilter('ongoing')}
            className="ml-auto text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            진행중 보기 →
          </button>
        </div>
      )}

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="제목 또는 태그 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 text-sm transition-colors duration-150"
          />
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
        >
          <option value="latest">최신순</option>
          <option value="deadline">마감임박순</option>
        </select>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statusButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setStatusFilter(btn.value)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              statusFilter === btn.value
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {btn.label}
            {!loading && (
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  statusFilter === btn.value
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {btn.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {search || statusFilter !== 'all'
            ? <><span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}개</span> 결과</>
            : <>{filtered.length}개의 해커톤</>
          }
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-black text-slate-100 dark:text-slate-800 mb-4 select-none">찾을 수 없음</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            해당하는 해커톤이 없습니다.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setSearch('');
            }}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}
