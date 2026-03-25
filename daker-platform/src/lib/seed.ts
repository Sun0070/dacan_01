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
  setSubmissions([]);
  setProfile({
    name: '',
    role: '',
    skills: [],
    bookmarks: [],
    myTeamCodes: [],
  });
  markSeeded();
}
