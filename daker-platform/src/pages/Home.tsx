import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HackathonCard from '../components/HackathonCard';
import SkeletonCard from '../components/SkeletonCard';
import { TrophyIcon, UsersIcon, ChartIcon, ArrowRightIcon } from '../components/Icons';
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
      icon: TrophyIcon,
      iconBg: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
      title: '해커톤 보러가기',
      desc: '진행 중인 데이터 경진대회를 확인하고 참가 신청하세요.',
      to: '/hackathons',
      cta: '해커톤 보기',
      count: hackathons.length,
      countLabel: '개 대회',
    },
    {
      icon: UsersIcon,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
      title: '팀 찾기',
      desc: '함께할 팀원을 구하거나 팀에 합류하세요.',
      to: '/camp',
      cta: '팀 찾기',
      count: openTeamCount,
      countLabel: '개 모집중',
    },
    {
      icon: ChartIcon,
      iconBg: 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400',
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

  const gridBg = {
    backgroundImage:
      'linear-gradient(to right, rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-white dark:bg-slate-950 pt-24 pb-20 px-6"
        style={gridBg}
      >
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Eyebrow */}
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-500 uppercase mb-6">
            DAKER PLATFORM
          </p>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-slate-900 dark:text-white">데이터 경진대회</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              팀을 만나다
            </span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
            DAKER에서 해커톤 정보를 확인하고, 나와 맞는 팀원을 찾아 함께 도전하세요.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 justify-center flex-wrap mb-10">
            <Link
              to="/hackathons"
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-base px-6 py-3 rounded-xl transition-colors duration-200 inline-flex items-center gap-2"
            >
              해커톤 탐색
              <ArrowRightIcon size={16} />
            </Link>
            <Link
              to="/camp"
              className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-base px-6 py-3 rounded-xl transition-colors duration-200"
            >
              팀 찾기
            </Link>
          </div>

          {/* Live stats inline */}
          {!loading && ongoingCount > 0 && (
            <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              현재{' '}
              <strong className="text-slate-800 dark:text-slate-200">{ongoingCount}개</strong>{' '}
              진행중
            </div>
          )}
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-1 hover:shadow-sm transition-all duration-200 group bg-white dark:bg-slate-900"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.iconBg}`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {f.desc}
                </p>
                <div className="flex items-center justify-between">
                  {!loading && (
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {f.count}
                      {f.countLabel}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150 ml-auto inline-flex items-center gap-1">
                    {f.cta}
                    <ArrowRightIcon size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats row */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-12">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800">
          {[
            { label: '해커톤', value: hackathons.length, suffix: '개' },
            { label: '모집중인 팀', value: openTeamCount, suffix: '개' },
            { label: '제출', value: totalSubmissions, suffix: '개' },
          ].map((stat) => (
            <div key={stat.label} className="py-6 px-4 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">
                {stat.value}
                <span className="text-lg">{stat.suffix}</span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 text-center mb-3">
            어떻게 사용하나요?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-12">
            3단계로 간단하게 시작하세요
          </p>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Connectors between steps */}
            <div className="hidden sm:block absolute top-4 left-[calc(33.33%+1rem)] right-[calc(66.67%-1rem)] h-px bg-slate-200 dark:bg-slate-700" />
            <div className="hidden sm:block absolute top-4 left-[calc(66.67%+1rem)] right-[calc(33.33%-1rem)] h-px bg-slate-200 dark:bg-slate-700" />

            {howItWorks.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              주요 해커톤
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              지금 참여하거나 준비중인 대회를 확인하세요
            </p>
          </div>
          <Link
            to="/hackathons"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1 flex-shrink-0"
          >
            전체 보기
            <ArrowRightIcon size={13} />
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
