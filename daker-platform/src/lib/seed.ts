import {
  isSeeded,
  markSeeded,
  setHackathons,
  setHackathonDetails,
  setTeams,
  setLeaderboards,
  setSubmissions,
  setProfile,
} from './storage';
import { INITIAL_HACKATHONS } from '../data/hackathons';
import { INITIAL_HACKATHON_DETAILS } from '../data/hackathonDetails';
import { INITIAL_TEAMS } from '../data/teams';
import { INITIAL_LEADERBOARDS } from '../data/leaderboard';

export function seedIfNeeded(): void {
  if (isSeeded()) return;
  setHackathons(INITIAL_HACKATHONS);
  setHackathonDetails(INITIAL_HACKATHON_DETAILS);
  setTeams(INITIAL_TEAMS);
  setLeaderboards(INITIAL_LEADERBOARDS);
  setSubmissions([
    {
      id: 'SUB-001',
      hackathonSlug: 'monthly-vibe-coding-2026-02',
      teamName: 'FlowMasters',
      submittedAt: '2026-03-19T10:00:00+09:00',
      items: {
        plan: 'Vibe Coding 워크플로우 자동화 플랫폼',
        web: 'https://flowmasters-demo.vercel.app',
        pdf: 'https://example.com/flowmasters-plan.pdf',
      },
    },
    {
      id: 'SUB-002',
      hackathonSlug: 'time-series-forecast-2026-03',
      teamName: 'WaveRiders',
      submittedAt: '2026-03-22T11:30:00+09:00',
      items: {
        plan: '전력 수요 LSTM + XGBoost 앙상블 예측',
        web: 'https://waveriders-ts.vercel.app',
        pdf: 'https://example.com/waveriders-report.pdf',
      },
    },
    {
      id: 'SUB-003',
      hackathonSlug: 'nlp-sentiment-2026-01',
      teamName: 'TextMinds',
      submittedAt: '2026-01-27T20:00:00+09:00',
      items: {
        plan: 'KoELECTRA 기반 멀티라벨 감성 분류',
        pdf: 'https://example.com/textminds-report.pdf',
      },
    },
  ]);
  setProfile({
    name: '김다커',
    role: 'ML Engineer',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'SQL'],
    bookmarks: [
      'monthly-vibe-coding-2026-02',
      'time-series-forecast-2026-03',
      'daker-handover-2026-03',
    ],
    myTeamCodes: ['T-VIBE-02', 'T-TS-03'],
  });
  markSeeded();
}
