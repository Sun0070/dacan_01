export interface Hackathon {
  slug: string;
  title: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
  links: {
    detail: string;
    rules?: string;
    faq?: string;
  };
}

export interface TeamPolicy {
  allowSolo: boolean;
  maxTeamSize: number;
}

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  weightPercent: number;
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview?: {
      summary: string;
      teamPolicy?: TeamPolicy;
    };
    info?: {
      notice: string[];
      links?: { rules?: string; faq?: string };
    };
    eval?: {
      metricName: string;
      description: string;
      limits?: { maxRuntimeSec?: number; maxSubmissionsPerDay?: number };
      scoreSource?: string;
      scoreDisplay?: {
        label: string;
        breakdown: ScoreBreakdownItem[];
      };
    };
    schedule?: {
      timezone: string;
      milestones: { name: string; at: string }[];
    };
    prize?: {
      items: { place: string; amountKRW: number }[];
    };
    teams?: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit?: {
      allowedArtifactTypes: string[];
      submissionUrl: string;
      guide: string[];
      submissionItems?: { key: string; title: string; format: string }[];
    };
    leaderboard?: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}

export interface Team {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: { type: string; url: string };
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: { participant: number; judge: number };
  artifacts?: { webUrl?: string; pdfUrl?: string; planTitle?: string };
}

export interface LeaderboardData {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

export interface Submission {
  id: string;
  hackathonSlug: string;
  teamName: string;
  submittedAt: string;
  items: {
    plan?: string;
    web?: string;
    pdf?: string;
  };
}

export interface UserProfile {
  name: string;
  role: string;
  skills: string[];
  bookmarks: string[];
  myTeamCodes: string[];
}
