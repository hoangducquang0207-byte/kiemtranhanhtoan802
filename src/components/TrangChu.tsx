/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Award, Activity, Heart, AlertTriangle, BookOpen, FileText } from 'lucide-react';

interface TrangChuProps {
  username: string;
  setUsername: (name: string) => void;
  userClass: string;
  setUserClass: (cls: string) => void;
  switchTab: (tabId: string) => void;
  stats: {
    totalTests: number;
    highestScore: number;
    avgScore: number;
    weakTopic: string;
  };
  triggerWeaknessReview: () => void;
  triggerAdaptiveQuiz: () => void;
  onSaveProfile: () => void;
}

export default function TrangChu({
  username,
  setUsername,
  userClass,
  setUserClass,
  switchTab,
  stats,
  triggerWeaknessReview,
  triggerAdaptiveQuiz,
  onSaveProfile,
}: TrangChuProps) {
  return (
    <div id="panel-trang-chu" className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-brand-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 top-0 opacity-15 hidden md:block">
          {/* Mathematical background decoration */}
          <svg className="w-96 h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <line x1="10" y1="90" x2="90" y2="10" strokeWidth="1" />
            <circle cx="50" cy="50" r="30" strokeWidth="1" />
            <rect x="20" y="20" width="40" height="40" strokeWidth="1" />
          </svg>
        </div>
        <div className="relative z-10 space-y-4 max-w-xl">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Toán Học Lớp 8
          </span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold leading-tight">
            Luyện tập thông minh,<br />bứt phá điểm số!
          </h2>
          <p className="text-sm md:text-base text-blue-100">
            Học sinh tự động ôn tập theo hằng đẳng thức, tứ giác, định lí Thalès, hàm số với các câu hỏi tự sinh cực chuẩn bởi AI.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => switchTab('tao-de')}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition duration-150 transform hover:scale-[1.02] flex items-center gap-2 text-sm shadow-md"
            >
              ⚡ Bắt đầu luyện tập
            </button>
            <button
              onClick={() => switchTab('bao-cao')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition duration-150 text-sm"
            >
              📊 Xem kết quả của em
            </button>
          </div>
        </div>
      </div>

      {/* Registration / Profile Setup Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="p-1.5 bg-brand-100 text-brand-600 rounded-lg">
            <User className="w-5 h-5" />
          </span>
          Thông Tin Đăng Nhập Hệ Thống
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Họ và tên học sinh</label>
            <input
              type="text"
              id="input-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              placeholder="Nhập họ và tên..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chọn lớp</label>
            <select
              id="select-class"
              value={userClass}
              onChange={(e) => setUserClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            >
              <option value="8A1">Lớp học 8A1 (Nhóm nâng cao)</option>
              <option value="8A2">Lớp học 8A2 (Cơ bản - Đại trà)</option>
              <option value="8A3">Lớp học 8A3 (Nhóm bồi dưỡng chậm)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSaveProfile}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl transition duration-150 text-sm flex items-center gap-2 shadow-sm"
          >
            Lưu cấu hình thông tin
          </button>
        </div>
      </div>

      {/* Personal Statistics Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Thống Kê Cá Nhân Của Em</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium font-sans">Số bài đã làm</p>
              <p className="text-xl font-bold text-slate-800" id="stat-total-tests">{stats.totalTests}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Điểm cao nhất</p>
              <p className="text-xl font-bold text-slate-800" id="stat-highest-score">{stats.highestScore.toFixed(1)}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Điểm trung bình</p>
              <p className="text-xl font-bold text-slate-800" id="stat-avg-score">{stats.avgScore.toFixed(1)}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Kiến thức cần yếu</p>
              <p className="text-xs font-bold text-rose-600 break-words mt-0.5 line-clamp-1" id="stat-weak-topic">{stats.weakTopic}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-200 flex flex-col justify-between">
          <div>
            <div className="bg-rose-50 text-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Xem lại lỗi sai của em</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Hệ thống lưu lại các câu làm sai để phân tích, chỉ ra lỗi sai phổ biến như tính toán sai, nhầm lý thuyết.
            </p>
          </div>
          <button
            onClick={triggerWeaknessReview}
            className="text-rose-600 hover:text-rose-700 text-sm font-bold flex items-center gap-1.5 transition text-left"
          >
            Kiểm tra lỗi sai của tôi &rarr;
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-200 flex flex-col justify-between">
          <div>
            <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Đề bổ sung được đề xuất</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Hệ thống thiết kế các đề ngắn bổ sung dựa trên chủ đề yếu, giúp tăng dần từ nhận biết đến vận dụng.
            </p>
          </div>
          <button
            onClick={triggerAdaptiveQuiz}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1.5 transition text-left"
          >
            Tạo đề bổ sung cá nhân hóa &rarr;
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-200 flex flex-col justify-between">
          <div>
            <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Kho đề kiểm tra lớp</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Làm các đề thi được giao bởi thầy cô hoặc xem lại toàn bộ đề đã thi cùng lời giải chi tiết.
            </p>
          </div>
          <button
            onClick={() => switchTab('kho-de')}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1.5 transition text-left"
          >
            Truy cập kho đề học sinh &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
