import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHackathons, getTeams } from '../lib/storage';
import { SearchIcon, ChevronRightIcon } from './Icons';
import type { Hackathon, Team } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult =
  | { type: 'hackathon'; item: Hackathon }
  | { type: 'team'; item: Team };

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const hackathons = getHackathons();
    const teams = getTeams();

    const hackathonResults: SearchResult[] = hackathons
      .filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q))
      )
      .map((h) => ({ type: 'hackathon' as const, item: h }));

    const teamResults: SearchResult[] = teams
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.intro.toLowerCase().includes(q)
      )
      .map((t) => ({ type: 'team' as const, item: t }));

    setResults([...hackathonResults, ...teamResults]);
  }, [query]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  function handleSelect(result: SearchResult) {
    if (result.type === 'hackathon') {
      navigate(`/hackathons/${result.item.slug}`);
    } else {
      navigate('/camp', { state: { searchQuery: result.item.name } });
    }
    onClose();
  }

  if (!isOpen) return null;

  const hackathonResults = results.filter((r) => r.type === 'hackathon') as { type: 'hackathon'; item: Hackathon }[];
  const teamResults = results.filter((r) => r.type === 'team') as { type: 'team'; item: Team }[];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 flex-shrink-0"><SearchIcon size={15} /></span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="해커톤, 팀 검색..."
            aria-label="해커톤 및 팀 검색"
            className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
          />
          <kbd className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-sans">
            ESC
          </kbd>
        </div>

        {query && (
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-center text-slate-400 dark:text-slate-500 py-10 text-sm">검색 결과가 없습니다.</p>
            ) : (
              <div className="p-2">
                {hackathonResults.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      해커톤
                    </div>
                    {hackathonResults.map((r) => (
                      <button
                        key={r.item.slug}
                        onClick={() => handleSelect(r)}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors duration-150 flex items-center gap-3"
                      >
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-500 dark:text-indigo-400 flex-shrink-0">
                          <ChevronRightIcon size={14} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {r.item.title}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{r.item.tags.join(', ')}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {teamResults.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      팀
                    </div>
                    {teamResults.map((r) => (
                      <button
                        key={r.item.teamCode}
                        onClick={() => handleSelect(r)}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors duration-150 flex items-center gap-3"
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                          <ChevronRightIcon size={14} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {r.item.name}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">{r.item.intro}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
            <p>해커톤 제목, 태그, 팀 이름으로 검색하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
