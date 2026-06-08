/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, Question, PresetQuiz, Assignment, ClassReport } from './types';

export const syllabusData: Record<string, Chapter> = {
  'chuong-1': {
    title: 'Chương I: Đa thức',
    lessons: [
      'Bài 1: Đơn thức',
      'Bài 2: Đa thức',
      'Bài 3: Phép cộng và phép trừ đa thức',
      'Bài 4: Phép nhân đa thức',
      'Bài 5: Phép chia đa thức cho đơn thức'
    ]
  },
  'chuong-2': {
    title: 'Chương II: Hằng đẳng thức đáng nhớ và ứng dụng',
    lessons: [
      'Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu',
      'Bài 7: Lập phương của một tổng. Lập phương của một hiệu',
      'Bài 8: Tổng và hiệu hai lập phương',
      'Bài 9: Phân tích đa thức thành nhân tử'
    ]
  },
  'chuong-3': {
    title: 'Chương III: Tứ giác',
    lessons: [
      'Bài 10: Tứ giác',
      'Bài 11: Hình thang cân',
      'Bài 12: Hình bình hành',
      'Bài 13: Hình chữ nhật',
      'Bài 14: Hình thoi và hình vuông'
    ]
  },
  'chuong-4': {
    title: 'Chương IV: Định lí Thalès trong tam giác',
    lessons: [
      'Bài 15: Định lí Thalès trong tam giác',
      'Bài 16: Đường trung bình của tam giác',
      'Bài 17: Tính chất đường phân giác của tam giác'
    ]
  },
  'chuong-5': {
    title: 'Chương V: Dữ liệu và biểu đồ',
    lessons: [
      'Bài 18: Thu thập và phân loại dữ liệu',
      'Bài 19: Biểu diễn dữ liệu bằng bảng, biểu đồ',
      'Bài 20: Phân tích số liệu thống kê dựa vào biểu đồ'
    ]
  },
  'chuong-6': {
    title: 'Chương VI: Phân thức đại số',
    lessons: [
      'Bài 21: Phân thức đại số',
      'Bài 22: Tính chất cơ bản của phân thức đại số',
      'Bài 23: Phép cộng và phép trừ phân thức đại số',
      'Bài 24: Phép nhân và phép chia phân thức đại số'
    ]
  },
  'chuong-7': {
    title: 'Chương VII: Phương trình bậc nhất và hàm số bậc nhất',
    lessons: [
      'Bài 25: Phương trình bậc nhất một ẩn',
      'Bài 26: Giải bài toán bằng cách lập phương trình',
      'Bài 27: Khái niệm hàm số và đồ thị',
      'Bài 28: Hàm số bậc nhất và đồ thị của hàm số bậc nhất',
      'Bài 29: Hệ số góc của đường thẳng'
    ]
  },
  'chuong-8': {
    title: 'Chương VIII: Mở đầu về tính xác suất của biến cố',
    lessons: [
      'Bài 30: Kết quả có thể và kết quả thuận lợi',
      'Bài 31: Cách tính xác suất của biến cố bằng tỉ số',
      'Bài 32: Mối liên hệ giữa xác suất thực nghiệm với xác suất lý thuyết'
    ]
  },
  'chuong-9': {
    title: 'Chương IX: Tam giác đồng dạng',
    lessons: [
      'Bài 33: Hai tam giác đồng dạng',
      'Bài 34: Ba trường hợp đồng dạng của hai tam giác',
      'Bài 35: Định lí Pythagore và ứng dụng',
      'Bài 36: Các trường hợp đồng dạng của hai tam giác vuông',
      'Bài 37: Hình đồng dạng'
    ]
  },
  'chuong-10': {
    title: 'Chương X: Một số hình khối trong thực tiễn',
    lessons: [
      'Bài 38: Hình chóp tam giác đều',
      'Bài 39: Hình chóp tứ giác đều',
      'Bài 40: Thể tích và diện tích xung quanh của một số hình khối trong thực tiễn'
    ]
  }
};

export const defaultQuestionBank: Question[] = [
  {
    id: 'CH001',
    syllabus: 'chuong-1',
    topic: 'Bài 1: Đơn thức',
    level: 'Nhận biết',
    type: 'MCQ',
    content: 'Biểu thức nào sau đây là một đơn thức?',
    options: ['$2x + 3$', '$5xy^2$', '$x - y$', '$\\frac{1}{x} + 2$'],
    correct: 'B',
    solution: 'Đơn thức là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến. $5xy^2$ là một tích của số $5$ và các biến $x, y^2$ nên là đơn thức.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 12,
    correctRate: 85
  },
  {
    id: 'CH002',
    syllabus: 'chuong-2',
    topic: 'Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu',
    level: 'Nhận biết',
    type: 'TF',
    content: 'Xét tính Đúng/Sai của các khẳng định về hằng đẳng thức sau đây:',
    subQuestions: [
      'a) $(x + y)^2 = x^2 + 2xy + y^2$',
      'b) $(x - y)^2 = x^2 - y^2$',
      'c) $(x + y)(x - y) = x^2 - y^2$',
      'd) $(x - y)^2 = (y - x)^2$'
    ],
    correct: ['Đúng', 'Sai', 'Đúng', 'Đúng'],
    solution: 'a) Đúng theo định lý hằng đẳng thức dáng nhớ.<br>b) Sai vì $(x-y)^2 = x^2 - 2xy + y^2$.<br>c) Đúng theo hằng đẳng thức hiệu hai bình phương.<br>d) Đúng vì $(x-y)^2 = (-(y-x))^2 = (y-x)^2$.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 18,
    correctRate: 72
  },
  {
    id: 'CH003',
    syllabus: 'chuong-1',
    topic: 'Bài 3: Phép cộng và phép trừ đa thức',
    level: 'Thông hiểu',
    type: 'SHORT',
    content: 'Thu gọn đa thức sau đây: $A = 3x^2y - x^2y + 4x^2y$',
    correct: '6x^2y',
    solution: 'Thực hiện cộng trừ các đơn thức đồng dạng: $A = (3 - 1 + 4)x^2y = 6x^2y$.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 25,
    correctRate: 64
  },
  {
    id: 'CH004',
    syllabus: 'chuong-3',
    topic: 'Bài 14: Hình thoi và hình vuông',
    level: 'Nhận biết',
    type: 'MCQ',
    content: 'Hình chữ nhật có thêm tính chất nào sau đây thì trở thành hình vuông?',
    options: [
      'Hai cạnh đối song song',
      'Hai đường chéo bằng nhau',
      'Hai đường chéo vuông góc với nhau',
      'Có một góc vuông'
    ],
    correct: 'C',
    solution: 'Dấu hiệu nhận biết hình vuông quy định: Hình chữ nhật có hai đường chéo vuông góc với nhau là hình vuông.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 14,
    correctRate: 78
  },
  {
    id: 'CH005',
    syllabus: 'chuong-4',
    topic: 'Bài 15: Định lí Thalès trong tam giác',
    level: 'Thông hiểu',
    type: 'MCQ',
    content: 'Cho $\\Delta ABC$ có $DE \\parallel BC$ ($D \\in AB, E \\in AC$). Biết $AD = 3\\text{ cm}$, $DB = 2\\text{ cm}$, $AE = 4{,}5\\text{ cm}$. Tính độ dài đoạn thẳng $EC$.',
    options: ['$3\\text{ cm}$', '$2{,}5\\text{ cm}$', '$4\\text{ cm}$', '$1{,}5\\text{ cm}$'],
    correct: 'A',
    solution: 'Áp dụng định lí Thalès trong tam giác $ABC$ có đường thẳng $DE \\parallel BC$:<br>$\\frac{AD}{DB} = \\frac{AE}{EC} \\Rightarrow \\frac{3}{2} = \\frac{4{,}5}{EC} \\Rightarrow EC = \\frac{2 \\cdot 4{,}5}{3} = 3\\text{ cm}$.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 30,
    correctRate: 60
  },
  {
    id: 'CH006',
    syllabus: 'chuong-6',
    topic: 'Bài 21: Phân thức đại số',
    level: 'Thông hiểu',
    type: 'MCQ',
    content: 'Điều kiện xác định của phân thức đại số $\\frac{x - 2}{x^2 - 9}$ là:',
    options: ['$x \\neq 2$', '$x \\neq 3$', '$x \\neq 3$ và $x \\neq -3$', '$x \\neq 9$'],
    correct: 'C',
    solution: 'Phân thức xác định khi mẫu thức khác $0$. Ta có: $x^2 - 9 \\neq 0 \\Leftrightarrow (x-3)(x+3) \\neq 0 \\Leftrightarrow x \\neq 3$ và $x \\neq -3$.',
    source: 'AI tạo',
    status: 'Đã duyệt',
    uses: 8,
    correctRate: 80
  },
  {
    id: 'CH007',
    syllabus: 'chuong-7',
    topic: 'Bài 25: Phương trình bậc nhất một ẩn',
    level: 'Nhận biết',
    type: 'SHORT',
    content: 'Tìm nghiệm $x$ của phương trình: $3x - 12 = 0$',
    correct: '4',
    solution: 'Giải phương trình bậc nhất: $3x - 12 = 0 \\Leftrightarrow 3x = 12 \\Leftrightarrow x = \\frac{12}{3} = 4$.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 15,
    correctRate: 90
  },
  {
    id: 'CH008',
    syllabus: 'chuong-7',
    topic: 'Bài 28: Hàm số bậc nhất và đồ thị của hàm số bậc nhất',
    level: 'Vận dụng',
    type: 'MCQ',
    content: 'Cho đường thẳng $y = (m - 1)x + 3$. Tìm tất cả các giá trị của $m$ để đường thẳng đi qua điểm $A(1; 5)$.',
    options: ['$m = 2$', '$m = 3$', '$m = 1$', '$m = -1$'],
    correct: 'B',
    solution: 'Thay tọa độ điểm $A(1; 5)$ vào phương trình đường thẳng:<br>$5 = (m - 1) \\cdot 1 + 3 \\Leftrightarrow 5 = m - 1 + 3 \\Leftrightarrow m + 2 = 5 \\Leftrightarrow m = 3$.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 10,
    correctRate: 55
  },
  {
    id: 'CH009',
    syllabus: 'chuong-2',
    topic: 'Bài 9: Phân tích đa thức thành nhân tử',
    level: 'Thông hiểu',
    type: 'MCQ',
    content: 'Phân tích đa thức $x^2 - 4xy + 4y^2$ thành nhân tử được kết quả là:',
    options: ['$(x - 4y)^2$', '$(x - 2y)^2$', '$(x + 2y)^2$', '$(x - 2y)(x + 2y)$'],
    correct: 'B',
    solution: 'Áp dụng hằng đẳng thức bình phương của một hiệu:<br>$x^2 - 4xy + 4y^2 = x^2 - 2 \\cdot x \\cdot (2y) + (2y)^2 = (x - 2y)^2$.',
    source: 'AI tạo',
    status: 'Đã duyệt',
    uses: 21,
    correctRate: 70
  },
  {
    id: 'CH010',
    syllabus: 'chuong-10',
    topic: 'Bài 40: Thể tích và diện tích xung quanh của một số hình khối trong thực tiễn',
    level: 'Vận dụng',
    type: 'MCQ',
    content: 'Một hình chóp tứ giác đều có diện tích đáy bằng $30\\text{ cm}^2$, chiều cao bằng $6\\text{ cm}$. Thể tích của hình chóp đó là:',
    options: ['$180\\text{ cm}^3$', '$90\\text{ cm}^3$', '$60\\text{ cm}^3$', '$120\\text{ cm}^3$'],
    correct: 'C',
    solution: 'Áp dụng công thức thể tích hình chóp: $V = \\frac{1}{3} \\cdot S_{\\text{đáy}} \\cdot h = \\frac{1}{3} \\cdot 30 \\cdot 6 = 60\\text{ cm}^3$.',
    source: 'Giáo viên',
    status: 'Đã duyệt',
    uses: 5,
    correctRate: 68
  }
];

export const defaultAssignments: Assignment[] = [
  { id: 'GB001', className: '8A2', quizTitle: 'Kiểm tra đầu giờ Đa Thức', deadline: '2026-06-10', status: 'Đang mở', total: 12, submitted: 8, quizId: 'Q-PRESET-1' },
  { id: 'GB002', className: '8A1', quizTitle: 'Bồi dưỡng học sinh giỏi: Định lí Thalès nâng cao', deadline: '2026-06-12', status: 'Đang mở', total: 10, submitted: 3, quizId: 'Q-PRESET-2' },
  { id: 'GB003', className: '8A3', quizTitle: 'Cộng trừ phân thức cơ bản', deadline: '2026-06-05', status: 'Đã hết hạn', total: 8, submitted: 8, quizId: 'Q-PRESET-3' }
];

export const defaultPresetQuizzes: PresetQuiz[] = [
  {
    id: 'Q-PRESET-1',
    title: 'Kiểm tra đầu giờ: Đơn thức & Đa thức',
    class: '8A2',
    syllabus: 'chuong-1',
    topic: 'Tất cả bài',
    mode: 'dau-gio',
    questionCount: 5,
    timer: 5,
    type: 'mixed',
    level: 'mixed',
    questions: ['CH001', 'CH003', 'CH002', 'CH004', 'CH005'],
    date: '2026-06-01',
    status: 'Sẵn sàng làm'
  },
  {
    id: 'Q-PRESET-2',
    title: 'Ôn tập Chương II: Hằng đẳng thức & Phân tích nhân tử',
    class: '8A2',
    syllabus: 'chuong-2',
    topic: 'Tất cả bài',
    mode: 'on-tap-chuong',
    questionCount: 4,
    timer: 10,
    type: 'mixed',
    level: 'medium',
    questions: ['CH002', 'CH009', 'CH003', 'CH001'],
    date: '2026-06-02',
    status: 'Sẵn sàng làm'
  }
];

export const mockStudentsReport = [
  { name: 'Nguyễn Văn An', avg: 7.7, weak: 'Hằng Đẳng Thức', tests: 3 },
  { name: 'Trần Thị Mỹ', avg: 4.2, weak: 'Phương trình bậc nhất', tests: 2 },
  { name: 'Lê Hoàng Hải', avg: 4.8, weak: 'Phân thức đại số', tests: 4 },
  { name: 'Phạm Minh Đức', avg: 9.5, weak: 'Không có', tests: 5 }
];

export const defaultClassReports: Record<string, ClassReport> = {
  '8A1': {
    students: 10,
    avgScore: 8.4,
    passRate: 95,
    worstSyllabus: 'Chương II: Hằng đẳng thức',
    struggling: [
      { name: 'Phùng Hữu Kiên', avg: 5.8, weak: 'Đường phân giác', tests: 2 }
    ]
  },
  '8A2': {
    students: 12,
    avgScore: 7.2,
    passRate: 85,
    worstSyllabus: 'Chương IV: Định lí Thalès',
    struggling: [
      { name: 'Trần Thị Mỹ', avg: 4.2, weak: 'Phương trình bậc nhất', tests: 2 },
      { name: 'Lê Hoàng Hải', avg: 4.8, weak: 'Phân thức đại số', tests: 4 }
    ]
  },
  '8A3': {
    students: 8,
    avgScore: 5.1,
    passRate: 50,
    worstSyllabus: 'Chương VI: Phân thức đại số',
    struggling: [
      { name: 'Nguyễn Thành Nam', avg: 3.5, weak: 'Cộng trừ đa thức', tests: 2 },
      { name: 'Trần Mỹ Ngọc', avg: 5.2, weak: 'Tỉ số đoạn thẳng', tests: 1 }
    ]
  }
};

export const navMenu = [
  { id: 'trang-chu', title: 'Trang Chủ', icon: '🏠' },
  { id: 'tao-de', title: 'Tạo Đề Trắc Nghiệm', icon: '⚡' },
  { id: 'kho-cau-hoi', title: 'Kho Câu Hỏi', icon: '📚' },
  { id: 'kho-de', title: 'Kho Đề Kiểm Tra', icon: '📋' },
  { id: 'giao-bai', title: 'Giao Bài Lớp Học', icon: '🎓' },
  { id: 'lam-bai', title: 'Làm Bài Ngay', icon: '📝', hidden: true },
  { id: 'cham-diem', title: 'Chấm Điểm & Lời Giải', icon: '🏆', hidden: true },
  { id: 'bao-cao', title: 'Báo Cáo Lớp Học', icon: '📊' }
];

// High fidelity mock AI question generator template
export function generateRandomMathQuestion(syllabusId: string, idCounter: number, targetLesson?: string): Question {
  const chapterLessons = syllabusData[syllabusId]?.lessons || ['Tổng hợp kiến thức'];
  const randomLesson = targetLesson && chapterLessons.includes(targetLesson)
    ? targetLesson
    : chapterLessons[Math.floor(Math.random() * chapterLessons.length)];

  // We can customize equations based on chapters
  if (syllabusId === 'chuong-3') {
    if (randomLesson === 'Bài 10: Tứ giác') {
      const optionIndex = Math.floor(Math.random() * 2);
      if (optionIndex === 0) {
        return {
          id: `CH_AI_${idCounter}`,
          syllabus: syllabusId,
          topic: randomLesson,
          level: 'Nhận biết',
          type: 'MCQ',
          content: 'Tổng số đo các góc của một tứ giác lồi luôn luôn bằng:',
          options: ['$360^\\circ$', '$180^\\circ$', '$540^\\circ$', '$90^\\circ$'],
          correct: 'A',
          solution: 'Theo định lí về tổng các góc của một tứ giác: Tổng các góc của một tứ giác bằng $360^\\circ$.',
          source: 'AI tạo',
          status: 'Đã duyệt',
          uses: 0,
          correctRate: 100
        };
      } else {
        const aVal = 60 + Math.floor(Math.random() * 3) * 10; // 60, 70, 80
        const bVal = 100 + Math.floor(Math.random() * 3) * 10; // 100, 110, 120
        const cVal = 80 + Math.floor(Math.random() * 2) * 5; // 80, 85
        const dVal = 360 - (aVal + bVal + cVal);
        return {
          id: `CH_AI_${idCounter}`,
          syllabus: syllabusId,
          topic: randomLesson,
          level: 'Thông hiểu',
          type: 'MCQ',
          content: `Cho tứ giác $ABCD$ có các góc $\\hat{A} = ${aVal}^\\circ, \\hat{B} = ${bVal}^\\circ, \\hat{C} = ${cVal}^\\circ$. Số đo của góc $\\hat{D}$ là:`,
          options: [`$${dVal}^\\circ$`, `$${dVal + 10}^\\circ$`, `$${dVal - 10}^\\circ$`, `$90^\\circ$`],
          correct: 'A',
          solution: `Trong tứ giác $ABCD$, ta có: $\\hat{A} + \\hat{B} + \\hat{C} + \\hat{D} = 360^\\circ$.<br>Suy ra: $\\hat{D} = 360^\\circ - (\\hat{A} + \\hat{B} + \\hat{C}) = 360^\\circ - (${aVal}^\\circ + ${bVal}^\\circ + ${cVal}^\\circ) = ${dVal}^\\circ$.`,
          source: 'AI tạo',
          status: 'Đã duyệt',
          uses: 0,
          correctRate: 100
        };
      }
    } else if (randomLesson === 'Bài 11: Hình thang cân') {
      const cAngle = 60 + Math.floor(Math.random() * 4) * 5; // 60, 65, 70, 75
      const aAngle = 180 - cAngle;
      return {
        id: `CH_AI_${idCounter}`,
        syllabus: syllabusId,
        topic: randomLesson,
        level: 'Thông hiểu',
        type: 'MCQ',
        content: `Cho hình thang cân $ABCD$ ($AB \\parallel CD$) có số đo góc $\\hat{C} = ${cAngle}^\\circ$. Tính số đo của góc $\\hat{A}$.`,
        options: [`$${aAngle}^\\circ$`, `$${cAngle}^\\circ$`, `$90^\\circ$`, `$120^\\circ$`],
        correct: 'A',
        solution: `Do $ABCD$ là hình thang ($AB \\parallel CD$) nên góc $\\hat{A}$ và góc $\\hat{D}$ là hai góc trong cùng phía, suy ra $\\hat{A} + \\hat{D} = 180^\\circ$.<br>Mặt khác, hình thang $ABCD$ cân nên $\\hat{C} = \\hat{D} = ${cAngle}^\\circ$.<br>Do đó: $\\hat{A} = 180^\\circ - ${cAngle}^\\circ = ${aAngle}^\\circ$.`,
        source: 'AI tạo',
        status: 'Đã duyệt',
        uses: 0,
        correctRate: 100
      };
    } else if (randomLesson === 'Bài 12: Hình bình hành') {
      return {
        id: `CH_AI_${idCounter}`,
        syllabus: syllabusId,
        topic: randomLesson,
        level: 'Thông hiểu',
        type: 'MCQ',
        content: 'Khẳng định nào sau đây là SAI khi nói về tính chất của hình bình hành?',
        options: [
          'Hình bình hành có hai đường chéo bằng nhau.',
          'Các cạnh đối của hình bình hành song song và bằng nhau.',
          'Các góc đối của hình bình hành bằng nhau.',
          'Hai đường chéo của hình bình hành cắt nhau tại trung điểm của mỗi đường.'
        ],
        correct: 'A',
        solution: 'Hình bình hành chỉ có hai đường chéo cắt nhau tại trung điểm của mỗi đường, chứ không nhất thiết bằng nhau (chỉ hình chữ nhật và hình vuông mới có hai đường chéo bằng nhau).',
        source: 'AI tạo',
        status: 'Đã duyệt',
        uses: 0,
        correctRate: 100
      };
    } else if (randomLesson === 'Bài 13: Hình chữ nhật') {
      const a = 6;
      const b = 8;
      const diag = 10;
      return {
        id: `CH_AI_${idCounter}`,
        syllabus: syllabusId,
        topic: randomLesson,
        level: 'Thông hiểu',
        type: 'MCQ',
        content: `Một hình chữ nhật $ABCD$ có chiều dài các cạnh kích thước lần lượt là $AB = ${a}\\text{ cm}$ và $BC = ${b}\\text{ cm}$. Độ dài đường chéo $AC$ của hình chữ nhật này là:`,
        options: [`$${diag}\\text{ cm}$`, `$14\\text{ cm}$`, `$12\\text{ cm}$`, `$7\\text{ cm}$`],
        correct: 'A',
        solution: `Áp dụng định lý Pythagore trong tam giác vuông $ABC$ (vuông tại $B$):<br>$AC^2 = AB^2 + BC^2 = ${a}^2 + ${b}^2 = 36 + 64 = 100$.<br>Do đó $AC = \\sqrt{100} = ${diag}\\text{ cm}$.`,
        source: 'AI tạo',
        status: 'Đã duyệt',
        uses: 0,
        correctRate: 100
      };
    } else { // Bài 14: Hình thoi và hình vuông
      return {
        id: `CH_AI_${idCounter}`,
        syllabus: syllabusId,
        topic: randomLesson,
        level: 'Nhận biết',
        type: 'MCQ',
        content: 'Tứ giác nào có bốn cạnh bằng nhau và bốn góc vuông?',
        options: ['Hình vuông', 'Hình thoi', 'Hình chữ nhật', 'Hình bình hành'],
        correct: 'A',
        solution: 'Theo định nghĩa, hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau.',
        source: 'AI tạo',
        status: 'Đã duyệt',
        uses: 0,
        correctRate: 100
      };
    }
  }

  if (syllabusId === 'chuong-1') {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 5) + 1;
    const xPow = Math.floor(Math.random() * 3) + 1;
    const yPow = Math.floor(Math.random() * 3) + 1;
    
    return {
      id: `CH_AI_${idCounter}`,
      syllabus: syllabusId,
      topic: randomLesson,
      level: 'Thông hiểu',
      type: 'MCQ',
      content: `Kết quả rút gọn biểu thức $A = ${a}x^{${xPow}}y \\cdot (${b}x^{${yPow}}y^2)$ là:`,
      options: [
        `$${a * b}x^{${xPow + yPow}}y^3$`,
        `$${a + b}x^{${xPow + yPow}}y^2$`,
        `$${a * b}x^{${Math.max(1, xPow - 1)}}y^{1}$`,
        `$${a * b}x^{${xPow * yPow}}y^3$`
      ],
      correct: 'A',
      solution: `Áp dụng quy tắc nhân đơn thức với đơn thức:<br>Ta nhân hệ số với hệ số: $${a} \\cdot ${b} = ${a * b}$.<br>Nhân luỹ thừa cùng cơ số: $x^{${xPow}} \\cdot x^{${yPow}} = x^{${xPow + yPow}}$ và $y \\cdot y^2 = y^3$.<br>Do đó kết quả là $${a * b}x^{${xPow + yPow}}y^3$.`,
      source: 'AI tạo',
      status: 'Đã duyệt',
      uses: 0,
      correctRate: 100
    };
  } else if (syllabusId === 'chuong-2') {
    const num = Math.floor(Math.random() * 10) + 101; // e.g. 105
    const squareOffset = num - 100; // e.g. 5
    const square = squareOffset * squareOffset; // 25
    
    return {
      id: `CH_AI_${idCounter}`,
      syllabus: syllabusId,
      topic: randomLesson,
      level: 'Thông hiểu',
      type: 'MCQ',
      content: `Sử dụng hằng đẳng thức hiệu hai bình phương, hãy tính nhanh giá trị của biểu thức: $${num}^2 - ${square}$`,
      options: [
        `$${(num - squareOffset) * (num + squareOffset)}$`,
        `$10\\,000$`,
        `$${num * num}$`,
        `$12\\,500$`
      ],
      correct: 'A',
      solution: `Viết lại biểu thức: $${num}^2 - ${square} = ${num}^2 - ${squareOffset}^2$.<br>Áp dụng hằng đẳng thức hiệu hai bình phương $(a-b)(a+b)$:<br>$(${num} - ${squareOffset})(${num} + ${squareOffset}) = 100 \\cdot ${num + squareOffset} = ${(num - squareOffset) * (num + squareOffset)}$.`,
      source: 'AI tạo',
      status: 'Đã duyệt',
      uses: 0,
      correctRate: 100
    };
  } else if (syllabusId === 'chuong-7') {
    const root = Math.floor(Math.random() * 6) + 2; // e.g., 4
    const coeff = Math.floor(Math.random() * 4) + 2; // e.g., 3
    const constant = root * coeff; // e.g., 12

    return {
      id: `CH_AI_${idCounter}`,
      syllabus: syllabusId,
      topic: randomLesson === 'Tổng hợp kiến thức' ? 'Bài 25: Phương trình bậc nhất một ẩn' : randomLesson,
      level: 'Nhận biết',
      type: 'SHORT',
      content: `Tìm nghiệm $x$ của phương trình bậc nhất một ẩn sau: $${coeff}x - ${constant} = 0$`,
      correct: `${root}`,
      solution: `Chuyển vế đổi dấu và giải tìm $x$:<br>$${coeff}x = ${constant} \\Rightarrow x = \\frac{${constant}}{${coeff}} = ${root}$.<br>Vậy tập nghiệm là $S = \\{${root}\\}$.`,
      source: 'AI tạo',
      status: 'Đã duyệt',
      uses: 0,
      correctRate: 100
    };
  } else {
    // General fallback
    return {
      id: `CH_AI_${idCounter}`,
      syllabus: syllabusId,
      topic: randomLesson,
      level: 'Thông hiểu',
      type: 'MCQ',
      content: `Cho đại lượng $x, y$ tỉ lệ với đa thức thu gọn thuộc chủ đề $[${randomLesson}]$. Hệ số phát biểu nào dưới đây là hằng số đúng?`,
      options: ['Hệ số $a = 1$', 'Hệ số $a = 0$', 'Hệ số tỉ lệ $k = 4$', 'Không xác định'],
      correct: 'A',
      solution: `Dựa vào lý thuyết về ${randomLesson} và hệ số của đa thức, ta thu được phương án A là chính xác nhất trong điều kiện tiêu chuẩn.`,
      source: 'AI tạo',
      status: 'Đã duyệt',
      uses: 0,
      correctRate: 100
    };
  }
}
