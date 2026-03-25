import { useEffect, useState } from 'react';
import { getHackathons, getLeaderboards } from '../lib/storage';
import type { Hackathon, LeaderboardEntry } from '../types';

interface GlobalEntry extends LeaderboardEntry {
  hackathonSlug: string;
  hackathonTitle: string;
  globalRank: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatScore(score: number): string {
  return `${score % 1 === 0 ? score.toFixed(0) : score}점`;
}

export default function Rankings() {
  const [allEntries, setAllEntries] = useState<GlobalEntry[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [hackathonFilter, setHackathonFilter] = useState('all');

  useEffect(() => {
    const leaderboards = getLeaderboards();
    const hacks = getHackathons();
    setHackathons(hacks);

    const combined: Omit<GlobalEntry, 'globalRank'>[] = [];
    for (const lb of leaderboards) {
      const hackathon = hacks.find((h) => h.slug === lb.hackathonSlug);
      for (const entry of lb.entries) {
        combined.push({
          ...entry,
          hackathonSlug: lb.hackathonSlug,
          hackathonTitle: hackathon?.title ?? lb.hackathonSlug,
        });
      }
    }

    combined.sort((a, b) => b.score - a.score);
    const ranked = combined.map((e, i) => ({ ...e, globalRank: i + 1 }));
    setAllEntries(ranked);
  }, []);

  const filtered =
    hackathonFilter === 'all'
      ? allEntries
      : allEntries.filter((e) => e.hackathonSlug === hackathonFilter);

  const top3 = filtered.slice(0, 3);

  const podiumConfig = [
    { position: 2, heightClass: 'h-16', icon: '🥈', label: '2위', borderColor: 'border-slate-300 dark:border-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800' },
    { position: 1, heightClass: 'h-24', icon: '🥇', label: '1위', borderColor: 'border-amber-300 dark:border-amber-700', bgColor: 'bg-amber-50 dark:bg-amber-950' },
    { position: 3, heightClass: 'h-12', icon: '🥉', label: '3위', borderColor: 'border-orange-300 dark:border-orange-700', bgColor: 'bg-orange-50 dark:bg-orange-950' },
  ];

  const hasScoreBreakdown = filtered.some((e) => e.scoreBreakdown !== undefined);
  const hasArtifacts = filtered.some((e) => e.artifacts?.webUrl || e.artifacts?.pdfUrl);

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-1.5">
          랭킹
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          전체 해커톤 통합 리더보드
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={hackathonFilter}
          onChange={(e) => setHackathonFilter(e.target.value)}
          className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
        >
          <option value="all">전체 해커톤</option>
          {hackathons.map((h) => (
            <option key={h.slug} value={h.slug}>
              {h.title}
            </option>
          ))}
        </select>
      </div>

      {/* Podium */}
      {top3.length >= 2 && (
        <div className="mb-10 flex items-end justify-center gap-4">
          {podiumConfig.map((p) => {
            const entry = filtered.find((e) => e.rank === p.position || e.globalRank === p.position);
            if (!entry) return null;
            return (
              <div key={p.position} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{p.icon}</span>
                <div className="text-center">
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{entry.teamName}</p>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {formatScore(entry.score)}
                  </p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full truncate max-w-[100px]">
                    {entry.hackathonTitle}
                  </span>
                </div>
                <div className={`w-20 ${p.heightClass} ${p.bgColor} border-t-2 ${p.borderColor} rounded-t-xl flex items-start justify-center pt-2`}>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{p.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary line */}
      {filtered.length > 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          총 <span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}팀</span> 참여
        </p>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl font-black text-slate-100 dark:text-slate-800 mb-3 select-none">데이터 없음</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">랭킹 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-left">
                  <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide w-16">순위</th>
                  <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">팀명</th>
                  <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide hidden sm:table-cell">해커톤</th>
                  <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide text-right">점수</th>
                  {hasScoreBreakdown && (
                    <>
                      <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide text-right hidden md:table-cell">참가자</th>
                      <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide text-right hidden md:table-cell">심사위원</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">제출일시</th>
                  {hasArtifacts && (
                    <th className="py-3 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">결과물</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((entry) => (
                  <tr
                    key={`${entry.hackathonSlug}-${entry.teamName}`}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${
                      entry.globalRank === 1 ? 'border-l-4 border-l-amber-400' : entry.globalRank === 2 ? 'border-l-4 border-l-slate-400' : entry.globalRank === 3 ? 'border-l-4 border-l-orange-400' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {entry.globalRank === 1 ? (
                        <span>🥇 1</span>
                      ) : entry.globalRank === 2 ? (
                        <span>🥈 2</span>
                      ) : entry.globalRank === 3 ? (
                        <span>🥉 3</span>
                      ) : (
                        entry.globalRank
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                      {entry.teamName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell text-xs">
                      {entry.hackathonTitle}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {formatScore(entry.score)}
                    </td>
                    {hasScoreBreakdown && (
                      <>
                        <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 hidden md:table-cell text-xs">
                          {entry.scoreBreakdown?.participant !== undefined
                            ? `${entry.scoreBreakdown.participant}점`
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 hidden md:table-cell text-xs">
                          {entry.scoreBreakdown?.judge !== undefined
                            ? `${entry.scoreBreakdown.judge}점`
                            : '-'}
                        </td>
                      </>
                    )}
                    <td className="py-3 px-4 text-xs text-slate-400 dark:text-slate-500 hidden lg:table-cell">
                      {formatDate(entry.submittedAt)}
                    </td>
                    {hasArtifacts && (
                      <td className="py-3 px-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {entry.artifacts?.webUrl && (
                            <a
                              href={entry.artifacts.webUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-150"
                            >
                              웹 링크
                            </a>
                          )}
                          {entry.artifacts?.pdfUrl && (
                            <a
                              href={entry.artifacts.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-150"
                            >
                              PDF 링크
                            </a>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
