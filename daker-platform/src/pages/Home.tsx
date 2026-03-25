import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HackathonCard from '../components/HackathonCard';
import SkeletonCard from '../components/SkeletonCard';
import { getHackathons, getLeaderboards, getTeams, getProfile, setProfile } from '../lib/storage';
import type { Hackathon } from '../types';

export default function Home() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTeamCount, setOpenTeamCount] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const data = getHackathons();
    const teams = getTeams();
    const leaderboards = getLeaderboards();
    const profile = getProfile();
    setHackathons(data);
    setOpenTeamCount(teams.filter((t) => t.isOpen).length);
    setTotalSubmissions(leaderboards.reduce((sum, lb) => sum + lb.entries.length, 0));
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

  const featured = [
    ...hackathons.filter((h) => h.status === 'ongoing'),
    ...hackathons.filter((h) => h.status === 'upcoming'),
    ...hackathons.filter((h) => h.status === 'ended'),
  ].slice(0, 3);

  const ongoingCount = hackathons.filter((h) => h.status === 'ongoing').length;

  const features = [
    {
      symbol: '①',
      title: '해커톤 보러가기',
      desc: '진행 중인 데이터 경진대회를 확인하고 참가 신청하세요.',
      to: '/hackathons',
      cta: '해커톤 보기',
      count: hackathons.length,
      countLabel: '개 대회',
    },
    {
      symbol: '②',
      title: '팀 찾기',
      desc: '함께할 팀원을 구하거나 팀에 합류하세요.',
      to: '/camp',
      cta: '팀 찾기',
      count: openTeamCount,
      countLabel: '개 모집중',
    },
    {
      symbol: '③',
      title: '랭킹 보기',
      desc: '전체 리더보드와 팀별 성적을 확인하세요.',
      to: '/rankings',
      cta: '랭킹 보기',
      count: totalSubmissions,
      countLabel: '개 제출',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: '해커톤 탐색',
      desc: '진행 중이거나 예정된 데이터 경진대회를 찾아보세요.',
    },
    {
      step: 2,
      title: '팀 구성',
      desc: '팀을 만들거나 기존 팀에 합류해 함께 도전하세요.',
    },
    {
      step: 3,
      title: '제출 & 랭킹',
      desc: '결과물을 제출하고 리더보드에서 순위를 확인하세요.',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-20 pb-16 px-6">
        {/* Subtle radial gradient decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">
            <span className="w-4 h-px bg-indigo-400" />
            데이터 경진대회 팀 빌딩 플랫폼
            <span className="w-4 h-px bg-indigo-400" />
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            데이터 경진대회<br />
            <span className="text-indigo-600 dark:text-indigo-400">팀을 찾다</span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            DAKER에서 해커톤 정보를 확인하고, 나와 맞는 팀원을 찾아 함께 도전하세요.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/hackathons"
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-base px-6 py-3 rounded-xl transition-colors duration-150"
            >
              해커톤 탐색
            </Link>
            <Link
              to="/camp"
              className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-base px-6 py-3 rounded-xl transition-colors duration-150"
            >
              팀 찾기
            </Link>
          </div>
        </div>
      </section>

      {/* Ongoing alert banner */}
      {!loading && ongoingCount > 0 && (
        <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-8">
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
              현재 {ongoingCount}개 해커톤이 진행 중입니다
            </span>
            <Link
              to="/hackathons"
              className="ml-auto text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              보러가기 →
            </Link>
          </div>
        </div>
      )}

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group bg-white dark:bg-slate-900"
            >
              <div className="text-2xl font-black text-indigo-100 dark:text-indigo-900 mb-4 select-none">
                {f.symbol}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{f.desc}</p>
              {!loading && (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 px-2.5 py-1 rounded-full mb-3">
                  {f.count}{f.countLabel}
                </div>
              )}
              <div className="block text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {f.cta} →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '총 해커톤', value: hackathons.length },
            { label: '모집중인 팀', value: openTeamCount },
            { label: '총 제출 수', value: totalSubmissions },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center"
            >
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-10">
            어떻게 사용하나요?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl flex items-center justify-center text-lg font-black mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            주요 해커톤
          </h2>
          <Link
            to="/hackathons"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((h) => (
                <HackathonCard
                  key={h.slug}
                  hackathon={h}
                  isBookmarked={bookmarks.includes(h.slug)}
                  onBookmark={() => toggleBookmark(h.slug)}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
