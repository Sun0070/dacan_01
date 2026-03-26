import { useEffect, useState } from 'react';
import HackathonCard from '../components/HackathonCard';
import TeamCard from '../components/TeamCard';
import { useToast } from '../context/ToastContext';
import { TrophyIcon, UsersIcon, FileIcon, EditIcon, XIcon, AwardIcon } from '../components/Icons';
import {
  deleteTeam,
  getHackathons,
  getLeaderboards,
  getProfile,
  getSubmissions,
  getTeams,
  setProfile,
  updateTeam,
} from '../lib/storage';
import type { Hackathon, Submission, Team, UserProfile } from '../types';

const ROLE_OPTIONS = ['Frontend', 'Backend', 'Designer', 'ML Engineer', 'Data Scientist', 'PM'];
const SKILL_OPTIONS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Machine Learning',
  'Deep Learning',
  'SQL',
  'Docker',
  'Figma',
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex-shrink-0">
        {title}
      </h2>
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default function MyDashboard() {
  const { showToast } = useToast();
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', role: '', skills: [] as string[] });
  const [customSkill, setCustomSkill] = useState('');

  const [bookmarkedHackathons, setBookmarkedHackathons] = useState<Hackathon[]>([]);
  const [participatingHackathons, setParticipatingHackathons] = useState<Hackathon[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  const [bestRank, setBestRank] = useState<number | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfile();
    const allHackathons = getHackathons();
    const allTeams = getTeams();
    const allSubmissions = getSubmissions();

    setProfile(p);
    setProfileState(p);
    setHackathons(allHackathons);

    const bookmarked = allHackathons.filter((h) => p.bookmarks.includes(h.slug));
    setBookmarkedHackathons(bookmarked);

    const myT = allTeams.filter((t) => p.myTeamCodes.includes(t.teamCode));
    setMyTeams(myT);

    const participatingSlugs = [...new Set(myT.map((t) => t.hackathonSlug))];
    setParticipatingHackathons(
      allHackathons.filter((h) => participatingSlugs.includes(h.slug))
    );

    const myTeamNames = myT.map((t) => t.name);
    const allLeaderboards = getLeaderboards();
    let best: number | null = null;
    for (const lb of allLeaderboards) {
      for (const entry of lb.entries) {
        if (myTeamNames.includes(entry.teamName)) {
          if (best === null || entry.rank < best) best = entry.rank;
        }
      }
    }
    setBestRank(best);

    setSubmissions(allSubmissions);
  }, []);

  function startEdit() {
    if (!profile) return;
    setEditForm({ name: profile.name, role: profile.role, skills: [...profile.skills] });
    setEditing(true);
  }

  function saveProfile() {
    if (!profile) return;
    const updated: UserProfile = { ...profile, ...editForm };
    setProfile(updated);
    setProfileState(updated);
    setEditing(false);
    showToast('프로필이 저장되었습니다!', 'success');
  }

  function toggleSkill(skill: string) {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  }

  function addCustomSkill() {
    const s = customSkill.trim();
    if (!s || editForm.skills.includes(s)) return;
    setEditForm((prev) => ({ ...prev, skills: [...prev.skills, s] }));
    setCustomSkill('');
  }

  function removeSkill(skill: string) {
    setEditForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  }

  function handleDeleteTeam(teamCode: string) {
    deleteTeam(teamCode);
    const p = getProfile();
    setProfile({ ...p, myTeamCodes: p.myTeamCodes.filter((c) => c !== teamCode) });
    setMyTeams((prev) => prev.filter((t) => t.teamCode !== teamCode));
    setDeleteConfirm(null);
    showToast('팀이 삭제되었습니다.', 'info');
  }

  function handleEditTeamSave(form: {
    name: string;
    isOpen: boolean;
    memberCount: number;
    intro: string;
    lookingFor: string[];
    contactUrl: string;
  }) {
    if (!editingTeam) return;
    updateTeam(editingTeam.teamCode, {
      name: form.name,
      isOpen: form.isOpen,
      memberCount: form.memberCount,
      intro: form.intro,
      lookingFor: form.lookingFor,
      contact: { type: 'link', url: form.contactUrl },
    });
    setMyTeams((prev) =>
      prev.map((t) =>
        t.teamCode === editingTeam.teamCode
          ? {
              ...t,
              name: form.name,
              isOpen: form.isOpen,
              memberCount: form.memberCount,
              intro: form.intro,
              lookingFor: form.lookingFor,
              contact: { type: 'link', url: form.contactUrl },
            }
          : t
      )
    );
    setEditingTeam(null);
    showToast('팀이 수정되었습니다.', 'success');
  }

  function toggleBookmark(slug: string) {
    const p = getProfile();
    const updated = p.bookmarks.includes(slug)
      ? p.bookmarks.filter((b) => b !== slug)
      : [...p.bookmarks, slug];
    const newProfile = { ...p, bookmarks: updated };
    setProfile(newProfile);
    setProfileState(newProfile);
    const bookmarked = hackathons.filter((h) => updated.includes(h.slug));
    setBookmarkedHackathons(bookmarked);
  }

  function getHackathonTitle(slug: string) {
    return hackathons.find((h) => h.slug === slug)?.title ?? slug;
  }

  if (!profile) return null;

  const initials = profile.name ? profile.name.slice(0, 2).toUpperCase() : '?';

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
      {/* Profile header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start gap-5">
        {/* Large avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                {profile.name || '나의 공간'}
              </h1>
              {profile.role && (
                <span className="inline-block mt-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                  {profile.role}
                </span>
              )}
            </div>
            {!editing && (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150"
              >
                <EditIcon size={14} />
                편집
              </button>
            )}
          </div>
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-5">
            프로필 편집
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                이름
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="이름을 입력하세요"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                역할
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setEditForm((f) => ({ ...f, role: r }))}
                    className={`rounded-full text-xs px-3 py-1.5 font-medium transition-all duration-150 ${
                      editForm.role === r
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                스킬
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {SKILL_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`rounded-full text-xs px-3 py-1.5 font-medium transition-all duration-150 ${
                      editForm.skills.includes(s)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {editForm.skills
                  .filter((s) => !SKILL_OPTIONS.includes(s))
                  .map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1 rounded-full text-xs px-3 py-1.5 bg-indigo-600 text-white"
                    >
                      {s}
                      <button
                        onClick={() => removeSkill(s)}
                        className="opacity-70 hover:opacity-100 leading-none"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                  placeholder="직접 입력..."
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                />
                <button
                  onClick={addCustomSkill}
                  className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors duration-150"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors duration-150"
              >
                저장
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors duration-150"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: '참여 해커톤',
            value: participatingHackathons.length,
            display: String(participatingHackathons.length),
            section: 'participating',
            Icon: TrophyIcon,
          },
          {
            label: '생성한 팀',
            value: myTeams.length,
            display: String(myTeams.length),
            section: 'myteams',
            Icon: UsersIcon,
          },
          {
            label: '제출 횟수',
            value: submissions.length,
            display: String(submissions.length),
            section: 'submissions',
            Icon: FileIcon,
          },
          {
            label: '최고 순위',
            value: bestRank ?? 0,
            display: bestRank !== null ? `${bestRank}위` : '-',
            section: 'submissions',
            Icon: AwardIcon,
          },
        ].map((stat) => {
          const Icon = stat.Icon;
          return (
            <button
              key={stat.label}
              onClick={() => scrollToSection(stat.section)}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer bg-white dark:bg-slate-900"
            >
              <div className="flex justify-center mb-2 text-indigo-400 dark:text-indigo-500">
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stat.display}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </button>
          );
        })}
      </div>

      {/* Participating Hackathons */}
      <section id="participating" className="mb-10 scroll-mt-20">
        <SectionDivider title="참여중인 해커톤" />
        {participatingHackathons.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <p className="text-sm">참여중인 해커톤이 없습니다.</p>
            <p className="text-xs mt-1">팀에 합류하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {participatingHackathons.map((h) => (
              <HackathonCard
                key={h.slug}
                hackathon={h}
                isBookmarked={profile.bookmarks.includes(h.slug)}
                onBookmark={() => toggleBookmark(h.slug)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bookmarked Hackathons */}
      <section id="bookmarks" className="mb-10 scroll-mt-20">
        <SectionDivider title="북마크한 해커톤" />
        {bookmarkedHackathons.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <p className="text-sm">북마크한 해커톤이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedHackathons.map((h) => (
              <HackathonCard
                key={h.slug}
                hackathon={h}
                isBookmarked
                onBookmark={() => toggleBookmark(h.slug)}
                compact
              />
            ))}
          </div>
        )}
      </section>

      {/* My Teams */}
      <section id="myteams" className="mb-10 scroll-mt-20">
        <SectionDivider title="내 팀" />
        {myTeams.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <p className="text-sm">생성한 팀이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myTeams.map((team) => (
              <TeamCard
                key={team.teamCode}
                team={team}
                hackathonTitle={getHackathonTitle(team.hackathonSlug)}
                onEdit={() => setEditingTeam(team)}
                onDelete={() => setDeleteConfirm(team.teamCode)}
              />
            ))}
          </div>
        )}
      </section>

      {/* My Submissions */}
      <section id="submissions" className="mb-10 scroll-mt-20">
        <SectionDivider title="제출 이력" />
        {submissions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <p className="text-sm">제출 이력이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-4 text-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{sub.teamName}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {getHackathonTitle(sub.hackathonSlug)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      검토중
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(sub.submittedAt)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {sub.items.plan && <p>기획서: {sub.items.plan}</p>}
                  {sub.items.web && (
                    <p>
                      웹링크:{' '}
                      <a
                        href={sub.items.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline"
                      >
                        {sub.items.web}
                      </a>
                    </p>
                  )}
                  {sub.items.pdf && (
                    <p>
                      PDF:{' '}
                      <a
                        href={sub.items.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline"
                      >
                        {sub.items.pdf}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Team Modal */}
      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onSave={handleEditTeamSave}
          onClose={() => setEditingTeam(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              팀을 삭제하시겠어요?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteTeam(deleteConfirm)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-sm transition-colors duration-150"
              >
                삭제
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-colors duration-150"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface EditTeamModalProps {
  team: Team;
  onSave: (form: {
    name: string;
    isOpen: boolean;
    memberCount: number;
    intro: string;
    lookingFor: string[];
    contactUrl: string;
  }) => void;
  onClose: () => void;
}

function EditTeamModal({ team, onSave, onClose }: EditTeamModalProps) {
  const [form, setForm] = useState({
    name: team.name,
    isOpen: team.isOpen,
    memberCount: team.memberCount,
    intro: team.intro,
    lookingFor: [...team.lookingFor],
    contactUrl: team.contact.url,
  });

  function toggleRole(role: string) {
    setForm((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(role)
        ? prev.lookingFor.filter((r) => r !== role)
        : [...prev.lookingFor, role],
    }));
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">팀 수정</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors duration-150"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              팀 이름
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              소개
            </label>
            <textarea
              rows={3}
              value={form.intro}
              onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              모집 여부
            </label>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isOpen: !f.isOpen }))}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                form.isOpen ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  form.isOpen ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              현재 인원
            </label>
            <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, memberCount: Math.max(1, f.memberCount - 1) }))
                }
                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 text-base font-bold"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                {form.memberCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, memberCount: Math.min(10, f.memberCount + 1) }))
                }
                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 text-base font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              찾는 역할
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`rounded-full text-xs px-3 py-1.5 font-medium transition-all duration-150 ${
                    form.lookingFor.includes(role)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              연락처 URL
            </label>
            <input
              type="url"
              value={form.contactUrl}
              onChange={(e) => setForm((f) => ({ ...f, contactUrl: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
            />
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex flex-col gap-2 p-6 pt-2">
          <button
            onClick={() => onSave(form)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors duration-150"
          >
            수정 완료
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-150"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
