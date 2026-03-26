import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-100 dark:border-slate-800 py-10 mt-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            {/* Left: logo + tagline */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg text-xs font-black flex items-center justify-center tracking-tight">
                  DA
                </div>
                <span className="font-black text-[15px] tracking-tight text-slate-900 dark:text-white">
                  DAKER
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[220px] leading-relaxed">
                데이터 경진대회 팀 빌딩 플랫폼
              </p>
              <p className="text-xs text-slate-300 dark:text-slate-700 mt-3">
                © 2026 DAKER. All rights reserved.
              </p>
            </div>

            {/* Right: links */}
            <nav className="flex flex-col gap-2 items-end">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                링크
              </p>
              <div className="flex flex-row gap-4">
                {[
                  { to: '/hackathons', label: '해커톤' },
                  { to: '/camp', label: '팀 찾기' },
                  { to: '/rankings', label: '랭킹' },
                  { to: '/me', label: '나의 공간' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
