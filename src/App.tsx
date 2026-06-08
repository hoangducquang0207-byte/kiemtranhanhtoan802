/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle,
  FileText,
  Save,
  HelpCircle,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Printer,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

import { Question, PresetQuiz, Assignment, ClassReport } from './types';
import {
  syllabusData,
  defaultQuestionBank,
  defaultAssignments,
  defaultPresetQuizzes,
  defaultClassReports,
  navMenu,
  generateRandomMathQuestion
} from './data';

// Modular Views Imports
import TrangChu from './components/TrangChu';
import TaoDe from './components/TaoDe';
import KhoCauHoi from './components/KhoCauHoi';
import BaoCao from './components/BaoCao';
import LamBai from './components/LamBai';
import ChamDiem from './components/ChamDiem';
import MathText from './components/MathText';
import { playClickSound, playCorrectChime, playIncorrectChime, playCelebrationFanfare, playModalPopSound } from './utils/audio';

export default function App() {
  // Global States
  const [currentTab, setCurrentTab] = useState('trang-chu');
  const [username, setUsername] = useState('Nguyễn Văn An');
  const [userClass, setUserClass] = useState('8A2');

  const [learnedLessons, setLearnedLessons] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.keys(syllabusData).forEach((chuongKey) => {
      const isLearnedByDefault = chuongKey === 'chuong-1' || chuongKey === 'chuong-2';
      syllabusData[chuongKey].lessons.forEach((l) => {
        initial[l] = isLearnedByDefault;
      });
    });
    return initial;
  });

  const [questions, setQuestions] = useState<Question[]>(defaultQuestionBank);
  const [assignments, setAssignments] = useState<Assignment[]>(defaultAssignments);
  const [quizzes, setQuizzes] = useState<PresetQuiz[]>(defaultPresetQuizzes);
  const [classReports, setClassReports] = useState<Record<string, ClassReport>>(defaultClassReports);

  const [stats, setStats] = useState({
    totalTests: 3,
    highestScore: 9.0,
    avgScore: 7.7,
    weakTopic: 'Hằng Đẳng Thức',
    correctAnswers: 15,
    incorrectAnswers: 5,
  });

  // Active Live Quiz states
  const [activeQuiz, setActiveQuiz] = useState<{
    quizId: string | null;
    title: string;
    questions: Question[];
    userAnswers: Record<number, any>;
    timerSeconds: number;
    currentQuestionIndex: number;
    mode: string;
  } | null>(null);

  // Timers
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (activeQuiz && activeQuiz.timerSeconds > 0) {
      timerId = setInterval(() => {
        setActiveQuiz((prev) => {
          if (!prev) return null;
          if (prev.timerSeconds <= 1) {
            clearInterval(timerId!);
            handleAutoSubmitQuiz();
            return { ...prev, timerSeconds: 0 };
          }
          return { ...prev, timerSeconds: prev.timerSeconds - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [activeQuiz]);

  // Dialog & Modal Control states
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: '',
    message: '',
  });

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [questionModal, setQuestionModal] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    activeQuestion?: Question;
  }>({
    open: false,
    mode: 'add',
  });

  const [exportModal, setExportModal] = useState<{
    open: boolean;
    type: 'word-report' | 'pdf-report' | 'quiz-structure';
    title: string;
    contentHtml: string;
  }>({
    open: false,
    type: 'word-report',
    title: '',
    contentHtml: '',
  });

  // Giao Bài Teacher States
  const [assignClass, setAssignClass] = useState('8A2');
  const [assignQuizId, setAssignQuizId] = useState('Q-PRESET-1');
  const [assignDeadline, setAssignDeadline] = useState('2026-06-15');

  // Question Creation Form fields (binds to QuestionModal)
  const [qFormSyllabus, setQFormSyllabus] = useState('chuong-1');
  const [qFormTopic, setQFormTopic] = useState('');
  const [qFormLevel, setQFormLevel] = useState<'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao'>('Thông hiểu');
  const [qFormType, setQFormType] = useState<'MCQ' | 'TF' | 'SHORT'>('MCQ');
  const [qFormContent, setQFormContent] = useState('');
  const [qFormSolution, setQFormSolution] = useState('');
  
  const [qFormMCQOptions, setQFormMCQOptions] = useState<string[]>(['', '', '', '']);
  const [qFormMCQCorrect, setQFormMCQCorrect] = useState('A');

  const [qFormTFStatements, setQFormTFStatements] = useState<string[]>(['', '', '', '']);
  const [qFormTFCorrect, setQFormTFCorrect] = useState<string>('Đúng,Sai,Đúng,Sai');

  const [qFormShortCorrect, setQFormShortCorrect] = useState('');

  // Sidenav progress widget calculations
  const [progressStats, setProgressStats] = useState({
    algebraTotal: 21,
    algebraLearned: 9,
    geometryTotal: 19,
    geometryLearned: 5,
  });

  useEffect(() => {
    let algTotal = 0, algLearned = 0;
    let geoTotal = 0, geoLearned = 0;

    Object.keys(syllabusData).forEach((key) => {
      const isAlgebra = ['chuong-1', 'chuong-2', 'chuong-6', 'chuong-7'].includes(key);
      syllabusData[key].lessons.forEach((l) => {
        const learned = !!learnedLessons[l];
        if (isAlgebra) {
          algTotal++;
          if (learned) algLearned++;
        } else {
          geoTotal++;
          if (learned) geoLearned++;
        }
      });
    });

    setProgressStats({
      algebraTotal: algTotal,
      algebraLearned: algLearned,
      geometryTotal: geoTotal,
      geometryLearned: geoLearned,
    });
  }, [learnedLessons]);

  // Toast notifications trigger helper
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-5 right-5 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-lg z-50 text-xs font-bold flex items-center gap-2 transform transition-all duration-300 translate-y-10 opacity-0';
    toast.innerHTML = `<span class="bg-emerald-500 rounded-full p-1 text-white">✓</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    }, 50);

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const throwAlert = (title: string, message: string) => {
    setAlertModal({ open: true, title, message });
  };

  const handleSaveProfile = () => {
    if (!username.trim()) {
      throwAlert('⚠️ Tên Trống', 'Vui lòng điền họ và tên của học sinh.');
      return;
    }
    showToast('Lưu cấu hình thông tin học sinh thành công!');
  };

  // Student adaptive supplemental generate trigger
  const handleTriggerAdaptiveQuiz = () => {
    showToast('Đang thiết lập thông số đề bổ sung hằng đẳng thức đáng nhớ...');
    setAssignQuizId('Q-PRESET-2');
    setCurrentTab('tao-de');
    showToast('Đã chuẩn bị đề ôn tập 5 câu Hằng đẳng thức cho bạn.');
  };

  // Student weaknesses review review panel trigger
  const handleTriggerWeaknessReview = () => {
    throwAlert(' Phân tích lỗi sai', 'Hệ thống đã chuẩn bị bài phân tích lỗi sai và lời giải chi tiết của 3 đề kiểm tra gần đây nhất. Hãy kiểm tra các phần giải thích hằng đẳng thức và hình thoi.');
    setActiveQuiz({
      quizId: 'Q-SAMPLE-MISTAKEN',
      title: 'Phân tích lỗi sai tự ôn tập của em',
      questions: [questions[0], questions[1], questions[2]],
      userAnswers: { 0: 'A', 1: ['Sai', 'Sai', 'Sai', 'Sai'], 2: '10x' },
      timerSeconds: 300,
      currentQuestionIndex: 0,
      mode: 'on-tap-loi-sai',
    });
    setCurrentTab('cham-diem');
  };

  // Setup lesson learned checkboxes manually
  const toggleChapterCheckboxValue = (chapterKey: string, val: boolean) => {
    playClickSound();
    const list = syllabusData[chapterKey]?.lessons || [];
    setLearnedLessons((prev) => {
      const copy = { ...prev };
      list.forEach((l) => {
        copy[l] = val;
      });
      return copy;
    });
  };

  const handleSaveProgressChecklist = () => {
    setProgressModalOpen(false);
    showToast('Bảng tiến độ học thực tế đã được cập nhật thành công!');
  };

  // PREVIEW QUIZ STRUCTURE before starting
  const handlePreviewQuiz = (syllabusKey: string, topic: string, count: number) => {
    const selectedTitle = syllabusData[syllabusKey]?.title || 'Toán học';
    const topicDisplay = topic === 'all' ? 'Toàn bộ chương học' : topic;
    
    throwAlert(
      '👁️ Cấu Trúc Khung Đề Thi',
      `Đề trắc nghiệm tự ôn tập gồm: <strong>${count} câu hỏi chất lượng cao</strong>.<br />
    Chương học: <strong>${selectedTitle}</strong>.<br />
    Chủ đề lọc: <strong>${topicDisplay}</strong>.<br /><br />
    <i>Phân phối độ khó tối ưu: 40% Nhận biết, 40% Thông hiểu, 20% Vận dụng phù hợp với tiến trình lớp học của bạn.</i>`
    );
  };

  // Launch quick exercise with specific selected questions from the Bank
  const handleStartCustomQuiz = (customQuestions: Question[]) => {
    if (customQuestions.length === 0) {
      throwAlert('⚠️ Lỗi Kết Nối', 'Vui lòng chọn ít nhất 1 câu hỏi để bắt đầu luyện tập tức thì!');
      return;
    }
    setActiveQuiz({
      quizId: 'Q-CUSTOM-' + Math.floor(Math.random() * 89999 + 10000),
      title: `Luyện tập ôn thi: Tùy chọn từ Ngân hàng đề (${customQuestions.length} câu)`,
      questions: customQuestions,
      userAnswers: {},
      timerSeconds: Math.max(5, Math.round(customQuestions.length * 1.5)) * 60,
      currentQuestionIndex: 0,
      mode: 'tự luyện nhanh',
    });
    setCurrentTab('lam-bai');
    showToast(`Đã nạp thành công ${customQuestions.length} câu vào bảng làm bài!`);
  };

  // Package a list of chosen questions as a Preset Quiz in "Danh sách đề"
  const handleSaveQuizPreset = (customQuestions: Question[]) => {
    if (customQuestions.length === 0) {
      throwAlert('⚠️ Không Có Câu Hỏi', 'Vui lòng chọn hoặc lọc các câu hỏi để đóng gói đề thi mới!');
      return;
    }
    const defaultTitle = `Đề tự đóng gói: Hằng đẳng thức & Hình học (${customQuestions.length} câu)`;
    let title: string | null = null;
    try {
      title = window.prompt('Nhập tiêu đề hoặc tên gói đề kiểm tra mới của bạn:', defaultTitle);
    } catch (e) {
      console.warn('window.prompt was blocked in iframe context', e);
      title = defaultTitle;
    }
    if (title === null) return; // user clicked cancel
    const finalTitle = title.trim() || defaultTitle;

    const newQuiz: PresetQuiz = {
      id: 'Q-SAVED-' + Math.floor(Math.random() * 89999 + 10000),
      title: finalTitle,
      class: userClass,
      syllabus: customQuestions[0]?.syllabus || 'chuong-1',
      topic: customQuestions[0]?.topic || 'Tổng hợp',
      mode: 'tự luyện',
      questionCount: customQuestions.length,
      timer: Math.max(5, Math.round(customQuestions.length * 1.5)),
      type: 'mixed',
      level: 'mixed',
      questions: customQuestions.map((q) => q.id),
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Đã lưu',
    };

    setQuizzes((prev) => [newQuiz, ...prev]);
    showToast(`Đóng gói & Tạo đề thành công: "${finalTitle}" đã sẵn sàng ở Kho đề!`);
    setCurrentTab('kho-de'); // Navigate to Kho de
  };

  // RENDER DYNAMIC QUIZZES ON THE FLY
  const handleCreateQuizNow = (config: {
    syllabusKey: string;
    topic: string;
    count: number;
    timerMinutes: number;
    mode: string;
    type: string;
    level: string;
    source: string;
  }) => {
    // Determine the active lessons for this generation (Kiểm soát tiến độ hoạt động)
    let targetLessons = [config.topic];
    if (config.topic === 'all') {
      const chapterLessons = syllabusData[config.syllabusKey]?.lessons || [];
      const ticked = chapterLessons.filter((l) => !!learnedLessons[l]);
      if (ticked.length === 0 && chapterLessons.length > 0) {
        // Auto tick the first lesson to avoid empty state
        const firstLesson = chapterLessons[0];
        setLearnedLessons((prev) => ({ ...prev, [firstLesson]: true }));
        targetLessons = [firstLesson];
      } else {
        targetLessons = ticked;
      }
    } else {
      // Auto tick the specific topic being tested if it wasn't already checked
      if (!learnedLessons[config.topic]) {
        setLearnedLessons((prev) => ({ ...prev, [config.topic]: true }));
      }
    }

    let finalQuestions: Question[] = [];
    let isFromKhoDe = false;
    let matchedQuizTitle = '';

    // Check if the source permits loading from the 'Kho Đề Kiểm Tra'
    if (config.source === 'both' || config.source === 'store') {
      // Try to find a matching quiz from quizzes that belongs to the current syllabus
      const potentialPresetQuizzes = quizzes.filter((qz) => qz.syllabus === config.syllabusKey);
      
      let bestMatchingQuiz: PresetQuiz | null = null;
      let bestQuizQuestionsList: Question[] = [];

      for (const qz of potentialPresetQuizzes) {
        const qzQuestions = qz.questions
          .map((qid) => questions.find((item) => item.id === qid))
          .filter((x): x is Question => x !== undefined);

        if (qzQuestions.length === 0) continue;

        // Check if ALL questions of this preset quiz correspond to active learned lessons ("Kiểm soát tiến độ hoạt động")
        const isProgressCompliant = qzQuestions.every((q) => {
          return targetLessons.includes(q.topic) && !!learnedLessons[q.topic];
        });

        if (isProgressCompliant) {
          // Prefer the quiz with closer question count
          if (!bestMatchingQuiz || Math.abs(qzQuestions.length - config.count) < Math.abs(bestQuizQuestionsList.length - config.count)) {
            bestMatchingQuiz = qz;
            bestQuizQuestionsList = qzQuestions;
          }
        }
      }

      if (bestMatchingQuiz && bestQuizQuestionsList.length > 0) {
        isFromKhoDe = true;
        matchedQuizTitle = bestMatchingQuiz.title;

        if (bestQuizQuestionsList.length === config.count) {
          finalQuestions = [...bestQuizQuestionsList];
        } else if (bestQuizQuestionsList.length > config.count) {
          finalQuestions = bestQuizQuestionsList.slice(0, config.count);
        } else {
          // Need to top up with AI simulated generation to match requested count
          finalQuestions = [...bestQuizQuestionsList];
          const neededCount = config.count - finalQuestions.length;
          const newGeneratedQuestions: Question[] = [];
          for (let i = 0; i < neededCount; i++) {
            const topicToGen = targetLessons[i % targetLessons.length] || (syllabusData[config.syllabusKey]?.lessons[0] || 'Tổng hợp');
            const nextIdCounter = questions.length + i + 1;
            const newQ = generateRandomMathQuestion(config.syllabusKey, nextIdCounter, topicToGen);
            newGeneratedQuestions.push(newQ);
          }
          setQuestions((prev) => [...newGeneratedQuestions, ...prev]);
          finalQuestions = finalQuestions.concat(newGeneratedQuestions);
          showToast(`🤖 Lấy từ Kho Đề và sinh bổ sung ${neededCount} câu học tập khớp hoàn toàn tiến độ!`);
        }
      }
    }

    // Fallback: Custom dynamic generation via AI if not found in Kho De or skipped
    if (finalQuestions.length === 0) {
      // Gather eligible questions from the standard bank first if not purely simulated AI
      let eligibleQuestions: Question[] = [];
      if (config.source !== 'ai') {
        eligibleQuestions = questions.filter(
          (q) => q.syllabus === config.syllabusKey && targetLessons.includes(q.topic) && !!learnedLessons[q.topic]
        );
      }

      // Generate missing questions on the fly, matching the cognitive levels or structure requested
      const neededCount = config.count - eligibleQuestions.length;
      if (neededCount > 0) {
        const newGeneratedQuestions: Question[] = [];
        for (let i = 0; i < neededCount; i++) {
          const topicToGen = targetLessons[i % targetLessons.length] || (syllabusData[config.syllabusKey]?.lessons[0] || 'Tổng hợp');
          const nextIdCounter = questions.length + i + 1;
          const newQ = generateRandomMathQuestion(config.syllabusKey, nextIdCounter, topicToGen);
          newGeneratedQuestions.push(newQ);
        }
        setQuestions((prev) => [...newGeneratedQuestions, ...prev]);
        eligibleQuestions = eligibleQuestions.concat(newGeneratedQuestions);
        showToast(`🤖 Trợ lý AI đã thiết kế riêng ${neededCount} câu hỏi chất lượng cao hợp tiến độ học!`);
      }

      // Shuffle and pick exactly config.count
      finalQuestions = [...eligibleQuestions].sort(() => Math.random() - 0.5).slice(0, config.count);
    }

    // Double check that we have questions in hand
    if (finalQuestions.length === 0) {
      throwAlert(
        '⚠️ Không Tìm Thấy Câu Hỏi',
        'Không tìm thấy câu hỏi phù hợp. Vui lòng kiểm tra lại tiến độ hoặc tích chọn thêm bài đã học.'
      );
      return;
    }

    const compiledTitle = isFromKhoDe
      ? `Đề lấy từ Kho Đề: ${matchedQuizTitle}`
      : `Đề tự luyện AI: ${syllabusData[config.syllabusKey]?.title || 'Toán 8'}`;

    setActiveQuiz({
      quizId: 'Q-LIVE-' + Math.floor(Math.random() * 89999 + 10000),
      title: compiledTitle,
      questions: finalQuestions,
      userAnswers: {},
      timerSeconds: config.timerMinutes * 60,
      currentQuestionIndex: 0,
      mode: isFromKhoDe ? 'Luyện tập kho đề' : config.mode,
    });
    setCurrentTab('lam-bai');
    
    if (isFromKhoDe) {
      throwAlert(
        '🎯 Đã Nạp Đề Kiểm Tra Phù Hợp',
        `Hệ thống phát hiện đề thi bám sát tiến độ học của bạn có sẵn trong <b>Kho Đề Kiểm Tra</b>:<br/><br/>
        Tên đề: <b>"${matchedQuizTitle}"</b><br/>
        Tổng số câu nạp: <b>${config.count} câu</b>.<br/><br/>
        <i>Chúc bạn làm bài thi đạt kết quả xuất sắc!</i>`
      );
    } else {
      showToast('Tạo đề kiểm tra bám sát tiến độ bằng AI thành công!');
    }
  };

  // Student answer controls
  const handleSelectAnswer = (option: string) => {
    if (!activeQuiz) return;
    playClickSound();
    setActiveQuiz((prev) => {
      if (!prev) return null;
      const copy = { ...prev.userAnswers };
      copy[prev.currentQuestionIndex] = option;
      return { ...prev, userAnswers: copy };
    });
  };

  const handleSelectTFAnswer = (subIdx: number, val: 'Đúng' | 'Sai') => {
    if (!activeQuiz) return;
    playClickSound();
    setActiveQuiz((prev) => {
      if (!prev) return null;
      const copy = { ...prev.userAnswers };
      const currentArr = (copy[prev.currentQuestionIndex] as string[]) || Array(4).fill(null);
      const newArr = [...currentArr];
      newArr[subIdx] = val;
      copy[prev.currentQuestionIndex] = newArr;
      return { ...prev, userAnswers: copy };
    });
  };

  const handleShortInputAnswer = (val: string) => {
    if (!activeQuiz) return;
    setActiveQuiz((prev) => {
      if (!prev) return null;
      const copy = { ...prev.userAnswers };
      copy[prev.currentQuestionIndex] = val;
      return { ...prev, userAnswers: copy };
    });
  };

  const handleAutoSubmitQuiz = () => {
    // called when countdown hits 0
    showToast('⌛ Hết giờ chế độ luyện tập! Hệ thống tự động tiến hành chấm điểm...');
    setCurrentTab('cham-diem');
  };

  const handleSubmitQuizManual = () => {
    if (!activeQuiz) return;
    const answered = Object.keys(activeQuiz.userAnswers).length;
    const total = activeQuiz.questions.length;

    const query =
      answered < total
        ? `Bạn mới hoàn thiện <strong>${answered}</strong> trên tổng số <strong>${total}</strong> câu hỏi.<br/><br/>Bạn có chắc chắn vẫn muốn nộp bài thi chứ?`
        : `Bạn đã hoàn tất toàn bộ <strong>${total}</strong> câu hỏi toán học.<br/><br/>Bạn có muốn nộp bài ngay để hệ thống chấm và phân tích kết quả?`;

    setConfirmModal({
      open: true,
      title: 'Nộp Bài Thi Chuyên Đề',
      message: query,
      onConfirm: () => {
        // Calculate score and synchronize personal profile stats
        let correct = 0;
        activeQuiz.questions.forEach((q, idx) => {
          const studentAns = activeQuiz.userAnswers[idx];
          if (q.type === 'MCQ') {
            if (studentAns === q.correct) correct++;
          } else if (q.type === 'SHORT') {
            const formStud = (studentAns || '').toString().trim().replace(/\s+/g, '').toLowerCase();
            const formCorr = (q.correct as string).trim().replace(/\s+/g, '').toLowerCase();
            if (formStud === formCorr) correct++;
          } else if (q.type === 'TF') {
            const correctArr = q.correct as string[];
            const studentArr = (studentAns as string[]) || [];
            const isAllCorrect = correctArr.every((v, si) => studentArr[si] === v);
            if (isAllCorrect) correct += 0.5;
          }
        });

        let calculatedScore = (correct / total) * 10;
        calculatedScore = Math.round(calculatedScore * 10) / 10;

        // Update statistics
        setStats((prev) => {
          const t = prev.totalTests + 1;
          const highest = calculatedScore > prev.highestScore ? calculatedScore : prev.highestScore;
          const avg = Math.round(((prev.avgScore * prev.totalTests + calculatedScore) / t) * 10) / 10;
          return {
            totalTests: t,
            highestScore: highest,
            avgScore: avg,
            weakTopic: calculatedScore < 6.5 ? activeQuiz.questions[0]?.topic || prev.weakTopic : prev.weakTopic,
            correctAnswers: prev.correctAnswers + Math.floor(correct),
            incorrectAnswers: prev.incorrectAnswers + (total - Math.floor(correct)),
          };
        });

        // Synchronize back to class reports
        setClassReports((prev) => {
          const report = { ...prev[userClass] };
          if (report) {
            report.students += 1;
            report.avgScore = Math.round(((report.avgScore * (report.students - 1) + calculatedScore) / report.students) * 10) / 10;
            if (calculatedScore < 5.5) {
              report.struggling = [
                ...report.struggling,
                { name: username, avg: calculatedScore, weak: activeQuiz.questions[0]?.topic || 'Biến đổi biểu thức', tests: 1 },
              ];
            }
          }
          return { ...prev, [userClass]: report };
        });

        setCurrentTab('cham-diem');
        // Audio reinforcement logic based on the score achieved
        if (calculatedScore >= 8.0) {
          playCelebrationFanfare();
        } else if (calculatedScore >= 5.5) {
          playCorrectChime();
        } else {
          playIncorrectChime();
        }
        showToast('Nộp bài và chấm điểm AI tự học thành công!');
      }
    });
  };

  // Launch pre-preset quiz quickly
  const handleStartPresetQuiz = (quizId: string) => {
    const qz = quizzes.find((q) => q.id === quizId);
    if (!qz) return;

    const listQs = qz.questions
      .map((qid) => questions.find((item) => item.id === qid))
      .filter((x): x is Question => x !== undefined);

    setActiveQuiz({
      quizId,
      title: qz.title,
      questions: listQs,
      userAnswers: {},
      timerSeconds: qz.timer * 60,
      currentQuestionIndex: 0,
      mode: qz.mode,
    });
    setCurrentTab('lam-bai');
    showToast(`Đã nạp đề kiểm tra: ${qz.title}`);
  };

  // Supplemental recovery adaptive test generator
  const handleGenerateAdaptiveRecovery = () => {
    showToast('⚡ Công cụ Adaptive AI đang nghiên cứu biểu thức dễ hơn...');
    setTimeout(() => {
      const customQs = [
        questions[1], // Hằng đẳng thức TF Nhận biết
        questions[8], // Phân tích hằng đẳng thức Thông hiểu
        questions[2], // Cộng trừ đa thức Thông hiểu
        questions[0], // Đơn thức Nhận biết
        questions[3], // Hình vuông Nhận biết
      ];

      setActiveQuiz({
        quizId: 'Q-REMEDIAL-' + Math.floor(Math.random() * 899 + 100),
        title: 'Đề phụ phục hồi căn bản hằng đẳng thức & đa thức',
        questions: customQs,
        userAnswers: {},
        timerSeconds: 300,
        currentQuestionIndex: 0,
        mode: 'BỔ SUNG',
      });
      setCurrentTab('lam-bai');
      showToast('Hệ thống phục hồi: Đã ưu tiên các bài nhận biết vừa sức!');
    }, 600);
  };

  // Question editing/adding dialog controllers
  const handleOpenEditQuestion = (q: Question) => {
    setQFormSyllabus(q.syllabus);
    setQFormTopic(q.topic);
    setQFormLevel(q.level);
    setQFormType(q.type);
    setQFormContent(q.content);
    setQFormSolution(q.solution);
    if (q.type === 'MCQ' && q.options) {
      setQFormMCQOptions([...q.options]);
      setQFormMCQCorrect(q.correct as string);
    } else if (q.type === 'TF' && q.subQuestions) {
      setQFormTFStatements([...q.subQuestions]);
      setQFormTFCorrect((q.correct as string[]).join(','));
    } else if (q.type === 'SHORT') {
      setQFormShortCorrect(q.correct as string);
    }

    setQuestionModal({
      open: true,
      mode: 'edit',
      activeQuestion: q,
    });
  };

  const handleOpenAddQuestion = () => {
    setQFormSyllabus('chuong-1');
    setQFormTopic('');
    setQFormLevel('Thông hiểu');
    setQFormType('MCQ');
    setQFormContent('');
    setQFormSolution('');
    setQFormMCQOptions(['', '', '', '']);
    setQFormMCQCorrect('A');
    setQFormTFStatements(['', '', '', '']);
    setQFormTFCorrect('Đúng,Sai,Đúng,Sai');
    setQFormShortCorrect('');

    setQuestionModal({
      open: true,
      mode: 'add',
    });
  };

  const handleSaveQuestionForm = () => {
    if (!qFormContent.trim()) {
      alert('Vui lòng bổ sung nội dung câu hỏi khảo sát.');
      return;
    }

    let correctVal: string | string[] = '';
    let optionsVal: string[] | undefined = undefined;
    let subQuestionsVal: string[] | undefined = undefined;

    if (qFormType === 'MCQ') {
      optionsVal = qFormMCQOptions.map((o) => o.trim() || '...');
      correctVal = qFormMCQCorrect;
    } else if (qFormType === 'TF') {
      subQuestionsVal = qFormTFStatements.map((s, si) => s.trim() || `Nhận định số ${si + 1}`);
      correctVal = qFormTFCorrect.split(',').map((s) => s.trim());
    } else {
      correctVal = qFormShortCorrect.trim() || '0';
    }

    if (questionModal.mode === 'add') {
      const code = 'CH' + (questions.length + 1).toString().padStart(3, '0');
      const item: Question = {
        id: code,
        syllabus: qFormSyllabus,
        topic: qFormTopic.trim() || 'Tổng hợp',
        level: qFormLevel,
        type: qFormType,
        content: qFormContent,
        options: optionsVal,
        subQuestions: subQuestionsVal,
        correct: correctVal,
        solution: qFormSolution.trim() || 'Chưa cung cấp lời giải chi tiết.',
        source: 'Giáo viên',
        status: 'Đã duyệt',
        uses: 0,
        correctRate: 100,
      };

      setQuestions((prev) => [...prev, item]);
      showToast(`Đã bổ sung câu hỏi mới thành công: ${code}`);
    } else {
      const activeId = questionModal.activeQuestion?.id;
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === activeId) {
            return {
              ...q,
              syllabus: qFormSyllabus,
              topic: qFormTopic.trim() || q.topic,
              level: qFormLevel,
              type: qFormType,
              content: qFormContent,
              options: optionsVal,
              subQuestions: subQuestionsVal,
              correct: correctVal,
              solution: qFormSolution,
            };
          }
          return q;
        })
      );
      showToast(`Đã cập nhật câu hỏi thành công: ${activeId}`);
    }

    setQuestionModal({ open: false, mode: 'add' });
  };

  const handleDeleteQuestion = (id: string) => {
    setConfirmModal({
      open: true,
      title: 'Xóa câu hỏi',
      message: `Bạn có chắc chắn muốn bỏ vĩnh viễn câu hỏi có mã: <strong>${id}</strong>? Thao tác này không thể hoàn tác.`,
      onConfirm: () => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        showToast(`Đã loại bỏ câu hỏi: ${id}`);
      }
    });
  };

  // AI simulates similar mathematical equation questions generator
  const handleSimulateAIGenerate = async (chapterCode: string) => {
    return new Promise<void>((resolve) => {
      // Simulate real calculation latency
      setTimeout(() => {
        const newItem = generateRandomMathQuestion(chapterCode, questions.length + 1);
        setQuestions((prev) => [newItem, ...prev]);
        throwAlert(
          '🤖 Trợ Lý AI Sinh Đề',
          `AI đã thu thập dữ liệu chương học và tự động sinh thành công câu hỏi Equation: <b>${newItem.id}</b> thuộc chủ đề <i>"${newItem.topic}"</i> hiển thị sắc nét với KaTeX!`
        );
        resolve();
      }, 1000);
    });
  };

  // Classroom teacher task creation
  const handleCreateNewAssignment = () => {
    const qz = quizzes.find((q) => q.id === assignQuizId);
    if (!qz) return;

    if (!assignDeadline) {
      throwAlert('⚠️ Chưa cài đặt hạn nộp', 'Thầy cô vui lòng chỉ định hạn nộp trước khi phát đề.');
      return;
    }

    const item: Assignment = {
      id: 'GB' + Math.floor(Math.random() * 899 + 100),
      className: assignClass,
      quizTitle: qz.title,
      deadline: assignDeadline,
      status: 'Đang mở',
      total: assignClass === '8A1' ? 10 : assignClass === '8A2' ? 12 : 8,
      submitted: 0,
      quizId: assignQuizId,
    };

    setAssignments((prev) => [item, ...prev]);
    showToast('Đã phát đề kiểm tra trực tuyến thành công cho cả lớp học!');
  };

  // Sync classroom progress reports to teacher's spreadsheet
  const handleSyncGoogleSheets = () => {
    showToast('🔄 Đang mã hóa bảng điểm nộp bài học sinh lên Google Drive...');
    setTimeout(() => {
      throwAlert(
        '🟢 Đồng bộ Google Sheets thành công!',
        `Hệ thống cloud đã cập nhật <b>${stats.totalTests} dòng dữ liệu</b> và phân tích lỗi sai tự học của học sinh <b>${username}</b> lên trang Google Điểm Số chung của Trường học.`
      );
    }, 1200);
  };

  const handleIssueRemedial = (studentName: string) => {
    throwAlert(
      '🎯 Đã giao phiếu củng cố',
      `Adaptive AI đã thiết lập phiếu bài tập ngắn 5 câu phục hồi cho học sinh <b>${studentName}</b> dựa vào mảng kiến thức yếu. Bài đã gửi tự động.`
    );
  };

  const handleExportDocument = (reportType: 'word-report' | 'pdf-report' | 'quiz-structure', optPayload?: any) => {
    if (reportType === 'quiz-structure') {
      const qz = quizzes.find((q) => q.id === optPayload);
      if (!qz) return;

      const qzQuestions = qz.questions
        .map((qid) => questions.find((item) => item.id === qid))
        .filter((x): x is Question => x !== undefined);

      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #334155; padding-bottom: 10px;">
            <div>
              <strong style="font-size: 14px;">TRƯỜNG THCS NGHIÊN CỨU TOÁN HỌC KHỐI 8</strong><br />
              <span style="font-size: 12px; color: #64748b;">Họ tên: ..............................................................</span><br />
              <span style="font-size: 12px; color: #64748b;">Lớp nộp bài: ..........................................................</span>
            </div>
            <div style="text-align: right;">
              <strong style="font-size: 14px;">ĐỀ KIỂM TRA ĐẠI DIỆN TOÁN LỚP 8</strong><br />
              <span style="font-size: 12px; color: #64748b;">Thời lượng: ${qz.timer} phút | Mã đề: ${qz.id}</span>
            </div>
          </div>
          <h2 style="text-align: center; text-transform: uppercase; color: #1e3a8a; margin-top: 20px; font-size: 18px;">${qz.title}</h2>
          <p style="text-align: center; font-style: italic; font-size: 12px; color: #475569;">Bản đề thi phục vụ lưu trữ file in ấn. Thí sinh trả lời trực tiếp các câu trắc nghiệm dại số.</p>
          <br />
          <div style="margin-top: 20px;">
            ${qzQuestions
              .map(
                (item, qIdx) => `
              <div style="margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 15px;">
                <p style="font-weight: bold; font-size: 13px; margin-bottom: 8px;">Câu ${qIdx + 1}: ${item.content}</p>
                ${
                  item.type === 'MCQ' && item.options
                    ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 15px; font-size: 13px;">
                        ${item.options.map((o, oi) => `<div><b>${String.fromCharCode(65 + oi)}.</b> ${o}</div>`).join('')}
                      </div>`
                    : ''
                }
                ${
                  item.type === 'TF' && item.subQuestions
                    ? `<div style="margin-left: 15px; font-size: 12px; color: #475569; space-y: 4px;">
                        ${item.subQuestions.map((s) => `<div>• ${s} (Ghi chú: Đúng / Sai)</div>`).join('')}
                      </div>`
                    : ''
                }
                ${item.type === 'SHORT' ? `<div style="margin-left: 15px; font-style: italic; font-size: 12px; color: #64748b;">Đáp án ngắn của em: .............................................................</div>` : ''}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;

      setExportModal({
        open: true,
        type: 'quiz-structure',
        title: 'Bản Đề Thi In Ấn - ' + qz.title,
        contentHtml: html,
      });
    } else {
      // Export results or class statistics
      const html = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; padding: 10px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h3 style="margin: 0; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 1px;">Phòng Giáo dục và Đào tạo quận/huyện</h3>
            <h2 style="margin: 4px 0 0 0; font-size: 14px; text-transform: uppercase; color: #1e3a8a;">TRƯỜNG THCS TOÁN HỌC KHỐI 8</h2>
            <div style="border-bottom: 2px solid #2563eb; width: 80px; margin: 12px auto 0 auto;"></div>
          </div>
          <h2 style="text-align: center; color: #1e293b; font-size: 18px; margin-top: 10px; font-weight: 800;">BÁO CÁO KẾT QUẢ ĐÁNH GIÁ CHUYÊN MÔN DẠI SỐ KIỂM TRA TOÁN 8</h2>
          <p style="text-align: center; font-size: 12px; color: #64748b;">Học sinh báo cáo: <b>${username}</b> | Mã chuyên đề: ${userClass} | Thống kê kết quả cloud</p>
          <br />
          <table style="width: 100%; border-collapse: collapse; text-align: left; margin: 15px 0;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 11px; border: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; font-weight: bold;">Họ tên học sinh</th>
                <th style="padding: 11px; border: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; font-weight: bold;">Mã lớp</th>
                <th style="padding: 11px; border: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; font-weight: bold;">Lượt thi</th>
                <th style="padding: 11px; border: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; font-weight: bold;">Điểm Cao Nhất</th>
                <th style="padding: 11px; border: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; font-weight: bold;">Đánh giá của AI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 11px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 600;">${username}</td>
                <td style="padding: 11px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 600; color: #4b5563;">${userClass}</td>
                <td style="padding: 11px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 700; color: #2563eb;">${stats.totalTests} lần</td>
                <td style="padding: 11px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: bold; color: #10b981;">${stats.highestScore.toFixed(1)}</td>
                <td style="padding: 11px; border: 1px solid #cbd5e1; font-size: 12px; font-style: italic; color: #475569;">Trình độ cơ bản ổn định. Rất có ý thức ôn luyện tự học để phát huy kiến thức yếu.</td>
              </tr>
            </tbody>
          </table>
          <br />
          <div style="background-color: #f0f9ff; border: 1px dashed #3b82f6; padding: 15px; border-radius: 12px; margin-top: 10px;">
            <h4 style="margin: 0 0 6px 0; color: #1d4ed8; font-size: 13px; font-weight: bold;">🔍 Đánh Giá Điểm Yếu Chuyên Sâu Của AI:</h4>
            <p style="margin: 0; font-size: 12px; color: #1e40af; line-height: 1.5;">Học sinh có biểu hiện sai lệch hệ thống ở chủ đề <b>"${stats.weakTopic}"</b>. Việc sử dụng sai dấu âm khi nhân đơn biến có tính lặp lại. Đơn vị đề xuất ra thêm đề phụ thích ứng Nhận biết để củng cố kỹ.</p>
          </div>
        </div>
      `;

      setExportModal({
        open: true,
        type: reportType,
        title: reportType === 'word-report' ? 'Xuất Bản In Word' : 'Xuất Báo Cáo PDF Lớp Học',
        contentHtml: html,
      });
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col antialiased">
      {/* TOP HEADER */}
      <header className="bg-gradient-to-r from-brand-900 to-brand-700 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white text-brand-700 p-2 rounded-xl shadow-md cursor-pointer" onClick={() => setCurrentTab('trang-chu')}>
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-wide font-sans">
                TRẮC NGHIỆM NHANH TOÁN 8 - BY HOÀNG QUANG
              </h1>
              <p className="text-[10px] sm:text-xs text-blue-200 font-medium">Học Tập SGK Kết Nối Tri Thức Với Cuộc Sống</p>
            </div>
          </div>
          {/* Current Student Badge Info */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-2 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Học sinh: {username}</span>
            <span className="text-blue-200">|</span>
            <span className="font-medium text-yellow-300">Lớp: {userClass}</span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR NAVIGATION BAR */}
        <aside className="w-full lg:w-64 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Menu Ứng Dụng
            </p>
            <nav className="space-y-1">
              {navMenu.map((item) => {
                // Determine if item is active
                const isActive = item.id === currentTab;
                if (item.hidden && !isActive) return null;

                const activeClass = 'bg-brand-600 text-white font-bold shadow-md shadow-brand-600/10';
                const inactiveClass = 'text-slate-600 hover:bg-slate-50 font-medium';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playClickSound();
                      if (item.id === 'lam-bai' && !activeQuiz) {
                        throwAlert(
                          '⚠️ Không có đề thi hoạt động',
                          'Vui lòng di chuyển sang tab <b>"Tạo Đề"</b> để thiết lập bắt đầu luyện tập một đề mới.'
                        );
                        return;
                      }
                      setCurrentTab(item.id);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm transition duration-150 flex items-center gap-2.5 cursor-pointer ${
                      isActive ? activeClass : inactiveClass
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Progress Indicator widget */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-blue-50/60 p-4 rounded-2xl border border-indigo-100 shadow-sm hidden lg:block">
            <h4 className="text-xs sm:text-sm font-extrabold text-brand-900 mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-brand-500" /> Tiến độ đã học
            </h4>
            <p className="text-[11px] text-slate-500 mb-3.5 leading-normal">
              Đề thi tự động giới hạn và loại bỏ các câu hỏi thuộc chủ đề chưa học của em.
            </p>

            <div className="space-y-3 mb-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Đại Số (Đã học)</span>
                  <span className="text-indigo-600 font-bold">
                    {progressStats.algebraLearned} / {progressStats.algebraTotal} bài
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300 animate-pulse"
                    style={{
                      width: `${Math.round((progressStats.algebraLearned / progressStats.algebraTotal) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Hình Học & Thống kê</span>
                  <span className="text-emerald-600 font-bold font-sans">
                    {progressStats.geometryLearned} / {progressStats.geometryTotal} bài
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round((progressStats.geometryLearned / progressStats.geometryTotal) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playModalPopSound();
                setProgressModalOpen(true);
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              ⚙️ Thiết lập Tiến độ chi tiết
            </button>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT WINDOW */}
        <main className="flex-1 min-w-0">
          {currentTab === 'trang-chu' && (
            <TrangChu
              username={username}
              setUsername={setUsername}
              userClass={userClass}
              setUserClass={setUserClass}
              switchTab={setCurrentTab}
              stats={stats}
              triggerWeaknessReview={handleTriggerWeaknessReview}
              triggerAdaptiveQuiz={handleTriggerAdaptiveQuiz}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentTab === 'tao-de' && (
            <TaoDe
              syllabusData={syllabusData}
              learnedLessons={learnedLessons}
              openProgressModal={() => {
                playModalPopSound();
                setProgressModalOpen(true);
              }}
              onPreview={handlePreviewQuiz}
              onCreateQuiz={handleCreateQuizNow}
            />
          )}

          {currentTab === 'kho-cau-hoi' && (
            <KhoCauHoi
              syllabusData={syllabusData}
              questions={questions}
              onAddClick={handleOpenAddQuestion}
              onEditClick={handleOpenEditQuestion}
              onDeleteClick={handleDeleteQuestion}
              onSimulateAIGenerate={handleSimulateAIGenerate}
              onStartCustomQuiz={handleStartCustomQuiz}
              onSaveQuizPreset={handleSaveQuizPreset}
              onImportQuestions={(newQs) => {
                setQuestions((prev) => [...newQs, ...prev]);
              }}
            />
          )}

          {currentTab === 'kho-de' && (
            <div id="panel-kho-de" className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Danh Sách Đề Kiểm Tra</h2>
                  <p className="text-xs text-slate-500">Toàn bộ đề thi do bạn tự thiết kế hoặc thầy cô giao.</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">Đã sinh và đóng gói</span>
              </div>

              {/* pack grid card list of packs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((q) => (
                  <div key={q.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded border border-indigo-100 uppercase font-mono">
                          {q.mode.toUpperCase()}
                        </span>
                        <span className="text-slate-400 font-bold text-[10px] font-mono">{q.date}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-805 line-clamp-1">{q.title}</h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        Chương: {syllabusData[q.syllabus]?.title || q.syllabus}
                      </p>
                      <div className="flex gap-4 text-[11px] text-slate-400 font-extrabold pt-1">
                        <span>⏱️ {q.timer} phút</span>
                        <span>📋 {q.questions.length} câu hỏi Equation</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2 justify-end">
                      <button
                        onClick={() => handleStartPresetQuiz(q.id)}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm"
                      >
                        Làm bài ngay &rarr;
                      </button>
                      <button
                        onClick={() => handleExportDocument('quiz-structure', q.id)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs border border-slate-200 transition"
                      >
                        In đề / Xuất File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'giao-bai' && (
            <div id="panel-giao-bai" className="space-y-6 animate-fade">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">🎓</span>
                  Dành Cho Giáo Viên: Giao Bài Kiểm Tra Mới
                </h3>
                <p className="text-xs text-slate-505 mb-4">
                  Chọn một đề thi đã thiết kế sẵn trong kho đề, chỉ định lớp học tiếp nhận, thời hạn nộp bài.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-500 mb-1">Chọn lớp giao bài</label>
                    <select
                      value={assignClass}
                      onChange={(e) => setAssignClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold outline-none"
                    >
                      <option value="8A1">Lớp 8A1 (Nhóm nâng cao)</option>
                      <option value="8A2">Lớp 8A2 (Cơ bản - Đại trà)</option>
                      <option value="8A3">Lớp 8A3 (Nhóm bồi dưỡng chậm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Chọn đề thi tương ứng</label>
                    <select
                      value={assignQuizId}
                      onChange={(e) => setAssignQuizId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold outline-none"
                    >
                      {quizzes.map((qz) => (
                        <option key={qz.id} value={qz.id}>
                          {qz.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Hạn nộp bài</label>
                    <input
                      type="date"
                      value={assignDeadline}
                      onChange={(e) => setAssignDeadline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCreateNewAssignment}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-2.5 px-4 rounded-lg transition duration-150 cursor-pointer text-xs"
                    >
                      Giao Bài Cho Lớp &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* list tasks table */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                  <Layers className="w-4 h-4" /> Nhiệm vụ học tập lớp học đang mở
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100">
                        <th className="p-3">Mã Giao</th>
                        <th className="p-3">Lớp Nhận</th>
                        <th className="p-3">Tên đề bài thi</th>
                        <th className="p-3">Hạn Chót nộp</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3">Thống kê nộp bài</th>
                        <th className="p-3 text-right">Làm Ngay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {assignments.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition border-b border-slate-100">
                          <td className="p-3 font-bold text-slate-400 font-mono">{item.id}</td>
                          <td className="p-3 font-bold text-slate-900">{item.className}</td>
                          <td className="p-3 text-slate-800 font-bold">{item.quizTitle}</td>
                          <td className="p-3 text-slate-500 font-mono">{item.deadline}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded font-extrabold text-[9px] uppercase border tracking-wider ${
                                item.status === 'Đang mở'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{item.submitted} / {item.total} học sinh nộp</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleStartPresetQuiz(item.quizId)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                              disabled={item.status !== 'Đang mở'}
                            >
                              Làm bài
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'lam-bai' && activeQuiz && (
            <LamBai
              quizTitle={activeQuiz.title}
              mode={activeQuiz.mode}
              username={username}
              userClass={userClass}
              questions={activeQuiz.questions}
              currentQuestionIndex={activeQuiz.currentQuestionIndex}
              setCurrentQuestionIndex={(idx) =>
                setActiveQuiz((prev) => (prev ? { ...prev, currentQuestionIndex: idx } : null))
              }
              userAnswers={activeQuiz.userAnswers}
              onSelectAnswer={handleSelectAnswer}
              onSelectTFAnswer={handleSelectTFAnswer}
              onShortAnswerInput={handleShortInputAnswer}
              timerSeconds={activeQuiz.timerSeconds}
              onSaveTemporarily={() => showToast('Đã lưu nháp tiến độ thành câu!')}
              onSubmitQuiz={handleSubmitQuizManual}
            />
          )}

          {currentTab === 'cham-diem' && activeQuiz && (
            <ChamDiem
              quizTitle={activeQuiz.title}
              username={username}
              questions={activeQuiz.questions}
              userAnswers={activeQuiz.userAnswers}
              onTriggerAdaptiveRecovery={handleGenerateAdaptiveRecovery}
            />
          )}

          {currentTab === 'bao-cao' && (
            <BaoCao
              classReports={classReports}
              onExport={handleExportDocument}
              onSyncGoogleSheets={handleSyncGoogleSheets}
              onIssueRemedial={handleIssueRemedial}
            />
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1.5">
          <p className="font-bold">
            &copy; {new Date().getFullYear()} TRẮC NGHIỆM NHANH TOÁN 8 - BY HOÀNG QUANG. Được phát triển bởi các chuyên gia toán THCS Kết nối Tri Thức & Canvas AI.
          </p>
          <p className="text-slate-400">Trình hỗ trợ hiển thị LaTeX KaTeX cực kỳ sắc nét trên nhiều thiết bị di động.</p>
        </div>
      </footer>

      {/* MODAL POPUPS */}
      {/* 1. Chapter checklist learned lessons Modal */}
      {progressModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity animate-fade">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-100 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">⚙️</span>
                <h3 className="text-base sm:text-lg font-black text-slate-800">Bảng Thiết Lập Tiến Độ Học Tập</h3>
              </div>
              <button onClick={() => setProgressModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg outline-none cursor-pointer">✕</button>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Hãy đánh dấu những bài học thực tế bạn đã học trên lớp. Đề trắc nghiệm sinh ra bằng AI hoặc lọc kho đề sẽ chỉ giới hạn trong phạm vi các tích chọn dưới đây để đảm bảo an toàn lý thuyết.
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => {
                  setLearnedLessons((prev) => {
                    const copy = { ...prev };
                    Object.keys(copy).forEach((l) => {
                      copy[l] = false;
                    });
                    // Set chapter 1-5
                    Object.keys(syllabusData).forEach((ck) => {
                      if (['chuong-1', 'chuong-2', 'chuong-3', 'chuong-4', 'chuong-5'].includes(ck)) {
                        syllabusData[ck].lessons.forEach((l) => {
                          copy[l] = true;
                        });
                      }
                    });
                    return copy;
                  });
                  showToast('Đã nạp thiết lập Học kỳ 1!');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
              >
                Hết Học kỳ 1 (Chương I - V)
              </button>
              <button
                onClick={() => {
                  setLearnedLessons((prev) => {
                    const copy = { ...prev };
                    Object.keys(copy).forEach((l) => {
                      copy[l] = true;
                    });
                    return copy;
                  });
                  showToast('Đã tích tất cả chương học chương trình');
                }}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
              >
                Đã học hết chương trình (Chương I - X)
              </button>
              <button
                onClick={() => {
                  setLearnedLessons((prev) => {
                    const copy = { ...prev };
                    Object.keys(copy).forEach((l) => {
                      copy[l] = false;
                    });
                    return copy;
                  });
                  showToast('Đã xóa sạch tiến độ học');
                }}
                className="bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
              >
                Xóa toàn bộ
              </button>
            </div>

            {/* Checklist lists container */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[45vh] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-xs border-b border-slate-200">
                  <tr className="text-slate-400 font-bold">
                    <th className="p-3 w-16 text-center">Đã Học</th>
                    <th className="p-3">Bài học học tập (Sách Kết Nối Tri Thức)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {Object.keys(syllabusData).map((chuongKey) => {
                    const chuong = syllabusData[chuongKey];
                    const isAllChecked = chuong.lessons.every((l) => learnedLessons[l]);

                    return (
                      <React.Fragment key={chuongKey}>
                        <tr className="bg-slate-100/70 font-extrabold text-brand-900 border-t border-slate-200">
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isAllChecked}
                              onChange={(e) => toggleChapterCheckboxValue(chuongKey, e.target.checked)}
                              className="rounded text-brand-605 focus:ring-brand-500 h-4 w-4 shrink-0 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-extrabold uppercase text-[10px] sm:text-xs tracking-wider">
                            {chuong.title}
                          </td>
                        </tr>
                        {chuong.lessons.map((lesson) => (
                          <tr key={lesson} className="hover:bg-slate-50/50 transition">
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={!!learnedLessons[lesson]}
                                onChange={(e) => {
                                  playClickSound();
                                  const val = e.target.checked;
                                  setLearnedLessons((prev) => ({ ...prev, [lesson]: val }));
                                }}
                                className="rounded text-brand-600 focus:ring-brand-600 h-4 w-4 cursor-pointer"
                              />
                            </td>
                            <td className="p-3 font-semibold text-slate-600 pl-4">{lesson}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleSaveProgressChecklist}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md cursor-pointer"
              >
                Áp dụng & Lưu tiến độ học thực tế
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. System Alert Notification dialog */}
      {alertModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity animate-fade">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-yellow-50 text-yellow-600 rounded-full h-9 w-9 flex items-center justify-center font-bold">⚠️</span>
              <h3 className="text-base font-black text-slate-805">{alertModal.title}</h3>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: alertModal.message }}></p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAlertModal({ open: false, title: '', message: '' })}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition cursor-pointer"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity animate-fade">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-full h-9 w-9 flex items-center justify-center font-black">?</span>
              <h3 className="text-base font-black text-slate-800">{confirmModal.title}</h3>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: confirmModal.message }}></p>
            <div className="flex justify-end gap-2.5 pt-2 text-xs font-bold">
              <button
                onClick={() => setConfirmModal({ open: false, title: '', message: '', onConfirm: () => {} })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ open: false, title: '', message: '', onConfirm: () => {} });
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Export of Document structure overlay */}
      {exportModal.open && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full my-8 shadow-2xl relative">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setExportModal({ open: false, type: 'word-report', title: '', contentHtml: '' })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer border border-slate-200"
              >
                ✕ Đóng Preview
              </button>
            </div>
            
            <h3 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-4">Print / Export Document Preview</h3>

            <div
              className="p-6 border border-slate-200 rounded-2xl bg-white max-h-[65vh] overflow-y-auto shadow-inner"
              dangerouslySetInnerHTML={{ __html: exportModal.contentHtml }}
            ></div>

            <div className="mt-6 flex justify-end gap-3 font-semibold text-xs">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Tải File / In Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add / edit question form Modal */}
      {questionModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full my-4 shadow-2xl border border-slate-101 space-y-4 max-h-[90vh] overflow-y-auto text-xs sm:text-sm">
            <h3 className="text-lg font-black text-slate-800">
              {questionModal.mode === 'add' ? 'Thêm câu hỏi mới' : `Chỉnh sửa câu hỏi: ${questionModal.activeQuestion?.id}`}
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Mạch kiến thức / Chương học</label>
                <select
                  value={qFormSyllabus}
                  onChange={(e) => setQFormSyllabus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
                >
                  {Object.keys(syllabusData).map((key) => (
                    <option key={key} value={key}>
                      {syllabusData[key].title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Chủ đề / Bài học liên quan</label>
                <input
                  type="text"
                  value={qFormTopic}
                  onChange={(e) => setQFormTopic(e.target.value)}
                  placeholder="Ví dụ: Bài 6: Hiệu hai bình phương"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Cấp độ nhận thức</label>
                  <select
                    value={qFormLevel}
                    onChange={(e) => setQFormLevel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Kiểu câu hỏi</label>
                  <select
                    value={qFormType}
                    onChange={(e) => setQFormType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="MCQ">Trắc nghiệm 4 lựa chọn</option>
                    <option value="TF">Đúng / Sai</option>
                    <option value="SHORT">Trả lời điền từ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Nội dung câu hỏi (sử dụng $...$ cho LaTeX)</label>
                <textarea
                  rows={3}
                  value={qFormContent}
                  onChange={(e) => setQFormContent(e.target.value)}
                  placeholder="Ví dụ: Thu gọn biểu thức sau $A = x(x-y) + y(x+y)$ ?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              {/* MCQ Extra Options inputs */}
              {qFormType === 'MCQ' && (
                <div className="space-y-2.5">
                  <label className="block text-slate-400 font-bold">Cung cấp 4 phương án trả lời:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {qFormMCQOptions.map((opt, oi) => (
                      <input
                        key={oi}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQFormMCQOptions((prev) => {
                            const clone = [...prev];
                            clone[oi] = val;
                            return clone;
                          });
                        }}
                        placeholder={`Phương án ${String.fromCharCode(65 + oi)}`}
                        className="bg-slate-50 border border-slate-200 rounded p-1.5 font-bold focus:bg-white text-xs"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">Đáp án ĐÚNG:</span>
                    <select
                      value={qFormMCQCorrect}
                      onChange={(e) => setQFormMCQCorrect(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 font-bold outline-none"
                    >
                      <option value="A">Phương án A</option>
                      <option value="B">Phương án B</option>
                      <option value="C">Phương án C</option>
                      <option value="D">Phương án D</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TF statement inputs */}
              {qFormType === 'TF' && (
                <div className="space-y-2">
                  <label className="block text-slate-400 font-bold">Cung cấp 4 nhận định Đúng/Sai:</label>
                  <div className="space-y-2">
                    {qFormTFStatements.map((stm, si) => (
                      <input
                        key={si}
                        type="text"
                        value={stm}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQFormTFStatements((prev) => {
                            const clone = [...prev];
                            clone[si] = val;
                            return clone;
                          });
                        }}
                        placeholder={`Nhận định phụ ${String.fromCharCode(97 + si)})`}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-bold focus:bg-white text-xs"
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Đáp án kết quả tuần tự (VD: Đúng,Sai,Đúng,Đúng)</label>
                    <input
                      type="text"
                      value={qFormTFCorrect}
                      onChange={(e) => setQFormTFCorrect(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              {/* SHORT answer text input */}
              {qFormType === 'SHORT' && (
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Đáp án biểu thức chuẩn tự luận:</label>
                  <input
                    type="text"
                    value={qFormShortCorrect}
                    onChange={(e) => setQFormShortCorrect(e.target.value)}
                    placeholder="Ví dụ: 6x^2y hoặc 4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-bold mb-1">Lời giải chi tiết từng bước</label>
                <textarea
                  rows={2}
                  value={qFormSolution}
                  onChange={(e) => setQFormSolution(e.target.value)}
                  placeholder="Áp dụng quy tắc cộng phân thức cùng mẫu số ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 font-bold text-xs sm:text-sm">
              <button
                onClick={() => setQuestionModal({ open: false, mode: 'add' })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveQuestionForm}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl transition cursor-pointer"
              >
                Lưu Câu Hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
