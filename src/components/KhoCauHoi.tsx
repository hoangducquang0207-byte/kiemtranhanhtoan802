/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Sparkles, Filter, Search, Edit2, Trash2 } from 'lucide-react';
import { Question, Chapter } from '../types';
import MathText from './MathText';

interface KhoCauHoiProps {
  syllabusData: Record<string, Chapter>;
  questions: Question[];
  onAddClick: () => void;
  onEditClick: (q: Question) => void;
  onDeleteClick: (id: string) => void;
  onSimulateAIGenerate: (syllabusKey: string) => Promise<void>;
}

export default function KhoCauHoi({
  syllabusData,
  questions,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSimulateAIGenerate,
}: KhoCauHoiProps) {
  const [filterSyllabus, setFilterSyllabus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [generating, setGenerating] = useState(false);

  // Active similar AI generate category selection
  const [aiGenerateSyllabus, setAiGenerateSyllabus] = useState('chuong-2');

  const filteredQuestions = questions.filter((q) => {
    const matchesSyllabus = filterSyllabus === 'all' || q.syllabus === filterSyllabus;
    const matchesLevel = filterLevel === 'all' || q.level === filterLevel;
    const matchesType = filterType === 'all' || q.type === filterType;
    
    const combinedText = `${q.id} ${q.content} ${q.topic}`.toLowerCase();
    const matchesKeyword = !keyword || combinedText.includes(keyword.toLowerCase());

    return matchesSyllabus && matchesLevel && matchesType && matchesKeyword;
  });

  const handleAIGenerate = async () => {
    setGenerating(true);
    try {
      await onSimulateAIGenerate(aiGenerateSyllabus);
    } finally {
      setGenerating(false);
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
              onChange={(e) => setAiGenerateSyllabus(e.target.value)}
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
            onClick={onAddClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Thêm câu hỏi
          </button>
          
          <button
            onClick={handleAIGenerate}
            disabled={generating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 animate-pulse" /> 
            {generating ? 'AI Đang tự thiết kế...' : '🤖 AI Tạo câu hỏi'}
          </button>
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
            onChange={(e) => setFilterSyllabus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
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
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
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
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
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
              <tr className="bg-slate-50 text-slate-400 text-[10px] sm:text-[11px] uppercase font-bold border-b border-slate-100">
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
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
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

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition">
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
                            onClick={() => onEditClick(q)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-0.5 shadow-xs"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Sửa
                          </button>
                          <button
                            onClick={() => onDeleteClick(q.id)}
                            className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-100 flex items-center gap-0.5 shadow-xs"
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
