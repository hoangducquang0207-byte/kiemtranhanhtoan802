/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, Settings } from 'lucide-react';
import { Chapter } from '../types';

interface TaoDeProps {
  syllabusData: Record<string, Chapter>;
  learnedLessons: Record<string, boolean>;
  openProgressModal: () => void;
  onPreview: (syllabusKey: string, topic: string, count: number) => void;
  onCreateQuiz: (config: {
    syllabusKey: string;
    topic: string;
    count: number;
    timerMinutes: number;
    mode: string;
    type: string;
    level: string;
    source: string;
  }) => void;
}

export default function TaoDe({
  syllabusData,
  learnedLessons,
  openProgressModal,
  onPreview,
  onCreateQuiz,
}: TaoDeProps) {
  const [syllabusKey, setSyllabusKey] = useState('chuong-1');
  const [topic, setTopic] = useState('all');
  const [mode, setMode] = useState('on-tap-bai');
  const [count, setCount] = useState(5);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [type, setType] = useState('mixed');
  const [level, setLevel] = useState('mixed');
  const [source, setSource] = useState('both');

  // Ratios for Cognitive levels
  const [ratioEasy, setRatioEasy] = useState(40);
  const [ratioMedium, setRatioMedium] = useState(40);
  const [ratioHard, setRatioHard] = useState(20);
  const [ratioVHard, setRatioVHard] = useState(0);

  const [lastLearned, setLastLearned] = useState('Chưa thiết lập');

  useEffect(() => {
    // Reset topic to all when chapter changes
    setTopic('all');
  }, [syllabusKey]);

  useEffect(() => {
    // Compute last learned lesson
    let computed = 'Chưa thiết lập';
    Object.keys(syllabusData).forEach((sKey) => {
      syllabusData[sKey].lessons.forEach((l) => {
        if (learnedLessons[l]) {
          computed = l;
        }
      });
    });
    setLastLearned(computed);
  }, [learnedLessons, syllabusData]);

  const handleCreate = () => {
    onCreateQuiz({
      syllabusKey,
      topic,
      count,
      timerMinutes,
      mode,
      type,
      level,
      source,
    });
  };

  return (
    <div id="panel-tao-de" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="border-b border-slate-101 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Cấu hình Tạo Đề Tự Ôn Luyện</h2>
          <p className="text-xs text-slate-500">Tùy biến cao theo tiến độ học, chế độ kiểm tra và dạng câu hỏi.</p>
        </div>
        <span className="bg-brand-50 text-brand-600 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> AI Cấu Hình Sẵn
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chế độ luyện tập</label>
            <select
              id="quiz-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            >
              <option value="dau-gio">Kiểm tra đầu giờ (Chỉ hỏi bài vừa tích học)</option>
              <option value="cuoi-gio">Kiểm tra cuối giờ (Trọng tâm bài mới học)</option>
              <option value="on-tap-bai">Ôn tập bài học</option>
              <option value="on-tap-chuong">Ôn tập chương</option>
              <option value="on-tap-loi-sai">Ôn tập cá nhân hóa (Sửa lỗi sai)</option>
              <option value="tong-hop">Luyện đề tổng hợp toàn bộ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">MẠCH KIẾN THỨC / CHƯƠNG (SGK Kết nối tri thức)</label>
            <select
              id="quiz-syllabus"
              value={syllabusKey}
              onChange={(e) => setSyllabusKey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            >
              {Object.keys(syllabusData).map((key) => (
                <option key={key} value={key}>
                  {syllabusData[key].title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bài / Chủ đề học cụ thể</label>
            <select
              id="quiz-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            >
              <option value="all">--- Tất cả các bài của chương này ---</option>
              {syllabusData[syllabusKey]?.lessons.map((lesson) => (
                <option key={lesson} value={lesson}>
                  {lesson}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kiểm soát Tiến độ học trên lớp</label>
            <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 text-xs text-brand-900 space-y-2">
              <p className="font-bold flex items-center gap-1">
                <span>⚠️ Kiểm soát tiến độ hoạt động:</span>
              </p>
              <p className="text-slate-600 leading-relaxed">
                Hệ thống tự động đồng bộ hóa với bảng tích chọn của bạn để lọc câu hỏi phù hợp nhất.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-brand-100/50">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Đã học đến bài:</span>
                  <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded font-bold text-[10px] break-all max-w-[150px] inline-block truncate">
                    {mode === 'dau-gio' ? 'Bám sát bài đã tích chọn gần nhất' : lastLearned}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={openProgressModal}
                  className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-xl font-bold border border-indigo-200 shadow-sm transition"
                >
                  ⚙️ Thay đổi bảng Tiến độ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Số câu hỏi</label>
              <select
                id="quiz-count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                <option value="5">5 câu</option>
                <option value="10">10 câu</option>
                <option value="15">15 câu</option>
                <option value="20">20 câu</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Thời gian</label>
              <select
                id="quiz-timer"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                <option value="5">5 phút</option>
                <option value="10">10 phút</option>
                <option value="15">15 phút</option>
                <option value="20">20 phút</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Dạng câu hỏi</label>
            <select
              id="quiz-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="mixed">Trộn cả ba dạng (Trắc nghiệm, Đúng/Sai, Điền từ)</option>
              <option value="mcq">Chỉ trắc nghiệm 4 lựa chọn</option>
              <option value="tf">Chỉ câu hỏi Đúng/Sai</option>
              <option value="short">Chỉ câu trả lời ngắn</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mức độ nhận thức</label>
            <select
              id="quiz-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="mixed">Trộn nhiều mức độ (Tự đặt tỉ lệ)</option>
              <option value="easy">Nhận biết (Cơ bản nhất)</option>
              <option value="medium">Thông hiểu</option>
              <option value="hard">Vận dụng</option>
              <option value="very-hard">Vận dụng cao</option>
            </select>
          </div>

          {/* Level Ratio Settings */}
          {level === 'mixed' && (
            <div id="level-ratio-container" className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
              <p className="font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-slate-500" /> Cấu hình tỷ lệ % các mức độ:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-1 justify-between">
                  <span className="text-slate-500 font-medium font-sans">Nhận biết: </span>
                  <div>
                    <input
                      type="number"
                      value={ratioEasy}
                      onChange={(e) => setRatioEasy(Number(e.target.value))}
                      className="w-14 bg-white border border-slate-200 rounded px-2 py-1 font-bold text-center"
                    /> %
                  </div>
                </div>
                <div className="flex items-center gap-1 justify-between">
                  <span className="text-slate-500 font-medium">Thông hiểu: </span>
                  <div>
                    <input
                      type="number"
                      value={ratioMedium}
                      onChange={(e) => setRatioMedium(Number(e.target.value))}
                      className="w-14 bg-white border border-slate-200 rounded px-2 py-1 font-bold text-center"
                    /> %
                  </div>
                </div>
                <div className="flex items-center gap-1 justify-between">
                  <span className="text-slate-500 font-medium">Vận dụng: </span>
                  <div>
                    <input
                      type="number"
                      value={ratioHard}
                      onChange={(e) => setRatioHard(Number(e.target.value))}
                      className="w-14 bg-white border border-slate-200 rounded px-2 py-1 font-bold text-center"
                    /> %
                  </div>
                </div>
                <div className="flex items-center gap-1 justify-between">
                  <span className="text-slate-500 font-medium">Cực khó: </span>
                  <div>
                    <input
                      type="number"
                      value={ratioVHard}
                      onChange={(e) => setRatioVHard(Number(e.target.value))}
                      className="w-14 bg-white border border-slate-200 rounded px-2 py-1 font-bold text-center"
                    /> %
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nguồn ngân hàng câu hỏi</label>
            <select
              id="quiz-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="both">Kết hợp cả hai (AI tạo đề + Thầy cô soạn)</option>
              <option value="store">Chỉ lấy từ kho câu hỏi có sẵn</option>
              <option value="ai">Chỉ sử dụng AI tạo mới hoàn toàn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Button Group */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-3 justify-end">
        <button
          onClick={() => onPreview(syllabusKey, topic, count)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition text-xs sm:text-sm flex items-center gap-1.5"
        >
          👁️ Xem trước cấu trúc đề
        </button>
        <button
          onClick={handleCreate}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-2.5 rounded-xl transition text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
        >
          🚀 Tạo đề & Làm bài ngay
        </button>
      </div>
    </div>
  );
}
