/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Filter,
  Search,
  Edit2,
  Trash2,
  Play,
  FileText,
  Upload,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  Download
} from 'lucide-react';
import { Question, Chapter, QuestionType, CognitiveLevel } from '../types';
import MathText from './MathText';
import { playClickSound, playModalPopSound } from '../utils/audio';

// Smart plain-text parsing function for teacher question sheets
export function parseTextToQuestions(text: string): { questions: Question[]; errors: string[] } {
  const result: Question[] = [];
  const errors: string[] = [];

  // Split by double newlines or sequential empty lines to detect block units
  const blocks = text.split(/\r?\n\s*\r?\n/);
  
  blocks.forEach((block, index) => {
    const rawLines = block.split(/\r?\n/).map(l => l.trim());
    const lines = rawLines.filter(l => l.length > 0);
    if (lines.length === 0) return;

    let content = '';
    let syllabus = 'chuong-1';
    let topic = 'Tự học tập';
    let level: CognitiveLevel = 'Thông hiểu';
    let type: any = 'MCQ';
    let options: string[] = [];
    let subQuestions: string[] = [];
    let correct: string | string[] = '';
    let solution = 'Chưa cung cấp lời giải chi tiết.';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.startsWith('câu:') || lowerLine.startsWith('câu ') || lowerLine.startsWith('câu hỏi:')) {
        content = line.replace(/^(câu:|câu\s+\d+:|câu hỏi:)/i, '').trim();
      } else if (lowerLine.startsWith('nội dung:')) {
        content = line.replace(/^nội dung:/i, '').trim();
      } else if (lowerLine.startsWith('chương:')) {
        const val = line.replace(/^chương:/i, '').trim().toLowerCase();
        if (val.includes('chuong-') || val.includes('chương-')) {
          syllabus = val.replace('chương-', 'chuong-');
        } else if (val.includes('1') || val.includes('nhất') || val.includes('đa thức')) {
          syllabus = 'chuong-1';
        } else if (val.includes('2') || val.includes('hai') || val.includes('hằng đẳng thức')) {
          syllabus = 'chuong-2';
        } else if (val.includes('3') || val.includes('ba') || val.includes('hình thoi') || val.includes('hình vuông')) {
          syllabus = 'chuong-3';
        } else if (val.includes('4') || val.includes('tứ giác')) {
          syllabus = 'chuong-4';
        } else if (val.includes('5')) {
          syllabus = 'chuong-5';
        } else if (val.includes('6')) {
          syllabus = 'chuong-6';
        } else if (val.includes('7')) {
          syllabus = 'chuong-7';
        } else {
          syllabus = 'chuong-1';
        }
      } else if (lowerLine.startsWith('chủ đề:')) {
        topic = line.replace(/^chủ đề:/i, '').trim();
      } else if (lowerLine.startsWith('mức độ:') || lowerLine.startsWith('độ khó:')) {
        const val = line.replace(/^(mức độ:|độ khó:)/i, '').trim();
        if (val === 'Nhận biết' || val === 'Thông hiểu' || val === 'Vận dụng' || val === 'Vận dụng cao') {
          level = val;
        } else if (val.toLowerCase().includes('nhận biết')) {
          level = 'Nhận biết';
        } else if (val.toLowerCase().includes('vận dụng cao')) {
          level = 'Vận dụng cao';
        } else if (val.toLowerCase().includes('vận dụng')) {
          level = 'Vận dụng';
        } else {
          level = 'Thông hiểu';
        }
      } else if (lowerLine.startsWith('dạng:') || lowerLine.startsWith('loại:')) {
        const val = line.replace(/^(dạng:|loại:)/i, '').trim().toUpperCase();
        if (val === 'MCQ' || val === 'TF' || val === 'SHORT') {
          type = val;
        } else if (val.includes('TRẮC NGHIỆM') || val.includes('4 LỰA CHỌN')) {
          type = 'MCQ';
        } else if (val.includes('ĐÚNG SAI') || val.includes('TF')) {
          type = 'TF';
        } else if (val.includes('ĐIỀN TỪ') || val.includes('ĐIỀN SỐ') || val.includes('SHORT')) {
          type = 'SHORT';
        }
      } else if (/^[a-d][\.\/)\-\s]/i.test(line)) {
        const optText = line.replace(/^[a-d][\.\/)\-\s]+/i, '').trim();
        options.push(optText);
      } else if (/^[1-4][\.\/)\-\s]/i.test(line)) {
        const tfText = line.replace(/^[1-4][\.\/)\-\s]+/i, '').trim();
        subQuestions.push(tfText);
      } else if (lowerLine.startsWith('đáp án:') || lowerLine.startsWith('đáp án đúng:')) {
        const val = line.replace(/^(đáp án:|đáp án đúng:)/i, '').trim();
        if (type === 'TF') {
          correct = val.split(/[,;\s]+/).map(s => s.trim());
        } else {
          correct = val;
        }
      } else if (lowerLine.startsWith('lời giải:') || lowerLine.startsWith('giải chi tiết:') || lowerLine.startsWith('giải:')) {
        solution = line.replace(/^(lời giải:|giải chi tiết:|giải:)/i, '').trim();
      } else {
        if (!content) {
          content = line;
        } else if (content && !line.includes(':') && options.length === 0 && subQuestions.length === 0) {
          content += ' ' + line;
        }
      }
    });

    if (!content) {
      errors.push(`Khối số ${index + 1}: Thiếu nội dung câu hỏi chính.`);
      return;
    }

    if (options.length > 0 && type !== 'MCQ') {
      type = 'MCQ';
    } else if (subQuestions.length > 0 && type !== 'TF') {
      type = 'TF';
    }

    if (type === 'MCQ' && options.length === 0) {
      errors.push(`Khối số ${index + 1} ("${content.substring(0, 20)}..."): Định nghĩa MCQ nhưng không có các đáp án lựa chọn A, B, C, D.`);
      return;
    }

    if (type === 'TF' && subQuestions.length === 0) {
      errors.push(`Khối số ${index + 1} ("${content.substring(0, 20)}..."): Định nghĩa Đúng/Sai nhưng thiếu danh sách các nhận định.`);
      return;
    }

    if (type === 'TF' && !Array.isArray(correct)) {
      correct = ['Đúng', 'Sai', 'Đúng', 'Sai'];
    }

    if (!correct) {
      if (type === 'MCQ') correct = 'A';
      else if (type === 'SHORT') correct = '0';
    }

    result.push({
      id: 'CH-UP-' + Math.floor(Math.random() * 89999 + 10000),
      syllabus,
      topic,
      level,
      type,
      content,
      options: type === 'MCQ' ? options : undefined,
      subQuestions: type === 'TF' ? subQuestions : undefined,
      correct,
      solution,
      source: 'Giáo viên',
      status: 'Đã duyệt',
      uses: 0,
      correctRate: 100,
    });
  });

  return { questions: result, errors };
}

interface KhoCauHoiProps {
  syllabusData: Record<string, Chapter>;
  questions: Question[];
  onAddClick: () => void;
  onEditClick: (q: Question) => void;
  onDeleteClick: (id: string) => void;
  onSimulateAIGenerate: (syllabusKey: string) => Promise<void>;
  onStartCustomQuiz?: (customQuestions: Question[]) => void;
  onSaveQuizPreset?: (customQuestions: Question[]) => void;
  onImportQuestions?: (newQs: Question[]) => void;
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
  onImportQuestions,
}: KhoCauHoiProps) {
  const [filterSyllabus, setFilterSyllabus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [generating, setGenerating] = useState(false);

  // States for importing/uploading quizzes
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [parsedList, setParsedList] = useState<Question[]>([]);
  const [parsingErrors, setParsingErrors] = useState<string[]>([]);
  const [importTab, setImportTab] = useState<'upload' | 'paste'>('upload');
  const [fileName, setFileName] = useState('');

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

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(text);
          const list = Array.isArray(parsed) ? parsed : [parsed];
          const normalized = list.map((item: any, idx: number) => {
            return {
              id: item.id || 'CH-UP-' + Math.floor(Math.random() * 89999 + 10000) + idx,
              syllabus: item.syllabus || 'chuong-1',
              topic: item.topic || 'Lớp học tải lên',
              level: item.level || 'Thông hiểu',
              type: item.type || 'MCQ',
              content: item.content || 'Nội dung câu hỏi',
              options: item.options,
              subQuestions: item.subQuestions,
              correct: item.correct || 'A',
              solution: item.solution || 'Chưa cung cấp lời giải chi tiết.',
              source: 'Giáo viên',
              status: 'Đã duyệt',
              uses: 0,
              correctRate: 100,
            } as Question;
          });
          setParsedList(normalized);
          setParsingErrors([]);
        } catch (err: any) {
          setParsingErrors([`Tệp JSON bị lỗi định dạng hoặc cú pháp: ${err.message}`]);
          setParsedList([]);
        }
      } else {
        // Plain text parsing
        const { questions: list, errors } = parseTextToQuestions(text);
        setParsedList(list);
        setParsingErrors(errors);
      }
    };
    reader.readAsText(file);
  };

  const handleExtractPasteText = () => {
    playClickSound();
    if (!pasteText.trim()) {
      setParsingErrors(['Vui lòng nhập hoặc dán nội dung chữ câu hỏi trước khi bấm trích xuất.']);
      setParsedList([]);
      return;
    }
    const { questions: list, errors } = parseTextToQuestions(pasteText);
    setParsedList(list);
    setParsingErrors(errors);
  };

  const handleDownloadSampleFile = (type: 'txt' | 'json') => {
    playClickSound();
    let content = '';
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (type === 'json') {
      mimeType = 'application/json';
      ext = 'json';
      content = JSON.stringify([
        {
          content: "Khai triển biểu thức đại số $A = (x + 2y)^2$ thu được kết quả:",
          syllabus: "chuong-2",
          topic: "Những hằng đẳng thức đáng nhớ",
          level: "Thông hiểu",
          type: "MCQ",
          options: [
            "$x^2 + 4xy + 4y^2$",
            "$x^2 + 2xy + 4y^2$",
            "$x^2 + 4y^2$",
            "$x^2 - 4xy + 4y^2$"
          ],
          correct: "A",
          solution: "Áp dụng công thức hằng đẳng thức đáng nhớ $(a+b)^2 = a^2 + 2ab + b^2$ với $a=x$ và $b=2y$."
        },
        {
          content: "Tính giá trị của đại số hằng đẳng thức $x^2 - y^2$ tại $x = 52$ và $y = 48$.",
          syllabus: "chuong-2",
          topic: "Những hằng đẳng thức đáng nhớ",
          level: "Vận dụng",
          type: "SHORT",
          correct: "400",
          solution: "Hiệu hai bình phương $x^2 - y^2 = (x-y)(x+y) = (52-48)(52+48) = 4 \\times 100 = 400$."
        }
      ], null, 2);
    } else {
      content = `Câu: Cho biểu thức hằng đẳng thức đáng nhớ $A = (x - 3y)^2$. Khai triển ta được kết quả:
Chương: chuong-2
Chủ đề: Những hằng đẳng thức đáng nhớ
Mức độ: Nhận biết
Dạng: MCQ
A. $x^2 - 6xy + 9y^2$
B. $x^2 - 3xy + 9y^2$
C. $x^2 + 9y^2$
D. $x^2 - 6xy - 9y^2$
Đáp án: A
Lời giải: Áp dụng công thức khai triển hằng đẳng thức hiệu bình phương $(a-b)^2 = a^2 - 2ab + b^2$.

Câu: Khẳng định sau đây về Hình vuông là Đúng hay Sai:
Chương: chuong-3
Chủ đề: Hình thoi. Hình vuông
Mức độ: Thông hiểu
Dạng: TF
1/ Tứ giác có hai trục đối xứng bằng vuông góc là hình thoi.
2/ Hình thoi có 2 đường chéo bằng nhau là hình vuông.
3/ Hình chữ nhật có hai đường chéo vuông góc là hình vuông.
4/ Tứ giác có 4 góc đối bằng nhau lặp lại là hình thoi.
Đáp án: Đúng,Đúng,Đúng,Sai
Lời giải: Áp dụng đặc điểm nhận biết phân biệt hình vuông từ hình chữ nhật và dạng hình thoi.`;
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `mau_de_luyen_tap_toan8.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    playClickSound();
    if (parsedList.length === 0) return;
    if (onImportQuestions) {
      onImportQuestions(parsedList);
    }
    // Success State cleanups
    setImportModalOpen(false);
    setPasteText('');
    setParsedList([]);
    setParsingErrors([]);
    setFileName('');
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
            onClick={() => {
              playModalPopSound();
              setImportModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Tải lên / Nhập đề
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

      {/* IMPORT / UPLOAD MODAL */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-500 text-white p-2 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Nhập đề khảo sát & Tải lên câu hỏi</h3>
                  <p className="text-xs text-slate-500">Tự tạo đề bằng cách kéo thả file hoặc dán văn bản thô.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setImportModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-150 p-1.5 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Input Options */}
              <div className="space-y-4 flex flex-col">
                <div className="flex border-b border-slate-200 text-xs font-semibold">
                  <button
                    onClick={() => { playClickSound(); setImportTab('upload'); }}
                    className={`pb-2.5 px-4 ${importTab === 'upload' ? 'border-b-2 border-emerald-500 text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    📂 Tải lên File (JSON / TXT)
                  </button>
                  <button
                    onClick={() => { playClickSound(); setImportTab('paste'); }}
                    className={`pb-2.5 px-4 ${importTab === 'paste' ? 'border-b-2 border-emerald-500 text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    ✍️ Dán văn bản thô
                  </button>
                </div>

                {importTab === 'upload' ? (
                  <div className="space-y-4 flex-1 flex flex-col">
                    {/* Drag and Drop Zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition flex-1 min-h-[220px] ${
                        dragActive
                          ? 'border-emerald-500 bg-emerald-50/40 text-emerald-700'
                          : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 text-slate-500'
                      }`}
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                    >
                      <input
                        id="file-upload-input"
                        type="file"
                        accept=".txt,.json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className={`w-10 h-10 mb-3 transition ${dragActive ? 'text-emerald-500 scale-110' : 'text-slate-400'}`} />
                      <p className="text-xs font-bold text-slate-700">Kéo & thả file của bạn vào đây</p>
                      <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ định dạng .TXT hoặc .JSON toán học</p>
                      
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-[11px] shadow-xs cursor-pointer"
                      >
                        Chọn tệp từ máy tính
                      </button>

                      {fileName && (
                        <div className="mt-3 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[11px] font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" /> {fileName}
                        </div>
                      )}
                    </div>

                    {/* Download samples */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px] mb-2">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Thầy cô chưa có file mẫu? Tải bản tương thích:
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadSampleFile('txt')}
                          className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-emerald-500" /> Tải mẫu TXK (.txt)
                        </button>
                        <button
                          onClick={() => handleDownloadSampleFile('json')}
                          className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-indigo-500" /> Tải mẫu JSON (.json)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 flex flex-col">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Dán câu hỏi toán học dạng văn bản thô theo cú pháp chung. Mỗi câu hỏi cách nhau bằng dòng trống:
                    </p>
                    <textarea
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder={`Câu: Khai triển biểu thức $A = (x - 3y)^2$ ta được:
Chương: chuong-1
Chủ đề: Những hằng đẳng thức đáng nhớ
Mức độ: Nhận biết
Dạng: MCQ
A. $x^2 - 6xy + 9y^2$
B. $x^2 - 3xy + 9y^2$
C. $x^2 + 9y^2$
D. $x^2 - 6xy - 9y^2$
Đáp án: A
Lời giải: Áp dụng $(a-b)^2 = a^2 - 2ab + b^2$ với $a=x$ và $b=3y$.`}
                      className="w-full flex-1 min-h-[180px] text-xs font-mono p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleExtractPasteText}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        🔍 Bắt đầu phân tích & Trích xuất
                      </button>
                      <button
                        onClick={() => {
                          playClickSound();
                          setPasteText(`Câu: Rút gọn đơn thức $A = 2x \\cdot 3y^2$ ta được:
Chương: chuong-1
Chủ đề: Đơn thức và đa thức 
Mức độ: Nhận biết
Dạng: MCQ
A. $6xy^2$
B. $5xy^2$
C. $6x^2y$
D. $5x^2y$
Đáp án: A
Lời giải: Hệ số là 2 * 3 = 6, tích phần biến là x * y^2 = xy^2.

Câu: Tính giá trị của hằng đẳng thức $x^2 - 9$ tại $x = 13$:
Chương: chuong-2
Chủ đề: Những hằng đẳng thức đáng nhớ
Mức độ: Thông hiểu
Dạng: SHORT
Đáp án: 160
Lời giải: Thay $x = 13$: $13^2 - 9 = 169 - 9 = 160$.`);
                          setParsingErrors([]);
                        }}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Mẫu nhanh
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Parsed Results & Live Preview */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col max-h-[460px]">
                <div className="pb-3 border-b border-slate-200/60 flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    📊 Bộ giải mã đề ({parsedList.length} câu)
                  </h4>
                  {parsedList.length > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100 text-[10px] rounded-full">
                      Sẵn sàng nạp
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mt-3 pr-1">
                  {parsingErrors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-[11px] font-sans flex flex-col gap-1">
                      <div className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Phát hiện lỗi phân tích:
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {parsingErrors.map((err, errIdx) => (
                          <li key={errIdx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parsedList.length === 0 && parsingErrors.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <FileText className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-xs font-bold">Chưa có câu hỏi nào được phân tích</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Vui lòng tải file hoặc dán văn bản mẫu bên trái.</p>
                    </div>
                  ) : (
                    parsedList.map((item, index) => (
                      <div key={index} className="p-3 bg-white border border-slate-200/85 rounded-xl space-y-2 relative shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[9px] rounded font-mono">
                            Khối #{index + 1}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-100">
                            {item.type}
                          </span>
                        </div>

                        <div className="text-[11px] font-bold text-slate-800 leading-normal">
                          <MathText text={item.content} />
                        </div>

                        {item.type === 'MCQ' && item.options && (
                          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-slate-500">
                            {item.options.map((opt, oIdx) => (
                              <div key={oIdx} className="bg-slate-50/70 p-1.5 rounded border border-slate-100/80 truncate">
                                <b>{String.fromCharCode(65 + oIdx)}.</b> <MathText text={opt} />
                              </div>
                            ))}
                          </div>
                        )}

                        {item.type === 'TF' && item.subQuestions && (
                          <div className="space-y-1 pt-1 text-[10px] text-slate-600">
                            {item.subQuestions.map((stmt, sIdx) => (
                              <div key={sIdx} className="bg-slate-50/70 p-1 rounded border border-slate-100/80">
                                {sIdx + 1}/ <MathText text={stmt} />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-dashed border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
                          <div>
                            Chương: <strong className="text-slate-600 font-bold font-mono">{item.syllabus}</strong>
                          </div>
                          <div>
                            Độ khó: <span className="text-slate-600 font-bold">{item.level}</span>
                          </div>
                        </div>

                        <div className="p-2 bg-emerald-50/40 border border-emerald-100/50 rounded-lg text-[10px] space-y-0.5">
                          <div>
                            <span className="font-bold text-emerald-800">Đáp án:</span> <span className="font-mono text-emerald-800 font-extrabold">{Array.isArray(item.correct) ? item.correct.join(', ') : item.correct}</span>
                          </div>
                          <div className="italic text-slate-400 font-sans leading-normal">
                            HD: {item.solution}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium font-sans">
                {parsedList.length > 0 ? `🎉 Trích xuất thành công ${parsedList.length} câu hỏi đạt chuẩn.` : 'Hệ thống hỗ trợ nạp đề động bám sát tiến độ.'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setImportModalOpen(false);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                >
                  Đóng lại
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={parsedList.length === 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Xác nhận & Import vào Ngân hàng ({parsedList.length} câu)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
