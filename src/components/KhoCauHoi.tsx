/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Sparkles, Filter, Search, Edit2, Trash2, Play, FileText } from 'lucide-react';
import { Question, Chapter } from '../types';
import MathText from './MathText';
import { playClickSound } from '../utils/audio';

interface KhoCauHoiProps {
  syllabusData: Record<string, Chapter>;
  questions: Question[];
  onAddClick: () => void;
  onEditClick: (q: Question) => void;
  onDeleteClick: (id: string) => void;
  onSimulateAIGenerate: (syllabusKey: string) => Promise<void>;
  onStartCustomQuiz?: (customQuestions: Question[]) => void;
  onSaveQuizPreset?: (customQuestions: Question[]) => void;
}

export default function KhoCauHoi({
  syllabusData,
  questions,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSimulateAIGenerate,
  onStartCustomQuiz,
  onSaveQuizPreset,
}: KhoCauHoiProps) {
  const [filterSyllabus, setFilterSyllabus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [generating, setGenerating] = useState(false);

  // Active similar AI generate category selection
  const [aiGenerateSyllabus, setAiGenerateSyllabus] = useState('chuong-2');

  // Interactive selected questions state
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const filteredQuestions = questions.filter((q) => {
    const matchesSyllabus = filterSyllabus === 'all' || q.syllabus === filterSyllabus;
    const matchesLevel = filterLevel === 'all' || q.level === filterLevel;
    const matchesType = filterType === 'all' || q.type === filterType;
    
    const combinedText = `${q.id} ${q.content} ${q.topic}`.toLowerCase();
    const matchesKeyword = !keyword || combinedText.includes(keyword.toLowerCase());

    return matchesSyllabus && matchesLevel && matchesType && matchesKeyword;
  });

  const handleAIGenerate = async () => {
    playClickSound();
    setGenerating(true);
    try {
      await onSimulateAIGenerate(aiGenerateSyllabus);
    } finally {
      setGenerating(false);
    }
  };

  const toggleQuestionSelection = (id: string) => {
    playClickSound();
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    playClickSound();
    const allFilteredIds = filteredQuestions.map((q) => q.id);
    const areAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedQuestionIds.includes(id));

    if (areAllSelected) {
      setSelectedQuestionIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedQuestionIds((prev) => {
        const union = new Set([...prev, ...allFilteredIds]);
        return Array.from(union);
      });
    }
  };

  const clearSelection = () => {
    playClickSound();
    setSelectedQuestionIds([]);
  };

  // Trigger quick quiz with manually selected questions
  const handleStartWithSelected = () => {
    playClickSound();
    const selectedList = questions.filter((q) => selectedQuestionIds.includes(q.id));
    if (onStartCustomQuiz) {
      onStartCustomQuiz(selectedList);
    }
  };

  // Package manually selected questions into a new exam template
  const handleCreateWithSelected = () => {
    playClickSound();
    const selectedList = questions.filter((q) => selectedQuestionIds.includes(q.id));
    if (onSaveQuizPreset) {
      onSaveQuizPreset(selectedList);
    }
  };

  // Trigger quick quiz with current filtered queries
  const handleStartWithAllFiltered = () => {
    playClickSound();
    if (onStartCustomQuiz) {
      onStartCustomQuiz(filteredQuestions);
    }
  };

  // Package current filtered queries into a new exam template
  const handleCreateWithAllFiltered = () => {
    playClickSound();
    if (onSaveQuizPreset) {
      onSaveQuizPreset(filteredQuestions);
    }
  };

  return (
    <div id="panel-kho-cau-hoi" className="space-y-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Ngân hàng Câu Hỏi Toán 8</h2>
          <p className="text-xs text-slate-500">Nơi giáo viên cập nhật và học sinh xem các bài mẫu được duyệt.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl p-1.5 bg-slate-50">
            <span className="text-[10px] uppercase font-black text-slate-400 pl-1.5">Mục tiêu sinh:</span>
            <select
              value={aiGenerateSyllabus}
              onChange={(e) => {
                playClickSound();
                setAiGenerateSyllabus(e.target.value);
              }}
              className="bg-transparent border-0 font-bold text-xs focus:ring-0 cursor-pointer text-slate-600 outline-none"
            >
              {Object.keys(syllabusData).map((key) => (
                <option key={key} value={key}>
                  {syllabusData[key].title.split(':')[0]}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => {
              playClickSound();
              onAddClick();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm câu hỏi
          </button>
          
          <button
            onClick={handleAIGenerate}
            disabled={generating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse" /> 
            {generating ? 'AI Đang tự thiết kế...' : '🤖 AI Tạo câu hỏi'}
          </button>
        </div>
      </div>

      {/* Gateway linking Question Bank to Tạo đề & Làm bài ngay */}
      <div className="bg-gradient-to-r from-teal-55 to-indigo-50 border border-indigo-100/60 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-550"></span>
            </span>
            <h3 className="text-xs font-black uppercase text-indigo-700 tracking-wider">CỔNG LIÊN KẾT ĐỀ & LÀM BÀI</h3>
          </div>
          <p className="text-xs text-slate-700 font-medium">
            {selectedQuestionIds.length > 0 ? (
              <span>
                Đang khoanh vùng riêng <strong className="text-brand-700 font-black px-1.5 py-0.5 rounded bg-brand-50 font-mono text-sm">{selectedQuestionIds.length}</strong> câu hỏi đã chọn thủ công để thực hiện tác vụ ôn thi tự luyện.
              </span>
            ) : (
              <span>
                Hiện bộ lọc đạt <strong className="text-indigo-700 font-black px-1.5 py-0.5 rounded bg-indigo-50 font-mono text-sm">{filteredQuestions.length}</strong> câu hỏi. Bạn có thể chọn cụ thể câu hỏi bên dưới hoặc thao tác nhanh với danh sách lọc này.
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedQuestionIds.length > 0 ? (
            <>
              <button
                onClick={handleStartWithSelected}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition transform active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Làm bài ngay ({selectedQuestionIds.length} câu)
              </button>
              <button
                onClick={handleCreateWithSelected}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition transform active:scale-95 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Tạo đề & Đóng gói ({selectedQuestionIds.length} câu)
              </button>
              <button
                onClick={clearSelection}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Bỏ chọn hết
              </button>
            </>
          ) : (
            <>
              <button
                disabled={filteredQuestions.length === 0}
                onClick={handleStartWithAllFiltered}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Làm luyện tập nhanh này ({filteredQuestions.length} câu)
              </button>
              <button
                disabled={filteredQuestions.length === 0}
                onClick={handleCreateWithAllFiltered}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Tạo & Đóng gói danh sách lọc ({filteredQuestions.length} câu)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Mạch kiến thức
          </label>
          <select
            value={filterSyllabus}
            onChange={(e) => {
              playClickSound();
              setFilterSyllabus(e.target.value);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
          >
            <option value="all">--- Tất cả mạch kiến thức ---</option>
            {Object.keys(syllabusData).map((key) => (
              <option key={key} value={key}>
                {syllabusData[key].title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5">Mức độ</label>
          <select
            value={filterLevel}
            onChange={(e) => {
              playClickSound();
              setFilterLevel(e.target.value);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
          >
            <option value="all">--- Tất cả mức độ ---</option>
            <option value="Nhận biết">Nhận biết</option>
            <option value="Thông hiểu">Thông hiểu</option>
            <option value="Vận dụng">Vận dụng</option>
            <option value="Vận dụng cao">Vận dụng cao</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5">Dạng câu hỏi</label>
          <select
            value={filterType}
            onChange={(e) => {
              playClickSound();
              setFilterType(e.target.value);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
          >
            <option value="all">--- Tất cả dạng ---</option>
            <option value="MCQ">Trắc nghiệm 4 lựa chọn</option>
            <option value="TF">Đúng / Sai</option>
            <option value="SHORT">Trả lời điền từ</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1.5 flex items-center gap-1">
            <Search className="w-3 h-3 text-slate-400" /> Từ khóa tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Nhập từ khóa cần tìm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Question List Table wrapper */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] sm:text-[11px] uppercase font-bold border-b border-slate-100/80">
                <th className="p-4 w-12 text-center select-none">
                  <input
                    type="checkbox"
                    checked={filteredQuestions.length > 0 && filteredQuestions.every((q) => selectedQuestionIds.includes(q.id))}
                    onChange={toggleSelectAll}
                    id="checkbox-select-all"
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 w-16">Mã CH</th>
                <th className="p-4">Chương học & Dạng</th>
                <th className="p-4 max-w-sm">Nội dung câu hỏi</th>
                <th className="p-4">Mức độ</th>
                <th className="p-4 text-center">Nguồn</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                    Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiển thị.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => {
                  const typeColors = 
                    q.type === 'MCQ' ? 'bg-pink-50 text-pink-700 border-pink-100' :
                    q.type === 'TF' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                    'bg-amber-50 text-amber-700 border-amber-100';

                  const lvlColors =
                    q.level === 'Nhận biết' ? 'bg-slate-100 text-slate-700' :
                    q.level === 'Thông hiểu' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    q.level === 'Vận dụng' ? 'bg-red-50 text-red-700 border-red-101' :
                    'bg-purple-50 text-purple-700 border-purple-100';

                  const isChecked = selectedQuestionIds.includes(q.id);

                  return (
                    <tr key={q.id} className={`hover:bg-slate-50/50 transition ${isChecked ? 'bg-indigo-50/20' : ''}`}>
                      <td className="p-4 text-center select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleQuestionSelection(q.id)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-bold text-slate-400 font-mono">{q.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-xs line-clamp-1">
                          {syllabusData[q.syllabus]?.title || q.syllabus}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{q.topic}</div>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${typeColors}`}>
                          {q.type}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700 max-w-xs break-words">
                        <div className="line-clamp-3">
                          <MathText text={q.content} />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${lvlColors}`}>
                          {q.level}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 text-[10px] font-bold rounded-full ${q.source === 'AI tạo' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-50 text-slate-500'}`}>
                          {q.source}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => {
                              playClickSound();
                              onEditClick(q);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-0.5 shadow-xs cursor-pointer"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Sửa
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              onDeleteClick(q.id);
                            }}
                            className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-100 flex items-center gap-0.5 shadow-xs cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
