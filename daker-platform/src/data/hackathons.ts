import type { Hackathon } from '../types';

export const INITIAL_HACKATHONS: Hackathon[] = [
  // ── ENDED ──────────────────────────────────────────────────────────────
  {
    slug: 'cv-detection-2025-12',
    title: '컴퓨터 비전 챌린지 : 객체 탐지 정확도 최적화',
    status: 'ended',
    tags: ['CV', 'ObjectDetection', 'PyTorch', 'YOLO'],
    thumbnailUrl: 'https://example.com/public/img/cv2025.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2025-12-20T10:00:00+09:00',
      endAt: '2025-12-22T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/cv-detection-2025-12',
      rules: 'https://example.com/rules/cv2025',
      faq: 'https://example.com/faq/cv2025',
    },
  },
  {
    slug: 'nlp-sentiment-2026-01',
    title: 'NLP 감성 분석 해커톤 : 리뷰 데이터로 감정 읽기',
    status: 'ended',
    tags: ['NLP', 'Sentiment', 'BERT', 'HuggingFace'],
    thumbnailUrl: 'https://example.com/public/img/nlp2026.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-01-28T10:00:00+09:00',
      endAt: '2026-01-30T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/nlp-sentiment-2026-01',
      rules: 'https://example.com/rules/nlp2026',
      faq: 'https://example.com/faq/nlp2026',
    },
  },
  {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    status: 'ended',
    tags: ['LLM', 'Compression', 'vLLM'],
    thumbnailUrl: 'https://example.com/public/img/aimers8.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-02-25T10:00:00+09:00',
      endAt: '2026-02-26T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/aimers-8-model-lite',
      rules: 'https://example.com/public/rules/aimers8',
      faq: 'https://example.com/public/faq/aimers8',
    },
  },
  // ── ONGOING ────────────────────────────────────────────────────────────
  {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.03)',
    status: 'ongoing',
    tags: ['Idea', 'GenAI', 'Workflow', 'Productivity'],
    thumbnailUrl: 'https://example.com/public/img/vibe202603.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-04-10T10:00:00+09:00',
      endAt: '2026-04-15T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/monthly-vibe-coding-2026-02',
      rules: 'https://example.com/public/rules/vibe202602',
      faq: 'https://example.com/public/faq/vibe202602',
    },
  },
  {
    slug: 'time-series-forecast-2026-03',
    title: '시계열 예측 챌린지 : 전력 수요 패턴 예측 대회',
    status: 'ongoing',
    tags: ['TimeSeries', 'Forecasting', 'Energy', 'LSTM', 'XGBoost'],
    thumbnailUrl: 'https://example.com/public/img/ts2026.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-04-20T10:00:00+09:00',
      endAt: '2026-04-25T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/time-series-forecast-2026-03',
      rules: 'https://example.com/rules/ts2026',
      faq: 'https://example.com/faq/ts2026',
    },
  },
  // ── UPCOMING ───────────────────────────────────────────────────────────
  {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    status: 'upcoming',
    tags: ['VibeCoding', 'Web', 'Vercel', 'Handover'],
    thumbnailUrl: 'https://example.com/public/img/daker-handover-202603.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-03-30T10:00:00+09:00',
      endAt: '2026-04-27T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/daker-handover-2026-03',
      rules: 'https://example.com/public/rules/daker-handover-202603',
      faq: 'https://example.com/public/faq/daker-handover-202603',
    },
  },
  {
    slug: 'recsys-challenge-2026-04',
    title: '추천 시스템 챌린지 : 클릭률 예측 & 개인화 랭킹',
    status: 'upcoming',
    tags: ['RecSys', 'Personalization', 'CTR', 'Collaborative Filtering'],
    thumbnailUrl: 'https://example.com/public/img/recsys2026.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-05-10T10:00:00+09:00',
      endAt: '2026-05-15T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/recsys-challenge-2026-04',
      rules: 'https://example.com/rules/recsys2026',
      faq: 'https://example.com/faq/recsys2026',
    },
  },
  {
    slug: 'multimodal-ai-2026-05',
    title: '멀티모달 AI 해커톤 : 이미지 + 텍스트 융합 챌린지',
    status: 'upcoming',
    tags: ['Multimodal', 'VLM', 'CLIP', 'GenAI', 'Vision'],
    thumbnailUrl: 'https://example.com/public/img/multimodal2026.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-06-01T10:00:00+09:00',
      endAt: '2026-06-07T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/multimodal-ai-2026-05',
      rules: 'https://example.com/rules/multimodal2026',
      faq: 'https://example.com/faq/multimodal2026',
    },
  },
];
