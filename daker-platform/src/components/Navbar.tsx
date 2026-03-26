import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';
import { SearchIcon, SunIcon, MoonIcon, MenuIcon, XIcon, ChevronRightIcon } from './Icons';

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
      <nav className="h-14 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg text-xs font-black flex items-center justify-center tracking-tight">
                DA
              </div>
              <span className="font-black text-[15px] tracking-tight text-slate-900 dark:text-white">
                DAKER
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-1 px-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    isActive(link.to)
                      ? 'border-b-2 border-indigo-600 text-slate-900 dark:text-white'
                      : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-1.5">
              {/* Search pill button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-full hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 bg-slate-50 dark:bg-slate-900"
                title="검색 (Ctrl+K)"
              >
                <SearchIcon size={13} />
                <span className="text-xs">검색</span>
                <kbd className="text-[10px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 py-0.5 rounded font-sans leading-none">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                aria-label="검색"
              >
                <SearchIcon size={18} />
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
              >
                {theme === 'dark' ? (
                  <SunIcon size={18} />
                ) : (
                  <MoonIcon size={18} />
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="메뉴"
              >
                {mobileOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.label}
                <ChevronRightIcon size={14} className="text-slate-300 dark:text-slate-600" />
              </Link>
            ))}
          </div>
        )}
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
