import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';
import TeamCard from '../components/TeamCard';
import { useToast } from '../context/ToastContext';
import { SearchIcon, XIcon, PlusIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';
import {
  addTeam,
  deleteTeam,
  getHackathons,
  getProfile,
  getTeams,
  setProfile,
  updateTeam,
} from '../lib/storage';
import type { Hackathon, Team } from '../types';

const ROLE_OPTIONS = ['Frontend', 'Backend', 'Designer', 'ML Engineer', 'Data Scientist', 'PM'];

interface TeamFormData {
  name: string;
  hackathonSlug: string;
  intro: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  contactUrl: string;
}

const defaultForm: TeamFormData = {
  name: '',
  hackathonSlug: '',
  intro: '',
  isOpen: true,
  memberCount: 1,
  lookingFor: [],
  contactUrl: '',
};

/* ── sidebar section wrapper ── */
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function Camp() {
  const { showToast } = useToast();
  const location = useLocation();
  const [teams, setTeams] = useState<Team[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [myTeamCodes, setMyTeamCodes] = useState<string[]>([]);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [myRole, setMyRole] = useState('');
  const [myParticipatedSlugs, setMyParticipatedSlugs] = useState<string[]>([]);
  const [profileName, setProfileName] = useState('');
  const [carouselPage, setCarouselPage] = useState(0);

  const [hackathonFilter, setHackathonFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState(
    (location.state as { searchQuery?: string } | null)?.searchQuery ?? ''
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeamCode, setEditingTeamCode] = useState<string | null>(null);
  const [form, setForm] = useState<TeamFormData>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const allTeams = getTeams();
    const allHackathons = getHackathons();
    const profile = getProfile();
    setTeams(allTeams);
    setHackathons(allHackathons);
    setMyTeamCodes(profile.myTeamCodes);
    setMySkills(profile.skills);
    setMyRole(profile.role);
    setProfileName(profile.name);
    const participatedSlugs = allTeams
      .filter((t) => profile.myTeamCodes.includes(t.teamCode))
      .map((t) => t.hackathonSlug);
    setMyParticipatedSlugs(participatedSlugs);
    setLoading(false);
  }, []);

  function refreshTeams() {
    setTeams(getTeams());
    const profile = getProfile();
    setMyTeamCodes(profile.myTeamCodes);
  }

  const filtered = teams.filter((t) => {
    if (hackathonFilter !== 'all' && t.hackathonSlug !== hackathonFilter) return false;
    if (statusFilter === 'open' && !t.isOpen) return false;
    if (statusFilter === 'closed' && t.isOpen) return false;
    if (roleFilter && !t.lookingFor.includes(roleFilter)) return false;
    if (
      searchQuery &&
      !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.intro.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  function scoreTeam(team: Team): { pct: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // 역할 일치 (가장 높은 가중치)
    if (myRole && team.lookingFor.includes(myRole)) {
      score += 40;
      reasons.push(`${myRole} 역할 필요`);
    }

    // 스킬 ↔ 찾는 역할 교차 (e.g. "ML Engineer" 스킬 보유)
    mySkills.forEach((skill) => {
      if (team.lookingFor.includes(skill)) {
        score += 10;
        if (reasons.length < 4) reasons.push(`${skill} 스킬 일치`);
      }
    });

    // 소개글 키워드 매칭 (5점/건, 최대 2건)
    let introHits = 0;
    mySkills.forEach((skill) => {
      if (introHits < 2 && team.intro.toLowerCase().includes(skill.toLowerCase())) {
        score += 5;
        introHits++;
        if (reasons.length < 4) reasons.push(`${skill} 관련 프로젝트`);
      }
    });

    // 참여 중인 대회 (같은 해커톤)
    if (myParticipatedSlugs.includes(team.hackathonSlug)) {
      score += 20;
      reasons.unshift('참여 중인 대회');
    }

    // 모집중 보너스
    if (team.isOpen) score += 5;

    // 100점 만점 환산 (60점 = 100%)
    const pct = Math.min(100, Math.round((score / 60) * 100));
    return { pct, reasons: reasons.slice(0, 3) };
  }

  type ScoredTeam = Team & { pct: number; reasons: string[] };

  const recommended: ScoredTeam[] =
    mySkills.length > 0 || myRole
      ? (teams
          .filter((t) => t.isOpen && !myTeamCodes.includes(t.teamCode))
          .map((t) => ({ ...t, ...scoreTeam(t) }))
          .filter((t) => t.pct >= 70)
          .sort((a, b) => b.pct - a.pct) as ScoredTeam[])
      : [];

  const hasActiveFilter =
    hackathonFilter !== 'all' || statusFilter !== 'all' || roleFilter !== '' || searchQuery !== '';

  function resetFilters() {
    setHackathonFilter('all');
    setStatusFilter('all');
    setRoleFilter('');
    setSearchQuery('');
  }

  function openCreate() {
    setEditingTeamCode(null);
    setForm(defaultForm);
    setModalOpen(true);
  }

  function openEdit(team: Team) {
    setEditingTeamCode(team.teamCode);
    setForm({
      name: team.name,
      hackathonSlug: team.hackathonSlug,
      intro: team.intro,
      isOpen: team.isOpen,
      memberCount: team.memberCount,
      lookingFor: [...team.lookingFor],
      contactUrl: team.contact.url,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.hackathonSlug) {
      showToast('팀 이름과 해커톤을 입력해주세요.', 'error');
      return;
    }

    if (editingTeamCode) {
      updateTeam(editingTeamCode, {
        name: form.name,
        hackathonSlug: form.hackathonSlug,
        intro: form.intro,
        isOpen: form.isOpen,
        memberCount: form.memberCount,
        lookingFor: form.lookingFor,
        contact: { type: 'link', url: form.contactUrl },
      });
      showToast('팀이 수정되었습니다.', 'success');
    } else {
      const teamCode = `T-${Date.now()}`;
      const newTeam: Team = {
        teamCode,
        hackathonSlug: form.hackathonSlug,
        name: form.name,
        isOpen: form.isOpen,
        memberCount: form.memberCount,
        lookingFor: form.lookingFor,
        intro: form.intro,
        contact: { type: 'link', url: form.contactUrl },
        createdAt: new Date().toISOString(),
      };
      addTeam(newTeam);
      const profile = getProfile();
      setProfile({ ...profile, myTeamCodes: [...profile.myTeamCodes, teamCode] });
      showToast('팀이 생성되었습니다!', 'success');
    }

    setModalOpen(false);
    refreshTeams();
  }

  function handleDelete(teamCode: string) {
    deleteTeam(teamCode);
    const profile = getProfile();
    setProfile({
      ...profile,
      myTeamCodes: profile.myTeamCodes.filter((c) => c !== teamCode),
    });
    setDeleteConfirm(null);
    showToast('팀이 삭제되었습니다.', 'info');
    refreshTeams();
  }

  function toggleRole(role: string) {
    setForm((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(role)
        ? prev.lookingFor.filter((r) => r !== role)
        : [...prev.lookingFor, role],
    }));
  }

  function getHackathonTitle(slug: string) {
    return hackathons.find((h) => h.slug === slug)?.title ?? slug;
  }

  /* ── counts ── */
  const openCount = teams.filter((t) => t.isOpen).length;
  const closedCount = teams.filter((t) => !t.isOpen).length;

  /* ── hackathons grouped by status ── */
  const hackathonGroups: { label: string; dot: string; items: Hackathon[] }[] = [
    {
      label: '진행중',
      dot: 'bg-emerald-500 animate-pulse',
      items: hackathons.filter((h) => h.status === 'ongoing'),
    },
    {
      label: '예정',
      dot: 'bg-violet-400',
      items: hackathons.filter((h) => h.status === 'upcoming'),
    },
    {
      label: '종료',
      dot: 'bg-slate-300',
      items: hackathons.filter((h) => h.status === 'ended'),
    },
  ].filter((g) => g.items.length > 0);

  /* ── sidebar content ── */
  const SidebarContent = (
    <>
      {/* 검색 */}
      <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="팀 이름 또는 소개 검색..."
            className="w-full pl-8 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <XIcon size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 모집 상태 */}
      <SidebarSection title="모집 상태">
        <div className="space-y-0.5">
          {([
            { value: 'all' as const, label: '전체', count: teams.length, dot: 'bg-slate-400' },
            { value: 'open' as const, label: '모집중', count: openCount, dot: 'bg-emerald-500 animate-pulse' },
            { value: 'closed' as const, label: '마감', count: closedCount, dot: 'bg-slate-300' },
          ]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                statusFilter === opt.value
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${opt.dot}`} />
                {opt.label}
              </div>
              <span
                className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
                  statusFilter === opt.value
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* 해커톤 */}
      <SidebarSection title="해커톤">
        <div className="space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
          <button
            onClick={() => setHackathonFilter('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
              hackathonFilter === 'all'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>전체</span>
            <span
              className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
                hackathonFilter === 'all'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              {teams.length}
            </span>
          </button>
          {hackathonGroups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-1.5 px-3 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${group.dot}`} />
                <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  {group.label}
                </span>
              </div>
              {group.items.map((h) => {
                const count = teams.filter((t) => t.hackathonSlug === h.slug).length;
                return (
                  <button
                    key={h.slug}
                    onClick={() => setHackathonFilter(h.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                      hackathonFilter === h.slug
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="truncate text-left pr-2">{h.title}</span>
                    <span
                      className={`text-xs font-semibold rounded-full px-1.5 py-0.5 flex-shrink-0 ${
                        hackathonFilter === h.slug
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </SidebarSection>

      {/* 역할 */}
      <SidebarSection title="역할">
        <div className="flex flex-wrap gap-1.5">
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-150 ${
                roleFilter === role
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* 필터 초기화 */}
      {hasActiveFilter && (
        <div className="px-4 py-3">
          <button
            onClick={resetFilters}
            className="w-full text-sm text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-medium py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors duration-150"
          >
            필터 초기화
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            팀 찾기
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            함께할 팀을 찾거나 새 팀을 만들어보세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen((v) => !v)}
            className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-150 ${
              hasActiveFilter
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <FilterIcon size={14} />
            필터
            {hasActiveFilter && (
              <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center">
                {[hackathonFilter !== 'all', statusFilter !== 'all', roleFilter !== '', searchQuery !== ''].filter(Boolean).length}
              </span>
            )}
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-150"
          >
            <PlusIcon size={14} />
            <span className="hidden sm:inline">팀 만들기</span>
            <span className="sm:hidden">팀</span>
          </button>
        </div>
      </div>

      {/* Mobile filter panel */}
      {mobileFilterOpen && (
        <div className="lg:hidden mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {SidebarContent}
        </div>
      )}

      <div className="flex gap-6">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden self-start sticky top-20">
          {SidebarContent}
        </aside>

        {/* ── Right panel ── */}
        <div className="flex-1 min-w-0">
          {/* AI 팀 매칭 추천 */}
          {!loading && recommended.length > 0 && (() => {
            const PER_PAGE = 3;
            const totalPages = Math.ceil(recommended.length / PER_PAGE);
            const pageTeams = recommended.slice(carouselPage * PER_PAGE, (carouselPage + 1) * PER_PAGE);
            return (
              <div className="mb-6">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-indigo-600 dark:bg-indigo-700 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-bold">
                      {profileName ? `${profileName}님 맞춤 팀 추천` : 'AI 팀 매칭'}
                    </span>
                    <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 font-semibold">
                      {recommended.length}팀
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-indigo-200 text-xs hidden sm:block">
                      역할 · 스킬 · 참여 이력 기반 자동 분석
                    </p>
                    {totalPages > 1 && (
                      <span className="text-white/60 text-xs tabular-nums">
                        {carouselPage + 1}/{totalPages}
                      </span>
                    )}
                  </div>
                </div>
                {/* Cards with outside arrows */}
                <div className="relative border border-t-0 border-indigo-200 dark:border-indigo-800 rounded-b-2xl bg-indigo-50 dark:bg-indigo-950/40">
                  {totalPages > 1 && (
                    <button
                      onClick={() => setCarouselPage((p) => Math.max(0, p - 1))}
                      disabled={carouselPage === 0}
                      className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-600 dark:text-slate-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                    {pageTeams.map((team) => (
                      <TeamCard
                        key={team.teamCode}
                        team={team}
                        hackathonTitle={getHackathonTitle(team.hackathonSlug)}
                        userRole={myRole}
                        matchPct={team.pct}
                        matchReasons={team.reasons}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <button
                      onClick={() => setCarouselPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={carouselPage === totalPages - 1}
                      className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-600 dark:text-slate-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Result count */}
          {!loading && (
            <div className="flex items-center gap-3 mb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {hasActiveFilter
                  ? <><span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}개</span> 결과</>
                  : <>{filtered.length}개의 팀</>
                }
              </p>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>
          )}

          {/* Team list */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} variant="team" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="flex justify-center mb-5">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="text-slate-200 dark:text-slate-700">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
                  <circle cx="24" cy="26" r="3" fill="currentColor" />
                  <circle cx="40" cy="26" r="3" fill="currentColor" />
                  <path d="M20 44c0 0 4-6 12-6s12 6 12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-500 dark:text-slate-400 mb-1">
                조건에 맞는 팀이 없습니다
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">
                다른 필터를 시도해보세요
              </p>
              {hasActiveFilter && (
                <button
                  onClick={resetFilters}
                  className="text-sm font-medium px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-150"
                >
                  필터 초기화
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((team) => (
                <TeamCard
                  key={team.teamCode}
                  team={team}
                  hackathonTitle={getHackathonTitle(team.hackathonSlug)}
                  userRole={myRole}
                  onEdit={myTeamCodes.includes(team.teamCode) ? () => openEdit(team) : undefined}
                  onDelete={
                    myTeamCodes.includes(team.teamCode) ? () => setDeleteConfirm(team.teamCode) : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {editingTeamCode ? '팀 수정' : '팀 만들기'}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  팀원을 모집할 해커톤과 팀 정보를 입력하세요
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors duration-150"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6">
              {/* Section: 기본 정보 */}
              <div className="space-y-4">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  기본 정보
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    팀 이름 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="팀 이름"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    해커톤 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.hackathonSlug}
                    onChange={(e) => setForm((f) => ({ ...f, hackathonSlug: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                  >
                    <option value="">해커톤 선택</option>
                    {hackathons.map((h) => (
                      <option key={h.slug} value={h.slug}>
                        {h.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    소개
                  </label>
                  <textarea
                    rows={3}
                    value={form.intro}
                    onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
                    placeholder="팀 소개를 입력하세요"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Section: 모집 설정 */}
              <div className="space-y-4">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  모집 설정
                </p>

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

                {/* Member count stepper */}
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

                {/* Role chips */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    찾는 역할
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`rounded-lg text-xs px-3 py-1.5 font-medium transition-all duration-150 border ${
                          form.lookingFor.includes(role)
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Section: 연락처 */}
              <div className="space-y-4">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  연락처
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    연락처 URL
                  </label>
                  <input
                    type="url"
                    value={form.contactUrl}
                    onChange={(e) => setForm((f) => ({ ...f, contactUrl: e.target.value }))}
                    placeholder="https://open.kakao.com/..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex flex-col gap-2 p-6 pt-2">
              <button
                onClick={handleSave}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors duration-150"
              >
                {editingTeamCode ? '수정 완료' : '팀 생성'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-2 text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-150"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
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
                onClick={() => handleDelete(deleteConfirm)}
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
