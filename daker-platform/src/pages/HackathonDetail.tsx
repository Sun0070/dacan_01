import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TeamCard from '../components/TeamCard';
import Timeline from '../components/Timeline';
import { useToast } from '../context/ToastContext';
import {
  addSubmission,
  getHackathonDetails,
  getHackathons,
  getLeaderboards,
  getProfile,
  getSubmissions,
  getTeams,
  setProfile,
} from '../lib/storage';
import type { Hackathon, HackathonDetail, LeaderboardData, Submission, Team } from '../types';

type TabKey = 'overview' | 'info' | 'eval' | 'schedule' | 'prize' | 'teams' | 'submit' | 'leaderboard';

const tabLabels: { key: TabKey; label: string }[] = [
  { key: 'overview', label: '개요' },
  { key: 'info', label: '안내' },
  { key: 'eval', label: '평가' },
  { key: 'schedule', label: '일정' },
  { key: 'prize', label: '상금' },
  { key: 'teams', label: '팀' },
  { key: 'submit', label: '제출' },
  { key: 'leaderboard', label: '리더보드' },
];

function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDday(deadline: string): { text: string; className: string } {
  const now = new Date();
  const target = new Date(deadline);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: '마감', className: 'text-slate-400' };
  if (diffDays === 0) return { text: 'D-Day', className: 'text-rose-600 dark:text-rose-400 font-black' };
  if (diffDays <= 5) return { text: `D-${diffDays}`, className: 'text-rose-600 dark:text-rose-400 font-bold' };
  if (diffDays <= 15) return { text: `D-${diffDays}`, className: 'text-amber-600 dark:text-amber-400 font-semibold' };
  return { text: `D-${diffDays}`, className: 'text-slate-500 dark:text-slate-400' };
}

const placeLabels: Record<string, string> = {
  '1st': '1위',
  '2nd': '2위',
  '3rd': '3위',
};

export default function HackathonDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<HackathonDetail | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [hackathonTitle, setHackathonTitle] = useState('');
  const [hackathonStatus, setHackathonStatus] = useState<'upcoming' | 'ongoing' | 'ended'>('upcoming');
  const [teams, setTeams] = useState<Team[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [notFound, setNotFound] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [submitForm, setSubmitForm] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const tabBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      return;
    }
    const details = getHackathonDetails();
    const hackathons = getHackathons();
    const allTeams = getTeams();
    const allLeaderboards = getLeaderboards();
    const allSubmissions = getSubmissions();
    const profile = getProfile();

    const found = details[slug];
    if (!found) {
      setNotFound(true);
      return;
    }
    setDetail(found);

    const hack = hackathons.find((h) => h.slug === slug);
    if (hack) {
      setHackathon(hack);
      setHackathonTitle(hack.title);
      setHackathonStatus(hack.status);
    } else {
      setHackathonTitle(found.title);
    }

    setIsBookmarked(profile.bookmarks.includes(slug));
    setTeams(allTeams.filter((t) => t.hackathonSlug === slug));
    const lb = allLeaderboards.find((l) => l.hackathonSlug === slug);
    setLeaderboard(lb ?? null);
    setSubmissions(allSubmissions.filter((s) => s.hackathonSlug === slug));

    if (found.sections.submit?.submissionItems) {
      const initial: Record<string, string> = {};
      found.sections.submit.submissionItems.forEach((item) => {
        initial[item.key] = '';
      });
      setSubmitForm(initial);
    }
  }, [slug]);

  function toggleBookmark() {
    if (!slug) return;
    const profile = getProfile();
    const updated = profile.bookmarks.includes(slug)
      ? profile.bookmarks.filter((b) => b !== slug)
      : [...profile.bookmarks, slug];
    setProfile({ ...profile, bookmarks: updated });
    setIsBookmarked(updated.includes(slug));
    showToast(updated.includes(slug) ? '북마크에 추가되었습니다.' : '북마크가 해제되었습니다.', 'success');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);
    const profile = getProfile();
    const submission: Submission = {
      id: `sub-${Date.now()}`,
      hackathonSlug: slug,
      teamName: profile.name || '나의 팀',
      submittedAt: new Date().toISOString(),
      items: {
        plan: submitForm['plan'],
        web: submitForm['web'],
        pdf: submitForm['pdf'],
      },
    };
    addSubmission(submission);
    setSubmissions((prev) => [...prev, submission]);
    setSubmitForm({});
    showToast('제출이 완료되었습니다!', 'success');
    setSubmitting(false);
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-center">
        <p className="text-6xl font-black text-slate-100 dark:text-slate-800 mb-6 select-none">404</p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          상세 정보를 불러올 수 없습니다
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          해당 해커톤의 상세 정보가 존재하지 않습니다.
        </p>
        <a
          href="/hackathons"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-150"
        >
          목록으로 돌아가기
        </a>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10 animate-pulse">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mb-6" />
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-2/3 mb-4" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3 mb-8" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
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

  const { label: statusLabel, badgeClass, dotClass } = statusConfig[hackathonStatus];
  const ddayInfo = hackathon ? getDday(hackathon.period.submissionDeadlineAt) : null;

  const totalPrize = detail.sections.prize
    ? detail.sections.prize.items.reduce((sum, item) => sum + item.amountKRW, 0)
    : null;

  function renderTabContent() {
    if (!detail) return null;
    const s = detail.sections;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 pt-6 pb-10">
            {hackathon && hackathon.tags.length > 0 && (
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
            )}

            {s.overview ? (
              <>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {s.overview.summary}
                </p>
                {s.overview.teamPolicy && (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      팀 정책
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${s.overview.teamPolicy.allowSolo ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300'}`}>
                          {s.overview.teamPolicy.allowSolo ? '✓' : '✕'}
                        </span>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">솔로 참가</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {s.overview.teamPolicy.allowSolo ? '가능' : '불가'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {s.overview.teamPolicy.maxTeamSize}
                        </span>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">최대 팀 인원</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            최대 {s.overview.teamPolicy.maxTeamSize}명
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">개요 정보가 없습니다.</p>
            )}
          </div>
        );

      case 'info':
        return (
          <div className="space-y-4 pt-6 pb-10">
            {s.info ? (
              <>
                <ul className="space-y-2.5">
                  {s.info.notice.map((n, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
                {s.info.links && (
                  <div className="flex gap-3 pt-2">
                    {s.info.links.rules && (
                      <a
                        href={s.info.links.rules}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        규정 보기 →
                      </a>
                    )}
                    {s.info.links.faq && (
                      <a
                        href={s.info.links.faq}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        FAQ 보기 →
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">안내 정보가 없습니다.</p>
            )}
          </div>
        );

      case 'eval':
        return (
          <div className="space-y-4 pt-6 pb-10">
            {s.eval ? (
              <>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">평가 지표</p>
                  <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                    {s.eval.metricName}
                  </p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{s.eval.description}</p>

                {s.eval.scoreDisplay && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      {s.eval.scoreDisplay.label}
                    </p>
                    <div className="space-y-3">
                      {s.eval.scoreDisplay.breakdown.map((item) => (
                        <div key={item.key}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {item.weightPercent}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all"
                              style={{ width: `${item.weightPercent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {s.eval.limits && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {s.eval.limits.maxRuntimeSec !== undefined && (
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">최대 실행 시간</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {s.eval.limits.maxRuntimeSec}초
                        </p>
                      </div>
                    )}
                    {s.eval.limits.maxSubmissionsPerDay !== undefined && (
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">일일 제출 제한</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {s.eval.limits.maxSubmissionsPerDay}회
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">평가 정보가 없습니다.</p>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="pt-6 pb-10">
            {s.schedule ? (
              <Timeline milestones={s.schedule.milestones} />
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">일정 정보가 없습니다.</p>
            )}
          </div>
        );

      case 'prize':
        return (
          <div className="space-y-4 pt-6 pb-10">
            {s.prize ? (
              <>
                {totalPrize !== null && (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">총 상금</span>
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatKRW(totalPrize)}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {s.prize.items.slice(0, 3).map((item) => {
                    const is1st = item.place === '1st';
                    const is2nd = item.place === '2nd';
                    const cardClass = is1st
                      ? 'border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50'
                      : is2nd
                      ? 'border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                      : 'border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50';
                    const medalSymbol = is1st ? '🥇' : is2nd ? '🥈' : '🥉';
                    return (
                      <div
                        key={item.place}
                        className={`rounded-2xl p-5 text-center ${cardClass}`}
                      >
                        <div className="text-3xl mb-2">{medalSymbol}</div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {placeLabels[item.place] ?? item.place}
                        </p>
                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          {formatKRW(item.amountKRW)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {s.prize.items.length > 3 && (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wide">순위</th>
                          <th className="text-right py-3 px-4 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wide">상금</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {s.prize.items.slice(3).map((item) => (
                          <tr
                            key={item.place}
                            className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                              {placeLabels[item.place] ?? item.place}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                              {formatKRW(item.amountKRW)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">상금 정보가 없습니다.</p>
            )}
          </div>
        );

      case 'teams':
        return (
          <div className="pt-6 pb-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {teams.length}개의 팀이 참여 중입니다.
              </p>
              <a
                href="/camp"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-150"
              >
                팀 만들기
              </a>
            </div>
            {teams.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                <p className="text-3xl font-black text-slate-100 dark:text-slate-800 mb-3 select-none">팀 없음</p>
                <p className="text-sm">아직 팀이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <TeamCard key={team.teamCode} team={team} />
                ))}
              </div>
            )}
          </div>
        );

      case 'submit':
        return (
          <div className="space-y-6 pt-6 pb-10">
            {s.submit ? (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">제출 가이드</h3>
                  <ol className="space-y-2.5">
                    {s.submit.guide.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-lg text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {s.submit.submissionItems && s.submit.submissionItems.length > 0 ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">제출 폼</h3>
                    {s.submit.submissionItems.map((item) => (
                      <div key={item.key}>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {item.title}
                        </label>
                        {item.format === 'text_or_url' ? (
                          <textarea
                            rows={3}
                            value={submitForm[item.key] ?? ''}
                            onChange={(e) =>
                              setSubmitForm((prev) => ({ ...prev, [item.key]: e.target.value }))
                            }
                            placeholder="텍스트 또는 URL을 입력하세요"
                            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                          />
                        ) : (
                          <input
                            type="url"
                            value={submitForm[item.key] ?? ''}
                            onChange={(e) =>
                              setSubmitForm((prev) => ({ ...prev, [item.key]: e.target.value }))
                            }
                            placeholder={
                              item.format === 'pdf_url' ? 'PDF URL을 입력하세요' : 'URL을 입력하세요'
                            }
                            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-medium text-sm transition-colors duration-150 disabled:opacity-50"
                    >
                      {submitting ? '제출 중...' : '제출하기'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
                    허용 제출 형식: {s.submit.allowedArtifactTypes.join(', ')}
                  </div>
                )}

                {submissions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      내 제출 이력
                    </h3>
                    <div className="space-y-2">
                      {submissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-sm"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {sub.teamName}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(sub.submittedAt)}</span>
                          </div>
                          <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            {sub.items.plan && <p>기획서: {sub.items.plan}</p>}
                            {sub.items.web && <p>웹링크: {sub.items.web}</p>}
                            {sub.items.pdf && <p>PDF: {sub.items.pdf}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">제출 정보가 없습니다.</p>
            )}
          </div>
        );

      case 'leaderboard':
        return (
          <div className="pt-6 pb-10">
            {s.leaderboard && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-2">
                {s.leaderboard.note}
              </p>
            )}
            {!leaderboard || leaderboard.entries.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                <p className="text-3xl font-black text-slate-100 dark:text-slate-800 mb-3 select-none">데이터 없음</p>
                <p className="text-sm">아직 리더보드 데이터가 없습니다.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                  업데이트: {formatDate(leaderboard.updatedAt)}
                </p>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-left">
                          <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide w-12">순위</th>
                          <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">팀명</th>
                          <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide text-right">점수</th>
                          <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide text-right hidden sm:table-cell">참가자</th>
                          <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide text-right hidden sm:table-cell">심사위원</th>
                          <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">제출일시</th>
                          <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">결과물</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {leaderboard.entries.map((entry) => (
                          <tr
                            key={entry.rank}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${
                              entry.rank === 1 ? 'border-l-4 border-l-amber-400' : entry.rank === 2 ? 'border-l-4 border-l-slate-400' : entry.rank === 3 ? 'border-l-4 border-l-orange-400' : ''
                            }`}
                          >
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                              {entry.teamName}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                              {entry.score}점
                            </td>
                            <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 hidden sm:table-cell text-xs">
                              {entry.scoreBreakdown?.participant ?? '-'}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 hidden sm:table-cell text-xs">
                              {entry.scoreBreakdown?.judge ?? '-'}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-400 dark:text-slate-500 hidden md:table-cell">
                              {formatDate(entry.submittedAt)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1.5 flex-wrap">
                                {entry.artifacts?.webUrl && (
                                  <a
                                    href={entry.artifacts.webUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-150"
                                  >
                                    웹
                                  </a>
                                )}
                                {entry.artifacts?.pdfUrl && (
                                  <a
                                    href={entry.artifacts.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-150"
                                  >
                                    PDF
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8">
      {/* Clean Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pt-8 pb-6 mb-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-4">
          <Link to="/hackathons" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            해커톤
          </Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
            {hackathonTitle || detail.title}
          </span>
        </nav>

        {/* Status badge */}
        <div className="mb-3">
          <span className={badgeClass}>
            <span className={dotClass} />
            {statusLabel}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-tight mb-4">
          {hackathonTitle || detail.title}
        </h1>

        {/* Tags */}
        {hackathon && hackathon.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hackathon.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {hackathon && ddayInfo && (
            <>
              <span className="text-slate-500 dark:text-slate-400">
                마감{' '}
                <strong className="text-slate-700 dark:text-slate-300">
                  {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </strong>
              </span>
              <span className={`text-sm ${ddayInfo.className}`}>{ddayInfo.text}</span>
            </>
          )}
          {totalPrize !== null && (
            <span className="text-slate-500 dark:text-slate-400">
              총 상금{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">{formatKRW(totalPrize)}</strong>
            </span>
          )}
          <button
            onClick={toggleBookmark}
            className={`ml-auto text-sm font-medium px-3 py-1.5 rounded-xl border transition-all duration-150 ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
            aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
          >
            {isBookmarked ? '★ 북마크됨' : '☆ 북마크'}
          </button>
        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div
        ref={tabBarRef}
        className="sticky top-16 z-30 bg-white dark:bg-slate-950 -mx-6 sm:-mx-8 px-6 sm:px-8 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="flex overflow-x-auto gap-0 hide-scrollbar">
          {tabLabels.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-3 py-3 text-sm font-medium border-b-2 transition-all duration-150 ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">{renderTabContent()}</div>
    </div>
  );
}
