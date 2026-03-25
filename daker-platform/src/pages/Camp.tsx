import { useEffect, useState } from 'react';
import SkeletonCard from '../components/SkeletonCard';
import TeamCard from '../components/TeamCard';
import { useToast } from '../context/ToastContext';
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

export default function Camp() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [myTeamCodes, setMyTeamCodes] = useState<string[]>([]);
  const [mySkills, setMySkills] = useState<string[]>([]);

  const [hackathonFilter, setHackathonFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    if (roleFilter !== 'all' && !t.lookingFor.includes(roleFilter)) return false;
    if (
      searchQuery &&
      !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.intro.toLowerCase().includes(searchQuery.toLowerCase())
    ) return false;
    return true;
  });

  const recommended =
    mySkills.length > 0
      ? teams.filter((t) => t.isOpen && t.lookingFor.some((r) => mySkills.includes(r)))
      : [];

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

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-1.5">
            팀 찾기
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            함께할 팀을 찾거나 새 팀을 만들어보세요.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-150"
        >
          + 팀 만들기
        </button>
      </div>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <div className="mb-8 p-5 bg-indigo-50 dark:bg-indigo-950 rounded-2xl border border-indigo-100 dark:border-indigo-900">
          <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
            내 스킬 기반 추천 팀
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommended.map((team) => (
              <TeamCard
                key={team.teamCode}
                team={team}
                hackathonTitle={getHackathonTitle(team.hackathonSlug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="mb-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="팀 이름 또는 소개로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 text-sm transition-colors duration-150"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={hackathonFilter}
          onChange={(e) => setHackathonFilter(e.target.value)}
          className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
        >
          <option value="all">전체 해커톤</option>
          {hackathons.map((h) => (
            <option key={h.slug} value={h.slug}>
              {h.title}
            </option>
          ))}
        </select>

        <div className="flex gap-1.5">
          {(['all', 'open', 'closed'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                statusFilter === v
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {v === 'all' ? '전체' : v === 'open' ? '모집중' : '마감'}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setRoleFilter('all')}
            className={`rounded-full text-xs px-3 py-1.5 font-medium transition-all duration-150 ${
              roleFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            전체 역할
          </button>
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-full text-xs px-3 py-1.5 font-medium transition-all duration-150 ${
                roleFilter === role
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          총 <span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}개</span> 팀
        </p>
      )}

      {/* Team List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} variant="team" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400 text-sm">조건에 맞는 팀이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team) => (
            <TeamCard
              key={team.teamCode}
              team={team}
              hackathonTitle={getHackathonTitle(team.hackathonSlug)}
              onEdit={myTeamCodes.includes(team.teamCode) ? () => openEdit(team) : undefined}
              onDelete={
                myTeamCodes.includes(team.teamCode) ? () => setDeleteConfirm(team.teamCode) : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingTeamCode ? '팀 수정' : '팀 만들기'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors duration-150 text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  모집 인원
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.memberCount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, memberCount: parseInt(e.target.value) || 1 }))
                  }
                  className="w-24 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                />
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
                  placeholder="https://open.kakao.com/..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors duration-150"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors duration-150"
              >
                {editingTeamCode ? '수정 완료' : '팀 생성'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-colors duration-150"
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
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-sm w-full"
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
