/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  title: string;
  lessons: string[];
}

export type QuestionType = 'MCQ' | 'TF' | 'SHORT';
export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface Question {
  id: string;
  syllabus: string;
  topic: string;
  level: CognitiveLevel;
  type: QuestionType;
  content: string;
  options?: string[]; // For MCQ choices
  subQuestions?: string[]; // For TF statements
  correct: string | string[]; // string for MCQ/SHORT, string[] for TF e.g., ["Đúng", "Sai", "Đúng", "Đúng"]
  solution: string;
  source: 'Giáo viên' | 'AI tạo';
  status: 'Đã duyệt' | 'Chờ duyệt';
  uses: number;
  correctRate: number;
}

export interface PresetQuiz {
  id: string;
  title: string;
  class: string;
  syllabus: string;
  topic: string;
  mode: string;
  questionCount: number;
  timer: number;
  type: string;
  level: string;
  questions: string[]; // Question IDs
  date: string;
  status: string;
}

export interface Assignment {
  id: string;
  className: string;
  quizTitle: string;
  deadline: string;
  status: 'Đang mở' | 'Đã hết hạn';
  total: number;
  submitted: number;
  quizId: string;
}

export interface StudentReport {
  name: string;
  avg: number;
  weak: string;
  tests: number;
}

export interface ClassReport {
  students: number;
  avgScore: number;
  passRate: number;
  worstSyllabus: string;
  struggling: StudentReport[];
}

export interface AppState {
  currentTab: string;
  username: string;
  userClass: string;
  learnedLessons: Record<string, boolean>;
  stats: {
    totalTests: number;
    highestScore: number;
    avgScore: number;
    weakTopic: string;
    correctAnswers: number;
    incorrectAnswers: number;
  };
  activeQuiz: {
    quizId: string | null;
    title: string;
    questions: Question[];
    userAnswers: Record<number, any>; // index -> selected option or array for TF or text for SHORT
    timerSeconds: number;
    currentQuestionIndex: number;
    mode: string;
  } | null;
  classReports: Record<string, ClassReport>;
}
