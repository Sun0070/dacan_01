import type { LeaderboardData } from '../types';

export const INITIAL_LEADERBOARDS: LeaderboardData[] = [

  // ── cv-detection-2025-12 (종료, metric 기반) ──────────────────────────
  {
    hackathonSlug: 'cv-detection-2025-12',
    updatedAt: '2025-12-22T10:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'VisionPro',    score: 0.7134, submittedAt: '2025-12-19T23:41:00+09:00' },
      { rank: 2, teamName: 'PixelHunters', score: 0.6981, submittedAt: '2025-12-20T09:18:00+09:00' },
      { rank: 3, teamName: 'DeepEye',      score: 0.6823, submittedAt: '2025-12-19T21:55:00+09:00' },
      { rank: 4, teamName: 'ObjectFirst',  score: 0.6710, submittedAt: '2025-12-20T08:50:00+09:00' },
      { rank: 5, teamName: 'YOLOKings',   score: 0.6544, submittedAt: '2025-12-19T18:30:00+09:00' },
      { rank: 6, teamName: 'BoxCraft',     score: 0.6312, submittedAt: '2025-12-20T09:55:00+09:00' },
    ],
  },

  // ── nlp-sentiment-2026-01 (종료, metric 기반) ─────────────────────────
  {
    hackathonSlug: 'nlp-sentiment-2026-01',
    updatedAt: '2026-01-30T10:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'SentimentX',   score: 0.9241, submittedAt: '2026-01-27T22:15:00+09:00' },
      { rank: 2, teamName: 'NLP Warriors', score: 0.9188, submittedAt: '2026-01-28T09:40:00+09:00' },
      { rank: 3, teamName: 'TextMinds',    score: 0.9072, submittedAt: '2026-01-27T20:00:00+09:00' },
      { rank: 4, teamName: 'KoNLPers',     score: 0.8954, submittedAt: '2026-01-28T09:58:00+09:00' },
      { rank: 5, teamName: 'BERTserk',     score: 0.8831, submittedAt: '2026-01-27T19:20:00+09:00' },
    ],
  },

  // ── aimers-8-model-lite (종료, metric 기반) ───────────────────────────
  {
    hackathonSlug: 'aimers-8-model-lite',
    updatedAt: '2026-02-26T10:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Team Alpha',  score: 0.7421, submittedAt: '2026-02-24T21:05:00+09:00' },
      { rank: 2, teamName: 'Team Gamma',  score: 0.7013, submittedAt: '2026-02-25T09:40:00+09:00' },
      { rank: 3, teamName: 'DeepOpt',     score: 0.6892, submittedAt: '2026-02-24T18:30:00+09:00' },
      { rank: 4, teamName: 'LiteLLM',     score: 0.6715, submittedAt: '2026-02-25T09:55:00+09:00' },
      { rank: 5, teamName: 'QuickInfer',  score: 0.6503, submittedAt: '2026-02-24T15:20:00+09:00' },
    ],
  },

  // ── monthly-vibe-coding-2026-02 (진행중, 투표 기반, 중간 집계) ─────────
  {
    hackathonSlug: 'monthly-vibe-coding-2026-02',
    updatedAt: '2026-03-25T00:00:00+09:00',
    entries: [
      {
        rank: 1,
        teamName: 'AIUXLab',
        score: 72.0,
        submittedAt: '2026-03-20T14:30:00+09:00',
        scoreBreakdown: { participant: 68, judge: 74 },
        artifacts: {
          webUrl: 'https://aiuxlab-demo.vercel.app',
          pdfUrl: 'https://example.com/aiuxlab-plan.pdf',
          planTitle: 'AI 코딩 세션 자동 인사이트 추출 서비스',
        },
      },
      {
        rank: 2,
        teamName: 'FlowMasters',
        score: 68.5,
        submittedAt: '2026-03-19T10:00:00+09:00',
        scoreBreakdown: { participant: 71, judge: 67 },
        artifacts: {
          webUrl: 'https://flowmasters-demo.vercel.app',
          pdfUrl: 'https://example.com/flowmasters-plan.pdf',
          planTitle: 'Vibe Coding 워크플로우 자동화 플랫폼',
        },
      },
      {
        rank: 3,
        teamName: 'PromptRunners',
        score: 65.2,
        submittedAt: '2026-03-18T16:00:00+09:00',
        scoreBreakdown: { participant: 63, judge: 66 },
        artifacts: {
          planTitle: '프롬프트 품질 점수화 & 개선 가이드 UX',
        },
      },
    ],
  },

  // ── time-series-forecast-2026-03 (진행중, metric 기반, 중간 집계) ──────
  {
    hackathonSlug: 'time-series-forecast-2026-03',
    updatedAt: '2026-03-25T00:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'TimeHackers', score: 182.4, submittedAt: '2026-03-24T22:10:00+09:00' },
      { rank: 2, teamName: 'ForecastX',   score: 195.7, submittedAt: '2026-03-23T19:50:00+09:00' },
      { rank: 3, teamName: 'WaveRiders',  score: 213.1, submittedAt: '2026-03-22T11:30:00+09:00' },
      { rank: 4, teamName: 'EnergySeer',  score: 228.6, submittedAt: '2026-03-24T20:00:00+09:00' },
    ],
  },

  // ── daker-handover-2026-03 (예정, 투표 기반, 예시 데이터) ────────────
  {
    hackathonSlug: 'daker-handover-2026-03',
    updatedAt: '2026-04-17T10:00:00+09:00',
    entries: [
      {
        rank: 1,
        teamName: '404found',
        score: 87.5,
        submittedAt: '2026-04-13T09:58:00+09:00',
        scoreBreakdown: { participant: 82, judge: 90 },
        artifacts: {
          webUrl: 'https://404found.vercel.app',
          pdfUrl: 'https://example.com/404found-solution.pdf',
          planTitle: '404found 기획서',
        },
      },
      {
        rank: 2,
        teamName: 'LGTM',
        score: 84.2,
        submittedAt: '2026-04-13T09:40:00+09:00',
        scoreBreakdown: { participant: 79, judge: 88 },
        artifacts: {
          webUrl: 'https://lgtm-hack.vercel.app',
          pdfUrl: 'https://example.com/lgtm-solution.pdf',
          planTitle: 'LGTM 기획서',
        },
      },
      {
        rank: 3,
        teamName: 'DevDocs',
        score: 79.8,
        submittedAt: '2026-04-13T10:00:00+09:00',
        scoreBreakdown: { participant: 75, judge: 83 },
        artifacts: {
          webUrl: 'https://devdocs-hack.vercel.app',
          pdfUrl: 'https://example.com/devdocs-solution.pdf',
          planTitle: 'DevDocs 기획서',
        },
      },
    ],
  },
];
