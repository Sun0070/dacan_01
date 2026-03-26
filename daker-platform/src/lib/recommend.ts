import type { Hackathon, UserProfile } from '../types';

const SKILL_TAG_MAP: Record<string, string[]> = {
  Python: ['Python', 'XGBoost', 'LSTM', 'TimeSeries', 'Forecasting', 'NLP', 'CV', 'RecSys'],
  'Machine Learning': ['ML', 'XGBoost', 'TimeSeries', 'Forecasting', 'RecSys', 'CTR', 'LLM', 'Compression'],
  'Deep Learning': ['CV', 'NLP', 'Multimodal', 'VLM', 'CLIP', 'BERT', 'HuggingFace', 'YOLO', 'ObjectDetection', 'LLM'],
  PyTorch: ['CV', 'PyTorch', 'ObjectDetection', 'YOLO', 'Multimodal', 'VLM', 'CLIP'],
  SQL: ['TimeSeries', 'RecSys', 'CTR', 'Forecasting'],
};

const ROLE_TAG_MAP: Record<string, string[]> = {
  'ML Engineer': ['ML', 'XGBoost', 'LSTM', 'Forecasting', 'LLM', 'Compression', 'CV', 'NLP', 'Multimodal'],
  'Data Scientist': ['TimeSeries', 'Forecasting', 'RecSys', 'CTR', 'NLP', 'Sentiment', 'CV'],
  Frontend: ['Web', 'Vercel', 'VibeCoding'],
  Backend: ['Web', 'Vercel', 'Handover'],
  Designer: ['VibeCoding', 'Web'],
  PM: ['Idea', 'Workflow', 'Productivity', 'GenAI'],
};

export type ScoredHackathon = Hackathon & { matchPct: number; matchReasons: string[] };

export function scoreHackathon(
  h: Hackathon,
  profile: UserProfile,
): { matchPct: number; matchReasons: string[] } {
  if (h.status === 'ended') return { matchPct: 0, matchReasons: [] };

  let score = 0;
  const reasons: string[] = [];
  const tags = h.tags.map((t) => t.toLowerCase());

  // 1. 역할 기반 태그 매칭 (+15점, 중복 없이 1회)
  const roleTags = ROLE_TAG_MAP[profile.role] ?? [];
  const roleHit = roleTags.some((rt) => tags.includes(rt.toLowerCase()));
  if (roleHit && profile.role) {
    score += 15;
    reasons.push(`${profile.role} 추천 분야`);
  }

  // 2. 스킬별 태그 매칭 (+10점/건)
  profile.skills.forEach((skill) => {
    const related = SKILL_TAG_MAP[skill] ?? [];
    const hit = related.some((rt) => tags.includes(rt.toLowerCase()));
    if (hit) {
      score += 10;
      if (reasons.length < 4) reasons.push(`${skill} 활용 가능`);
    }
    // 태그에 스킬명 직접 포함 보너스 (+5)
    if (tags.includes(skill.toLowerCase())) score += 5;
  });

  // 3. 상태 보너스
  if (h.status === 'ongoing') {
    score += 10;
    reasons.push('지금 진행중');
  } else if (h.status === 'upcoming') {
    score += 5;
    reasons.push('곧 시작');
  }

  const matchPct = Math.min(100, Math.round((score / 60) * 100));
  return { matchPct, matchReasons: reasons.slice(0, 3) };
}

export function getRecommended(
  hackathons: Hackathon[],
  profile: UserProfile,
): ScoredHackathon[] {
  if (!profile.skills.length && !profile.role) return [];
  return hackathons
    .map((h) => ({ ...h, ...scoreHackathon(h, profile) }))
    .filter((h) => h.matchPct >= 70)
    .sort((a, b) => b.matchPct - a.matchPct);
}
