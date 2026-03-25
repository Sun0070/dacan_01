import React from 'react';
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
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © 2026 DAKER. 데이터 경진대회 팀 빌딩 플랫폼.
          </p>
        </div>
      </footer>
    </div>
  );
}
