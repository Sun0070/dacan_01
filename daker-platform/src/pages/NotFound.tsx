import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center relative">
      {/* Decorative 404 background text */}
      <div className="absolute text-[12rem] font-black text-slate-100 dark:text-slate-900 select-none pointer-events-none leading-none">
        404
      </div>
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors duration-150"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
