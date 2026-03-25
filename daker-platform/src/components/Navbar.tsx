import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const links = [
    { to: '/hackathons', label: '해커톤' },
    { to: '/camp', label: '팀 찾기' },
    { to: '/rankings', label: '랭킹' },
    { to: '/me', label: '나의 공간' },
  ];

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <>
      <nav className="h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link
              to="/"
              className="flex items-center font-black text-lg tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block mr-1.5 mb-0.5" />
              DAKER
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive(link.to)
                      ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-150 bg-white dark:bg-slate-900"
                title="검색 (Ctrl+K)"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">검색</span>
                <kbd className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded font-sans">
                  Ctrl+K
                </kbd>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-150"
                title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="메뉴"
              >
                <span className="block w-5 h-0.5 bg-slate-600 dark:bg-slate-400 mb-1.5" />
                <span className="block w-5 h-0.5 bg-slate-600 dark:bg-slate-400 mb-1.5" />
                <span className="block w-5 h-0.5 bg-slate-600 dark:bg-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3 flex flex-col gap-0.5">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.to)
                    ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
