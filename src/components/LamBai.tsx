/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Save } from 'lucide-react';
import { Question } from '../types';
import MathText from './MathText';

interface LamBaiProps {
  quizTitle: string;
  mode: string;
  username: string;
  userClass: string;
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  userAnswers: Record<number, any>;
  onSelectAnswer: (option: string) => void;
  onSelectTFAnswer: (subIdx: number, val: 'Đúng' | 'Sai') => void;
  onShortAnswerInput: (val: string) => void;
  timerSeconds: number;
  onSaveTemporarily: () => void;
  onSubmitQuiz: () => void;
}

export default function LamBai({
  quizTitle,
  mode,
  username,
  userClass,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  userAnswers,
  onSelectAnswer,
  onSelectTFAnswer,
  onShortAnswerInput,
  timerSeconds,
  onSaveTemporarily,
  onSubmitQuiz,
}: LamBaiProps) {
  const currentQuestion = questions[currentQuestionIndex];

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const navigateQuestion = (direction: number) => {
    const nextIdx = currentQuestionIndex + direction;
    if (nextIdx >= 0 && nextIdx < questions.length) {
      setCurrentQuestionIndex(nextIdx);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="bg-white p-8 text-center rounded-2xl border border-slate-100">
        <p className="text-slate-400 font-bold">Không tìm thấy câu hỏi hoạt động. Vui lòng thử tạo lại đề thi.</p>
      </div>
    );
  }

  return (
    <div id="panel-lam-bai" className="space-y-4">
      {/* Header of Live Quiz */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded uppercase font-mono">
            {mode.toUpperCase()}
          </span>
          <h2 className="text-base font-bold text-slate-800 mt-1">{quizTitle}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Học sinh làm bài: <strong className="text-slate-700">{username}</strong> | Lớp: <strong className="text-slate-700">{userClass}</strong>
          </p>
        </div>
        {/* Countdown Timer */}
        <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl flex items-center gap-2 border border-rose-100 font-bold text-base shadow-xs font-mono shrink-0">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" opacity=".2" />
            <path fill="currentColor" d="M12 4a8 8 0 0 1 7.42 11h-2a6 6 0 1 0-10.84 0h-2A8 8 0 0 1 12 4Z" />
          </svg>
          <span>{timeDisplay}</span>
        </div>
      </div>

      {/* Main Quiz Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Focus View */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6 flex flex-col justify-between min-h-[400px]">
          <div>
            {/* Question index and level badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1 rounded-full">
                Câu {currentQuestionIndex + 1} của {questions.length}
              </span>
              <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded font-bold">
                Mức độ: {currentQuestion.level}
              </span>
            </div>

            {/* Content math text with KaTeX support */}
            <div className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 leading-relaxed mb-6 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <MathText text={currentQuestion.content} />
            </div>

            {/* Answer select based on question style */}
            <div className="space-y-3">
              {currentQuestion.type === 'MCQ' && currentQuestion.options && (
                <div className="grid grid-cols-1 gap-2.5">
                  {currentQuestion.options.map((opt, oIdx) => {
                    const char = String.fromCharCode(65 + oIdx); // A, B, C, D
                    const isSelected = userAnswers[currentQuestionIndex] === char;

                    return (
                      <div
                        key={oIdx}
                        onClick={() => onSelectAnswer(char)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-indigo-50/20 transition cursor-pointer ${
                          isSelected ? 'bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          checked={isSelected}
                          readOnly
                          className="h-4.5 w-4.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                        />
                        <span className="font-extrabold text-slate-500">{char}.</span>
                        <span className="font-bold text-slate-700 text-sm sm:text-base">
                          <MathText text={opt} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'TF' && currentQuestion.subQuestions && (
                <div className="space-y-2">
                  {currentQuestion.subQuestions.map((sub, sIdx) => {
                    const savedAns = userAnswers[currentQuestionIndex] || [];
                    const activeVal = savedAns[sIdx];

                    return (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                      >
                        <span className="font-bold text-slate-700 leading-normal max-w-md">
                          <MathText text={sub} />
                        </span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => onSelectTFAnswer(sIdx, 'Đúng')}
                            className={`px-3 py-1.5 rounded-lg border font-black text-xs transition cursor-pointer ${
                              activeVal === 'Đúng'
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            Đúng
                          </button>
                          <button
                            onClick={() => onSelectTFAnswer(sIdx, 'Sai')}
                            className={`px-3 py-1.5 rounded-lg border font-black text-xs transition cursor-pointer ${
                              activeVal === 'Sai'
                                ? 'bg-red-500 text-white border-red-500 shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            Sai
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'SHORT' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Nhập đáp án tự luận ngắn:</label>
                  <input
                    type="text"
                    value={userAnswers[currentQuestionIndex] || ''}
                    onChange={(e) => onShortAnswerInput(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm sm:text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    placeholder="Nhập biểu thức chuẩn thu gọn (ví dụ: 6x^2y hoặc 4)"
                  />
                  <p className="text-[10px] text-slate-400">
                    Mẹo: Nhập chính xác các kí tự biến số viết liền không khoảng cách để thu được kết quả so khớp chính xác.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => navigateQuestion(-1)}
              disabled={currentQuestionIndex === 0}
              className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-1 cursor-pointer"
            >
              &larr; Câu trước
            </button>
            <button
              onClick={onSaveTemporarily}
              className="bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 flex items-center gap-1 transition"
            >
              <Save className="w-3.5 h-3.5" /> Lưu tạm
            </button>
            <button
              onClick={() => {
                if (currentQuestionIndex === questions.length - 1) {
                  onSubmitQuiz();
                } else {
                  navigateQuestion(1);
                }
              }}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-1 cursor-pointer"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Nộp Bài Thi' : 'Câu sau →'}
            </button>
          </div>
        </div>

        {/* Question map (Right Column) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bản đồ câu hỏi</h3>
            <div className="grid grid-cols-5 gap-2" id="play-map-container">
              {questions.map((_, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const savedValue = userAnswers[idx];
                const hasAnswer = savedValue !== undefined && savedValue !== '' && (!Array.isArray(savedValue) || savedValue.some(x => x !== null));

                let btnStyles = 'h-10 rounded-lg font-bold text-xs transition border flex items-center justify-center cursor-pointer ';
                if (isCurrent) {
                  btnStyles += 'bg-brand-600 text-white border-brand-600 ring-2 ring-brand-100';
                } else if (hasAnswer) {
                  btnStyles += 'bg-indigo-50 text-indigo-700 border-indigo-200';
                } else {
                  btnStyles += 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50';
                }

                return (
                  <button key={idx} onClick={() => setCurrentQuestionIndex(idx)} className={btnStyles}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress display and final submit button */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                <span>Tiến trình trả lời</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={onSubmitQuiz}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-xl transition shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Nộp bài thi của em
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
