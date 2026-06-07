/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BarChart3, FileSpreadsheet, FileText, Sparkles, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { ClassReport, StudentReport } from '../types';

interface CalReportProps {
  classReports: Record<string, ClassReport>;
  onExport: (type: 'word-report' | 'pdf-report') => void;
  onSyncGoogleSheets: () => void;
  onIssueRemedial: (studentName: string) => void;
}

export default function BaoCao({
  classReports,
  onExport,
  onSyncGoogleSheets,
  onIssueRemedial,
}: CalReportProps) {
  const [reportClass, setReportClass] = useState('8A2');
  const reportData = classReports[reportClass];

  if (!reportData) return null;

  return (
    <div id="panel-bao-cao" className="space-y-6">
      {/* Selection Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Thống Kê Học Tập & Báo Cáo Lớp</h2>
          <p className="text-xs text-slate-500">Xem kết quả chi tiết của từng lớp, phân phối điểm thi và gợi ý giảng dạy cho thầy cô.</p>
        </div>
        <div>
          <select
            value={reportClass}
            onChange={(e) => setReportClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="8A1">Báo cáo lớp 8A1</option>
            <option value="8A2">Báo cáo lớp 8A2</option>
            <option value="8A3">Báo cáo lớp 8A3</option>
          </select>
        </div>
      </div>

      {/* Key stats cards for class */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400 block font-medium">Sĩ số học sinh</span>
          <strong className="text-2xl text-slate-800">{reportData.students} em làm bài</strong>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 animate-fade">
          <span className="text-xs text-slate-400 block font-medium font-sans">Điểm trung bình lớp</span>
          <strong className="text-2xl text-brand-600 font-mono" id="class-avg-score">{reportData.avgScore.toFixed(1)}</strong>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400 block font-medium">Tỉ lệ Đạt (&gt;=5.0)</span>
          <strong className="text-2xl text-emerald-600">{reportData.passRate}%</strong>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400 block font-medium">Chương kiến thức yếu</span>
          <strong className="text-sm font-bold text-rose-500 block mt-1.5 line-clamp-1">{reportData.worstSyllabus}</strong>
        </div>
      </div>

      {/* Classroom Analysis and remedial advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-brand-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" /> Gợi Ý Giảng Dạy & Ôn Tập
            </h4>
            <div className="text-xs leading-relaxed text-slate-600 space-y-2.5 mt-3">
              {reportData.avgScore >= 8.0 ? (
                <div className="bg-emerald-50 text-emerald-900 p-3.5 rounded-xl border border-emerald-100 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p>
                    <strong>Khuyến nghị từ AI:</strong> Lớp học đạt kết quả học tập xuất sắc. Giáo viên tiếp tục phát huy, ra thêm các câu hỏi vận dụng cao về phương trình bậc nhất một ẩn và tam giác đồng dạng.
                  </p>
                </div>
              ) : reportData.avgScore >= 6.0 ? (
                <div className="bg-indigo-50 text-indigo-950 p-3.5 rounded-xl border border-indigo-101 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <p>
                    <strong>Khuyến nghị từ AI:</strong> Lớp học có sự đồng đều khá lớn. Lỗi phổ biến nhất là nhầm lẫn dấu âm dương khi cộng trừ đa thức và hằng đẳng thức. Cần củng cố gấp bài &quot;Phép nhân và cộng trừ đa thức&quot; trước khi vào chuyên đề nâng cao.
                  </p>
                </div>
              ) : (
                <div className="bg-rose-50 text-rose-950 p-3.5 rounded-xl border border-rose-100 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <p>
                    <strong>Khuyến nghị từ AI:</strong> Tỉ lệ yếu kém chiếm tỷ số cao. Đề xuất mở lớp bổ trợ hình học, ôn tập kỹ lí thuyết và bài tập về góc của tứ giác trong chương 3 để khôi phục cơ sở kiến thức cơ bản.
                  </p>
                </div>
              )}
              <p className="text-[11px] text-slate-400">
                ⭐ Tính năng Adaptive AI tự động đề xuất bài thi ngắn ôn tập 5 câu hỏi lấy lại căn bản khi phát hiện kết quả dưới trung bình.
              </p>
            </div>
          </div>
        </div>

        {/* Struggling list */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-rose-600 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Danh Sách Học Sinh Cần Hỗ Trợ
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 pb-2">
                    <th className="pb-2">Họ Tên</th>
                    <th className="pb-2">Điểm TB</th>
                    <th className="pb-2">Chủ đề yếu nhất</th>
                    <th className="pb-2 text-right">Hỗ trợ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {reportData.struggling.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 font-medium">
                        Không có học sinh dưới trung bình. Lớp đạt trạng thái ổn định!
                      </td>
                    </tr>
                  ) : (
                    reportData.struggling.map((student, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-2.5">{student.name}</td>
                        <td className="py-2.5 text-rose-600 font-bold">{student.avg.toFixed(1)}</td>
                        <td className="py-2.5 text-slate-500 font-medium">{student.weak}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => onIssueRemedial(student.name)}
                            className="bg-brand-50 hover:bg-brand-100 text-brand-600 px-2 py-1 rounded font-bold text-[10px] transition cursor-pointer border border-brand-100"
                          >
                            Tự Tạo Đề Phụ
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Export functions */}
      <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-md">
        <h3 className="text-base font-bold mb-2 flex items-center gap-1.5">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> Xuất Dữ Liệu & Đồng Bộ Cơ Sở Dữ Liệu Lớp Học
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Toàn bộ dữ liệu của học sinh có thể xuất trực tiếp sang Microsoft Word, tệp PDF báo cáo gửi phụ huynh hoặc đồng bộ hóa trực tiếp lên Google Sheets cá nhân.
        </p>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onExport('word-report')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-300" /> Xuất Bảng Điểm (Word)
          </button>
          <button
            onClick={() => onExport('pdf-report')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5 text-rose-300" /> Xuất Báo Cáo PDF Lớp
          </button>
          <button
            onClick={onSyncGoogleSheets}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Đồng bộ Google Sheets
          </button>
        </div>
      </div>
    </div>
  );
}
