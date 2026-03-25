import type { Hackathon, HackathonDetail, Team, LeaderboardData, Submission, UserProfile } from '../types';

const KEYS = {
  HACKATHONS: 'daker_hackathons',
  HACKATHON_DETAILS: 'daker_hackathon_details',
  TEAMS: 'daker_teams',
  LEADERBOARDS: 'daker_leaderboards',
  SUBMISSIONS: 'daker_submissions',
  PROFILE: 'daker_profile',
  SEEDED: 'daker_seeded_v2',
  THEME: 'daker_theme',
};

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
}

export function getHackathons(): Hackathon[] {
  return get<Hackathon[]>(KEYS.HACKATHONS) ?? [];
}

export function setHackathons(data: Hackathon[]): void {
  set(KEYS.HACKATHONS, data);
}

export function getHackathonDetails(): Record<string, HackathonDetail> {
  return get<Record<string, HackathonDetail>>(KEYS.HACKATHON_DETAILS) ?? {};
}

export function setHackathonDetails(data: Record<string, HackathonDetail>): void {
  set(KEYS.HACKATHON_DETAILS, data);
}

export function getTeams(): Team[] {
  return get<Team[]>(KEYS.TEAMS) ?? [];
}

export function setTeams(data: Team[]): void {
  set(KEYS.TEAMS, data);
}

export function addTeam(team: Team): void {
  const teams = getTeams();
  teams.push(team);
  setTeams(teams);
}

export function updateTeam(teamCode: string, updates: Partial<Team>): void {
  const teams = getTeams();
  const idx = teams.findIndex((t) => t.teamCode === teamCode);
  if (idx !== -1) {
    teams[idx] = { ...teams[idx], ...updates };
    setTeams(teams);
  }
}

export function deleteTeam(teamCode: string): void {
  const teams = getTeams().filter((t) => t.teamCode !== teamCode);
  setTeams(teams);
}

export function getLeaderboards(): LeaderboardData[] {
  return get<LeaderboardData[]>(KEYS.LEADERBOARDS) ?? [];
}

export function setLeaderboards(data: LeaderboardData[]): void {
  set(KEYS.LEADERBOARDS, data);
}

export function getSubmissions(): Submission[] {
  return get<Submission[]>(KEYS.SUBMISSIONS) ?? [];
}

export function setSubmissions(data: Submission[]): void {
  set(KEYS.SUBMISSIONS, data);
}

export function addSubmission(submission: Submission): void {
  const submissions = getSubmissions();
  submissions.push(submission);
  setSubmissions(submissions);
}

export function getProfile(): UserProfile {
  return (
    get<UserProfile>(KEYS.PROFILE) ?? {
      name: '',
      role: '',
      skills: [],
      bookmarks: [],
      myTeamCodes: [],
    }
  );
}

export function setProfile(profile: UserProfile): void {
  set(KEYS.PROFILE, profile);
}

export function isSeeded(): boolean {
  return get<boolean>(KEYS.SEEDED) === true;
}

export function markSeeded(): void {
  set(KEYS.SEEDED, true);
}

export function getTheme(): 'light' | 'dark' {
  const stored = get<string>(KEYS.THEME);
  if (stored === 'dark') return 'dark';
  return 'light';
}

export function setTheme(theme: 'light' | 'dark'): void {
  set(KEYS.THEME, theme);
}
