/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles } from 'lucide-react';
import { Question } from '../types';
import MathText from './MathText';

interface ChamDiemProps {
  quizTitle: string;
  username: string;
  questions: Question[];
  userAnswers: Record<number, any>;
  onTriggerAdaptiveRecovery: () => void;
}

export default function ChamDiem({
  quizTitle,
  username,
  questions,
  userAnswers,
  onTriggerAdaptiveRecovery,
}: ChamDiemProps) {
  let correctCount = 0;
  const breakdownData: Array<{
    q: Question;
    userAns: any;
    isCorrect: boolean;
    subResults?: Array<{ subAns: string; sAns: string; isSubCorrect: boolean }>;
  }> = [];

  const mistakesData: Array<{ q: Question; userAns: any; reason: string }> = [];

  questions.forEach((q, idx) => {
    const userAns = userAnswers[idx];
    let isCorrect = false;

    if (q.type === 'MCQ') {
      isCorrect = userAns === q.correct;
      breakdownData.push({ q, userAns, isCorrect });
      if (!isCorrect) {
        mistakesData.push({ q, userAns, reason: 'Tính toán nhầm hoặc chưa thực sự thuộc lòng các hằng đẳng thức đáng nhớ.' });
      }
    } else if (q.type === 'TF') {
      const correctAnswers = q.correct as string[];
      const studentAnswers = (userAns as string[]) || [];

      let allSubCorrect = true;
      const subResults: Array<{ subAns: string; sAns: string; isSubCorrect: boolean }> = [];
      
      correctAnswers.forEach((subAns, subIdx) => {
        const sAns = studentAnswers[subIdx];
        const isSubCorrect = sAns === subAns;
        if (!isSubCorrect) allSubCorrect = false;
        subResults.push({ subAns, sAns, isSubCorrect });
      });

      if (allSubCorrect) {
        correctCount += 0.5; // partial point increments
      }
      isCorrect = allSubCorrect;

      breakdownData.push({ q, userAns, isCorrect, subResults });
      if (!isCorrect) {
        mistakesData.push({ q, userAns: 'Nhầm lẫn thông tin nhận định phụ', reason: 'Chưa đọc kĩ đề bài hoặc nhầm lẫn dấu toán học.' });
      }
    } else if (q.type === 'SHORT') {
      const formattedUser = (userAns || '').toString().trim().replace(/\s+/g, '').toLowerCase();
      const formattedCorrect = (q.correct as string).trim().replace(/\s+/g, '').toLowerCase();

      isCorrect = formattedUser === formattedCorrect;
      breakdownData.push({ q, userAns, isCorrect });
      if (!isCorrect) {
        mistakesData.push({ q, userAns, reason: 'Tính toán sai hệ số luỹ thừa hoặc nhầm lẫn dấu âm dương.' });
      }
    }

    if (isCorrect && q.type !== 'TF') {
      correctCount++;
    }
  });

  let finalScore = questions.length ? (correctCount / questions.length) * 10 : 0;
  finalScore = Math.round(finalScore * 10) / 10;

  let rating = 'CẦN HỖ TRỢ';
  let badgeCol = 'bg-rose-100 text-rose-700';
  if (finalScore >= 8) {
    rating = 'TỐT';
    badgeCol = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (finalScore >= 6.5) {
    rating = 'KHÁ';
    badgeCol = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  } else if (finalScore >= 5.0) {
    rating = 'ĐẠT';
    badgeCol = 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }

  // Circular gauge SVG calculations
  const circumference = 339.2;
  const strokeOffset = circumference - (finalScore / 10) * circumference;

  return (
    <div id="panel-cham-diem" className="space-y-6">
      {/* Main Score Showcase Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score Circle representation */}
        <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Điểm Số Của Em</p>
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Visual progress circle with score inside */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" stroke="#f1f5f9" strokeWidth="8" fill="transparent"></circle>
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="#2563eb"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${strokeOffset}`}
                className="transition-all duration-1000 ease-out"
              ></circle>
            </svg>
            <span className="absolute text-4.5xl font-black text-brand-900 font-mono">
              {finalScore.toFixed(1)}
            </span>
          </div>
          <span className={`mt-3 font-black px-3.5 py-1 rounded-full text-xs uppercase border ${badgeCol}`}>
            {rating}
          </span>
        </div>

        {/* Quick Analytics Info */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Kết quả làm bài: <span className="text-brand-600 font-bold">{quizTitle}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 block font-medium">Học sinh thực hiện:</span>
              <strong className="text-slate-700">{username}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 block font-medium">Trạng thái:</span>
              <strong className="text-slate-700">Đã chấm tự động</strong>
            </div>
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-600 block font-bold">Số câu trả lời ĐÚNG</span>
              <strong className="text-lg font-bold">{correctCount} / {questions.length} câu</strong>
            </div>
            <div className="bg-rose-50 text-rose-850 p-3 rounded-xl border border-rose-100">
              <span className="text-xs text-rose-600 block font-bold">Số câu trả lời SAI</span>
              <strong className="text-lg font-bold">{questions.length - Math.floor(correctCount)} / {questions.length} câu</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Mistake Analysis Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">🔍</span>
          Phân Tích Lỗi Sai & Định Hướng Ôn Tập Từ AI
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Hệ thống phát hiện các lỗ hổng kiến thức từ kết quả bài làm học sinh dựa trên các câu trả lời sai.
        </p>

        <div className="space-y-3.5">
          {mistakesData.length === 0 ? (
            <div className="bg-emerald-50/60 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-xs sm:text-sm font-bold flex items-center gap-2">
              🌟 Tuyệt vời! Bạn đã hoàn thành chính xác 100% đề thi. Không tìm thấy lỗi sai nào trong mảng kiến thức này!
            </div>
          ) : (
            mistakesData.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1.5">
                <p className="font-bold text-slate-800">
                  Câu làm sai: <span className="text-rose-600 font-bold">{item.q.content}</span>
                </p>
                <p className="text-slate-500 font-semibold text-[11px]">Chủ đề học: {item.q.topic} | Dạng: {item.q.type}</p>
                <div className="text-rose-700 bg-rose-50/50 px-3 py-2 rounded-xl border border-rose-100">
                  <strong>Khuyến nghị AI:</strong> {item.reason}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Supplemental Adaptive Homework trigger widget */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 w-fit">
            <Sparkles className="w-3 h-3 text-yellow-300" /> Hệ thống thích ứng AI
          </span>
          <h4 className="text-base sm:text-lg font-bold">Hệ Thống Đề Xuất Đề Bổ Sung Từ Lỗi Sai!</h4>
          <p className="text-xs text-indigo-100 max-w-xl">
            Tự động lọc và giảm mức độ khó xuống mức Nhận biết/Thông hiểu để ôn tập, bám sát các hằng đẳng thức đáng nhớ hoặc biểu thức đại số bị hổng giúp phục hồi căn bản nhanh nhất!
          </p>
        </div>
        <button
          onClick={onTriggerAdaptiveRecovery}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold px-6 py-3 rounded-xl transition text-xs sm:text-sm flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
        >
          ⚡ Tạo Đề Bổ Sung Ngay
        </button>
      </div>

      {/* Detailed breakdown list with step-by-step math solutions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-base font-bold text-slate-800 mb-4">Chi Tiết Từng Câu Hỏi & Lời Giải Đầy Đủ</h3>
        <div className="space-y-6">
          {breakdownData.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${
                item.isCorrect ? 'border-emerald-100 bg-emerald-50/10' : 'border-rose-100 bg-rose-50/10'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase ${
                    item.isCorrect ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
                  }`}
                >
                  Câu {idx + 1} ({item.isCorrect ? 'ĐÚNG' : 'SAI'})
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">Cấp độ: {item.q.level}</span>
              </div>
              <div className="font-bold text-slate-800 text-sm sm:text-base">
                <MathText text={item.q.content} />
              </div>

              {/* MCQ Options representation */}
              {item.q.type === 'MCQ' && item.q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.q.options.map((opt, oIdx) => {
                    const char = String.fromCharCode(65 + oIdx);
                    const isUserSelected = item.userAns === char;
                    const isCorrectOption = item.q.correct === char;

                    let bgStyle = 'bg-slate-50 border-slate-200 text-slate-600';
                    if (isCorrectOption) {
                      bgStyle = 'bg-emerald-100/80 text-emerald-800 border-emerald-300 font-bold';
                    } else if (isUserSelected) {
                      bgStyle = 'bg-rose-100/80 text-rose-800 border-rose-300 font-bold';
                    }

                    return (
                      <div key={oIdx} className={`p-2.5 rounded-lg border ${bgStyle}`}>
                        {char}. <MathText text={opt} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TF results representation */}
              {item.q.type === 'TF' && item.subResults && (
                <div className="space-y-2 text-xs">
                  {item.subResults.map((sub, sIdx) => {
                    const statement = item.q.subQuestions?.[sIdx] || '';
                    return (
                      <div
                        key={sIdx}
                        className="p-2.5 rounded-lg bg-white border border-slate-150 flex justify-between items-center gap-3"
                      >
                        <span className="font-semibold text-slate-600 inline-block max-w-md">
                          <MathText text={statement} />
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              sub.isSubCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            Bạn chọn: {sub.sAns || 'Chưa chọn'}
                          </span>
                          <span className="text-slate-400 font-bold">| Đúng: {sub.subAns}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SHORT results representation */}
              {item.q.type === 'SHORT' && (
                <div className="text-xs flex flex-col sm:flex-row gap-2">
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex-1">
                    Bạn đã nhập: <strong>{item.userAns || 'Để trống'}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex-1 flex items-center gap-1 font-mono">
                    Đáp án đúng: <strong>{item.q.correct}</strong>
                  </div>
                </div>
              )}

              {/* Interactive step-by-step LaTeX solution panel */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-dashed border-indigo-100 text-xs sm:text-sm">
                <p className="font-extrabold text-indigo-900 mb-1">📘 Lời giải chi tiết:</p>
                <p className="text-slate-600 leading-relaxed font-semibold">
                  <MathText text={item.q.solution} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
