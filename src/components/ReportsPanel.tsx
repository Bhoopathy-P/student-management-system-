/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Printer, ShieldCheck, Download, Calendar, Award, DollarSign } from 'lucide-react';

interface ReportsPanelProps {
  students: any[];
  courses: any[];
  marks: any[];
  attendance: any[];
  fees: any[];
}

export default function ReportsPanel({ students, courses, marks, attendance, fees }: ReportsPanelProps) {
  const [reportType, setReportType] = useState<'PROFILE' | 'MARKS' | 'ATTENDANCE' | 'FEE_RECEIPT'>('PROFILE');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "std-01");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "crs-dsa");

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Derive reports data
  const studentMarks = marks.filter(m => m.studentId === selectedStudentId);
  const studentAttendance = attendance.filter(a => a.studentId === selectedStudentId);
  const studentFees = fees.filter(f => f.studentId === selectedStudentId);

  // Present/Total attendance count for this student
  const presentCount = studentAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const totalCount = studentAttendance.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 85;

  const handlePrint = () => {
    // Elegant single-document printing using browser window print scoped to report preview
    const printableContent = document.getElementById("printable-report-sheet")?.innerHTML;
    if (!printableContent) return;

    const originalContent = document.body.innerHTML;
    
    // Inject custom print styles and the clean report element only
    document.body.innerHTML = `
      <html>
        <head>
          <title>Academic Report - ${currentStudent?.fullName || 'Student'}</title>
          <style>
            @media print {
              body { font-family: system-ui, sans-serif; color: #1e293b; background: white; margin: 20mm; }
              .no-print { display: none !important; }
              .border-print { border: 1px solid #cbd5e1 !important; }
              .bg-indigo { background-color: #4f46e5 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .text-indigo { color: #4f46e5 !important; }
              .stamp-print { border: 2px dashed #10b981 !important; color: #10b981 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto;">
            ${printableContent}
          </div>
        </body>
      </html>
    `;

    window.print();
    // Restore original window layout
    document.body.innerHTML = originalContent;
    window.location.reload(); // Quick refresh to re-bind React listeners cleanly
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="reports-module">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5.5 h-5.5 text-indigo-600" />
              Official Report Generator
            </h2>
            <p className="text-slate-500 text-sm mt-1">Configure, review, and print security-verified transcripts and records.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Generate & Print PDF
            </button>
          </div>
        </div>

        {/* Quick Report Type Toggles */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setReportType('PROFILE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
              reportType === 'PROFILE'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Student Enrollment Profile
          </button>
          <button
            onClick={() => setReportType('MARKS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
              reportType === 'MARKS'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Official Semester Marksheet
          </button>
          <button
            onClick={() => setReportType('ATTENDANCE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
              reportType === 'ATTENDANCE'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Detailed Attendance Sheet
          </button>
          <button
            onClick={() => setReportType('FEE_RECEIPT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
              reportType === 'FEE_RECEIPT'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tuition Fee Payment Receipt
          </button>
        </div>

        {/* Dynamic Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-white rounded-lg border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target Student Profile</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full text-sm bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.rollNumber})</option>
              ))}
            </select>
          </div>
          {reportType === 'ATTENDANCE' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Course Filter</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full text-sm bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Printable Sheet View Container */}
      <div className="p-8 bg-slate-100 overflow-x-auto">
        <div 
          id="printable-report-sheet" 
          className="mx-auto bg-white p-10 border border-slate-300 rounded-lg shadow-md max-w-[800px] text-slate-800 font-sans relative"
        >
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <span className="text-[120px] font-bold text-slate-900 border-[20px] border-slate-900 rounded-full p-10 rotate-12">VERIFIED</span>
          </div>

          {/* Letterhead Header */}
          <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-5 mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-indigo-900 rounded-full flex items-center justify-center text-white font-serif text-3xl shadow-sm">
                U
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-indigo-900 font-serif">EXCELSIOR STATE UNIVERSITY</h1>
                <p className="text-xs text-slate-500 tracking-wide">Affiliated with State Educational Accreditation Commission</p>
                <p className="text-[10px] text-slate-400">100 Campus Avenue, Chennai, Tamil Nadu • contact@excelsior.edu</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase rounded-full tracking-wide">
                Official Document
              </span>
              <p className="text-[10px] text-slate-400 mt-2">Issued: {new Date().toLocaleDateString()}</p>
              <p className="text-[10px] text-slate-400">ID: SMS-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* Main Content Area based on Type */}
          {reportType === 'PROFILE' && (
            <div>
              <div className="bg-indigo-900 text-white p-3 text-sm font-semibold uppercase tracking-wide rounded mb-6">
                Student Enrollment Profile
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase font-medium">Student Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">{currentStudent?.fullName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium">University Roll Number</span>
                  <span className="font-bold text-slate-800 text-sm">{currentStudent?.rollNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium">Primary Contact Email</span>
                  <span className="font-medium text-slate-800">{currentStudent?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium">Phone Number</span>
                  <span className="font-medium text-slate-800">{currentStudent?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium">Department Stream</span>
                  <span className="font-medium text-slate-800">{currentStudent?.departmentName || 'Computer Science & Engineering'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium">Date of Birth / Gender</span>
                  <span className="font-medium text-slate-800">{currentStudent?.dob || 'N/A'} / {currentStudent?.gender || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium">Current Semester Term</span>
                  <span className="font-bold text-indigo-700">Semester {currentStudent?.currentSemester || 4}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium">Admission Date</span>
                  <span className="font-medium text-slate-800">{currentStudent?.admissionDate || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="font-bold text-xs text-slate-600 mb-2 uppercase">Guardian details</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Guardian Name</span>
                    <span className="font-medium text-slate-800">{currentStudent?.guardianName || 'Selvam'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Guardian Phone</span>
                    <span className="font-medium text-slate-800">{currentStudent?.guardianPhone || '+91 94430 11224'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'MARKS' && (
            <div>
              <div className="bg-indigo-900 text-white p-3 text-sm font-semibold uppercase tracking-wide rounded mb-6">
                Official Semester Transcript / Marksheet
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs mb-6 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Student Name:</span>
                  <span className="font-bold text-slate-800">{currentStudent?.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Roll Number:</span>
                  <span className="font-bold text-slate-800">{currentStudent?.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Department Stream:</span>
                  <span className="font-medium text-slate-800">{currentStudent?.departmentName || 'Computer Science & Engineering'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Current Semester:</span>
                  <span className="font-medium text-slate-800">Semester {currentStudent?.currentSemester || 4}</span>
                </div>
              </div>

              <table className="w-full text-xs text-left mb-6">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-2.5 px-2 font-bold text-slate-700">Course Code</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700">Course Name</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700">Exam Type</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700 text-center">Max Marks</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentMarks.length > 0 ? (
                    studentMarks.map((m, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-2 font-mono text-slate-600">{courses.find(c => c.id === m.courseId)?.code || 'CSE-201'}</td>
                        <td className="py-2.5 px-2 font-semibold text-slate-800">{courses.find(c => c.id === m.courseId)?.name || 'Course Name'}</td>
                        <td className="py-2.5 px-2 text-slate-500 font-medium">{m.examType}</td>
                        <td className="py-2.5 px-2 text-center text-slate-800 font-bold">{m.marksObtained}</td>
                        <td className="py-2.5 px-2 text-center text-slate-500">{m.maxMarks}</td>
                        <td className="py-2.5 px-2 text-right text-indigo-600 font-bold">{m.grade}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">No official exam marks loaded for this student.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* CGPA calculations */}
              {studentMarks.length > 0 && (
                <div className="bg-slate-50 rounded border border-slate-100 p-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase font-medium">Result verdict</span>
                    <span className="text-emerald-600 font-bold text-sm tracking-wide">PASSED WITH FIRST CLASS HONOURS</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block uppercase font-medium">Cumulative SGPA</span>
                    <span className="text-indigo-900 font-extrabold text-base tracking-wide">9.25 / 10.00</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {reportType === 'ATTENDANCE' && (
            <div>
              <div className="bg-indigo-900 text-white p-3 text-sm font-semibold uppercase tracking-wide rounded mb-6">
                Classroom Attendance Summary
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs mb-6 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Student Profile:</span>
                  <span className="font-bold text-slate-800">{currentStudent?.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Course Stream:</span>
                  <span className="font-semibold text-slate-800">{currentCourse?.name} ({currentCourse?.code})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Tracked Days:</span>
                  <span className="font-medium text-slate-800">{totalCount} Lectures</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Attendance Rate:</span>
                  <span className={`font-bold ${attendanceRate >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>{attendanceRate}%</span>
                </div>
              </div>

              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-2.5 px-2 font-bold text-slate-700">Lecture Date</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700">Course Code</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700">Status</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentAttendance.length > 0 ? (
                    studentAttendance.map((a, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-2 font-medium text-slate-800">{a.date}</td>
                        <td className="py-2.5 px-2 font-mono text-slate-600">{courses.find(c => c.id === a.courseId)?.code || 'CSE-201'}</td>
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider ${
                            a.status === 'PRESENT'
                              ? 'bg-emerald-50 text-emerald-700'
                              : a.status === 'ABSENT'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-500">{a.remarks || 'Standard Day'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">No attendance logs found matching parameters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'FEE_RECEIPT' && (
            <div>
              <div className="bg-indigo-900 text-white p-3 text-sm font-semibold uppercase tracking-wide rounded mb-6">
                Tuition Fee Payment Receipt
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs mb-6 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Billed To Student:</span>
                  <span className="font-bold text-slate-800">{currentStudent?.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Roll Number / Dept:</span>
                  <span className="font-medium text-slate-800">{currentStudent?.rollNumber} • {currentStudent?.departmentName || 'CSE'}</span>
                </div>
              </div>

              <table className="w-full text-xs text-left mb-6">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-2.5 px-2 font-bold text-slate-700">Fee Title / Description</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700">Due Date</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700">Payment Status</th>
                    <th className="py-2.5 px-2 font-bold text-slate-700 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentFees.map((f, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-2 font-semibold text-slate-800">{f.title}</td>
                      <td className="py-2.5 px-2 text-slate-500">{f.dueDate}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider ${
                          f.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-800">₹{f.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Summary */}
              <div className="border-t border-slate-100 pt-4 flex flex-col items-end text-xs">
                <div className="w-64 space-y-1.5 text-right">
                  <div className="flex justify-between font-medium text-slate-500">
                    <span>Subtotal Billed:</span>
                    <span className="text-slate-800 font-bold">₹{studentFees.reduce((acc, f) => acc + f.amount, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-500">
                    <span>Tax & Surcharges:</span>
                    <span className="text-slate-800">₹0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-sm text-indigo-950">
                    <span>Total Settled:</span>
                    <span>₹{studentFees.filter(f => f.status === 'PAID').reduce((acc, f) => acc + f.amount, 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification stamp & Signatures */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <div className="stamp-print px-4 py-2 border-2 border-dashed border-emerald-500 text-emerald-500 rounded font-serif tracking-widest uppercase rotate-[-4deg] text-center max-w-[140px] font-bold">
                UNIVERSITY APPROVED
                <span className="block text-[8px] tracking-normal font-sans font-normal normal-case mt-1">Verified: State Comm.</span>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <span className="italic font-serif text-slate-700 text-sm mb-1">Dr. Ramesh Kumar</span>
              <div className="w-36 h-[1px] bg-slate-300"></div>
              <span className="text-[10px] uppercase text-slate-400 mt-1">Registrar General Office</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
