/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, UserCheck, BookOpen, Plus, Search, Trash2, Edit2, Check, CheckSquare, XCircle, 
  DollarSign, Terminal, ShieldAlert, BookOpenCheck, School, CreditCard 
} from 'lucide-react';
import { Student, Teacher, Course, Department, Attendance, Mark, Fee, AuditLog } from '../types';

interface ManagementPanelsProps {
  activeTab: string;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  departments: Department[];
  attendance: Attendance[];
  marks: Mark[];
  fees: Fee[];
  auditLogs: AuditLog[];
  onAddStudent: (data: any) => void;
  onDeleteStudent: (id: string) => void;
  onAddTeacher: (data: any) => void;
  onDeleteTeacher: (id: string) => void;
  onAddCourse: (data: any) => void;
  onMarkAttendance: (records: any[]) => void;
  onAddMark: (data: any) => void;
  onSettleFee: (id: string, method: string) => void;
}

export default function ManagementPanels({
  activeTab, students, teachers, courses, departments, attendance, marks, fees, auditLogs,
  onAddStudent, onDeleteStudent, onAddTeacher, onDeleteTeacher, onAddCourse, onMarkAttendance, onAddMark, onSettleFee
}: ManagementPanelsProps) {
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // 1. STUDENTS CONTROLS
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '', email: '', phone: '', dob: '2004-01-01', gender: 'MALE', departmentId: 'dept-cs', currentSemester: '4', guardianName: '', guardianPhone: ''
  });

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.email) return;
    onAddStudent({ ...newStudent, admissionDate: new Date().toISOString().split('T')[0] });
    setNewStudent({ fullName: '', email: '', phone: '', dob: '2004-01-01', gender: 'MALE', departmentId: 'dept-cs', currentSemester: '4', guardianName: '', guardianPhone: '' });
    setShowAddStudentForm(false);
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. TEACHERS CONTROLS
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    fullName: '', email: '', phone: '', departmentId: 'dept-cs', designation: 'Assistant Professor'
  });

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.fullName || !newTeacher.email) return;
    onAddTeacher({ ...newTeacher, joiningDate: new Date().toISOString().split('T')[0] });
    setNewTeacher({ fullName: '', email: '', phone: '', departmentId: 'dept-cs', designation: 'Assistant Professor' });
    setShowAddTeacherForm(false);
  };

  const filteredTeachers = teachers.filter(t => 
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. COURSES CONTROLS
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '', code: '', departmentId: 'dept-cs', teacherId: '', credits: '3', semester: '4'
  });

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code) return;
    onAddCourse(newCourse);
    setNewCourse({ name: '', code: '', departmentId: 'dept-cs', teacherId: '', credits: '3', semester: '4' });
    setShowAddCourseForm(false);
  };

  // 4. ATTENDANCE WORKFLOW CONTROLS
  const [attCourseId, setAttCourseId] = useState(courses[0]?.id || 'crs-dsa');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStates, setAttendanceStates] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' }>({});

  const handleToggleAttendance = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceStates(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const records = students.map(s => ({
      studentId: s.id,
      courseId: attCourseId,
      date: attDate,
      status: attendanceStates[s.id] || 'PRESENT',
      remarks: 'Recorded in dashboard'
    }));
    onMarkAttendance(records);
  };

  // 5. MARKS GRADER CONTROLS
  const [gradeStudentId, setGradeStudentId] = useState(students[0]?.id || 'std-01');
  const [gradeCourseId, setGradeCourseId] = useState(courses[0]?.id || 'crs-dsa');
  const [gradeExamType, setGradeExamType] = useState<'MID_TERM' | 'FINAL_EXAM' | 'ASSIGNMENT'>('MID_TERM');
  const [gradeScore, setGradeScore] = useState('42');
  const [gradeMax, setGradeMax] = useState('50');

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compute grade letter
    const pct = Number(gradeScore) / Number(gradeMax);
    let grade = 'F';
    if (pct >= 0.9) grade = 'O';
    else if (pct >= 0.8) grade = 'A';
    else if (pct >= 0.7) grade = 'B';
    else if (pct >= 0.6) grade = 'C';
    else if (pct >= 0.5) grade = 'D';

    onAddMark({
      studentId: gradeStudentId,
      courseId: gradeCourseId,
      examType: gradeExamType,
      marksObtained: Number(gradeScore),
      maxMarks: Number(gradeMax),
      grade
    });
  };

  // 6. FEES CONTROLS
  const [settleFeeId, setSettleFeeId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState('ONLINE');

  return (
    <div className="space-y-6">
      {/* Search and Filters banner for listings */}
      {(activeTab === 'STUDENTS' || activeTab === 'TEACHERS') && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search in ${activeTab.toLowerCase()} files...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-sm pl-9 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          
          {activeTab === 'STUDENTS' && (
            <button
              onClick={() => setShowAddStudentForm(!showAddStudentForm)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Register New Student
            </button>
          )}
          {activeTab === 'TEACHERS' && (
            <button
              onClick={() => setShowAddTeacherForm(!showAddTeacherForm)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Register New Teacher
            </button>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 1: STUDENTS MODULE
          ========================================== */}
      {activeTab === 'STUDENTS' && (
        <>
          {showAddStudentForm && (
            <form onSubmit={handleStudentSubmit} className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2 mb-3">Register Student Enrollment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text" required value={newStudent.fullName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. Karthikeyan"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email" required value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. karthikeyan@student.edu"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text" value={newStudent.phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. +91 94430 11223"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Department Stream</label>
                  <select
                    value={newStudent.departmentId}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, departmentId: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500 bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Current Term Semester</label>
                  <input
                    type="number" min="1" max="8" value={newStudent.currentSemester}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, currentSemester: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Guardian Name</label>
                  <input
                    type="text" value={newStudent.guardianName}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, guardianName: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. Selvam"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Guardian Phone</label>
                  <input
                    type="text" value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, guardianPhone: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. +91 94430 11224"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2 text-xs">
                <button
                  type="button" onClick={() => setShowAddStudentForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded"
                >
                  Submit Registry
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  <th className="py-3.5 px-4">Roll ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Stream Department</th>
                  <th className="py-3.5 px-4">Semester</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500 text-xs">{student.rollNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{student.fullName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.email}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{student.departmentName || "Computer Science"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                        S-{student.currentSemester}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded transition-all inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ==========================================
          TAB 2: TEACHERS MODULE
          ========================================== */}
      {activeTab === 'TEACHERS' && (
        <>
          {showAddTeacherForm && (
            <form onSubmit={handleTeacherSubmit} className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2 mb-3">Register Faculty Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text" required value={newTeacher.fullName}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. Dr. Senthil Kumar"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email" required value={newTeacher.email}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. senthil@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text" value={newTeacher.phone}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
                    placeholder="E.g. +91 94411 12233"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Department Stream</label>
                  <select
                    value={newTeacher.departmentId}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, departmentId: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500 bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Designation Title</label>
                  <select
                    value={newTeacher.designation}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2 text-xs">
                <button
                  type="button" onClick={() => setShowAddTeacherForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded"
                >
                  Submit Registry
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Faculty Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500 text-xs">{teacher.employeeId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{teacher.fullName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{teacher.email}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{teacher.departmentName || "Computer Science"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                        {teacher.designation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteTeacher(teacher.id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded transition-all inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ==========================================
          TAB 3: COURSES MODULE
          ========================================== */}
      {activeTab === 'COURSES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800">Academic Course Modules</h3>
              <button
                onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>

            {showAddCourseForm && (
              <form onSubmit={handleCourseSubmit} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-md space-y-3">
                <h4 className="font-semibold text-xs text-slate-700 uppercase">Construct Course Syllabus</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Course Name</label>
                    <input
                      type="text" required value={newCourse.name}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-slate-200 rounded outline-none"
                      placeholder="Introduction to Python"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Course Code</label>
                    <input
                      type="text" required value={newCourse.code}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full p-2 border border-slate-200 rounded outline-none"
                      placeholder="CSE-101"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Department Stream</label>
                    <select
                      value={newCourse.departmentId}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, departmentId: e.target.value }))}
                      className="w-full p-2 border border-slate-200 rounded outline-none bg-white"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Instructor Faculty</label>
                    <select
                      value={newCourse.teacherId}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, teacherId: e.target.value }))}
                      className="w-full p-2 border border-slate-200 rounded outline-none bg-white"
                    >
                      <option value="">Unassigned</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Credits Count</label>
                    <input
                      type="number" min="1" max="5" value={newCourse.credits}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, credits: e.target.value }))}
                      className="w-full p-2 border border-slate-200 rounded outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Semester Term</label>
                    <input
                      type="number" min="1" max="8" value={newCourse.semester}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, semester: e.target.value }))}
                      className="w-full p-2 border border-slate-200 rounded outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-1 text-xs">
                  <button
                    type="button" onClick={() => setShowAddCourseForm(false)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded"
                  >
                    Submit Course
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Course Name</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">Instructor</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500 text-xs">{course.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{course.name}</td>
                    <td className="py-3 px-4">{course.credits} Credits</td>
                    <td className="py-3 px-4">Semester {course.semester}</td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-500">
                      {course.teacherName || "Unassigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="text-center pb-2 border-b border-slate-200">
            <School className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800">Faculty Distribution</h4>
            <p className="text-slate-500 text-xs mt-1">Course modules allocated per department stream.</p>
          </div>
          <div className="space-y-2.5 text-xs">
            {departments.map(dept => {
              const count = courses.filter(c => c.departmentId === dept.id).length;
              return (
                <div key={dept.id} className="flex justify-between items-center bg-white p-3 rounded border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">{dept.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{dept.code} Stream</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                    {count} Courses
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* ==========================================
          TAB 4: ATTENDANCE TRACKER
          ========================================== */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Attendance Register Sheets</h3>
              <p className="text-slate-500 text-xs mt-1">Select course and lecture date to submit daily presence records.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs">
              <select
                value={attCourseId}
                onChange={(e) => setAttCourseId(e.target.value)}
                className="p-2 border border-slate-200 rounded bg-white outline-none focus:border-indigo-500"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
              <input
                type="date"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
                className="p-2 border border-slate-200 rounded outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Presence Check</th>
                <th className="py-3 px-4 text-right">Instant Feedback</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(s => {
              const currentStatus = attendanceStates[s.id] || 'PRESENT';
              return (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500 text-xs">{s.rollNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.fullName}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleToggleAttendance(s.id, 'PRESENT')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                          currentStatus === 'PRESENT'
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleToggleAttendance(s.id, 'ABSENT')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                          currentStatus === 'ABSENT'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleToggleAttendance(s.id, 'LATE')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                          currentStatus === 'LATE'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-slate-500 font-medium">
                    {currentStatus === 'PRESENT' && "In attendance"}
                    {currentStatus === 'ABSENT' && "Flagged absent"}
                    {currentStatus === 'LATE' && "Tardy logged"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSaveAttendance}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" /> Save Attendance Log
          </button>
        </div>
      </div>
      )}

      {/* ==========================================
          TAB 5: MARKS GRADER
          ========================================== */}
      {activeTab === 'MARKS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Grading Panel</h3>
              <p className="text-slate-500 text-xs mt-1">Input test scores to auto-compute course grades.</p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Select Student</label>
                <select
                  value={gradeStudentId}
                  onChange={(e) => setGradeStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded outline-none bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Select Course</label>
                <select
                  value={gradeCourseId}
                  onChange={(e) => setGradeCourseId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded outline-none bg-white"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Exam Class Type</label>
                <select
                  value={gradeExamType}
                  onChange={(e) => setGradeExamType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded outline-none bg-white"
                >
                  <option value="MID_TERM">Mid Term Exam</option>
                  <option value="FINAL_EXAM">End Semester Exam</option>
                  <option value="ASSIGNMENT">Continuous Evaluation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Marks Obtained</label>
                  <input
                    type="number" required value={gradeScore}
                    onChange={(e) => setGradeScore(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Max Marks</label>
                  <input
                    type="number" required value={gradeMax}
                    onChange={(e) => setGradeMax(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded shadow-sm"
              >
                Submit Scorecard
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800">Grade Transcripts Board</h3>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course Code</th>
                    <th className="py-3 px-4">Exam Type</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-right">Grade</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {marks.map(mark => (
                  <tr key={mark.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{mark.studentName || "Karthikeyan"}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-500 text-xs">{courses.find(c => c.id === mark.courseId)?.code || "CSE-201"}</td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-500">{mark.examType}</td>
                    <td className="py-3 px-4 text-center font-bold">{mark.marksObtained} / {mark.maxMarks}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                        {mark.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* ==========================================
          TAB 6: FEES MODULE
          ========================================== */}
      {activeTab === 'FEES' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Tuition Finance Ledgers</h3>
            <p className="text-slate-500 text-xs mt-1">Audit billing files and settle outstanding course registration balances.</p>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt Ref</th>
                <th className="py-3.5 px-4">Student name</th>
                <th className="py-3.5 px-4">Bill Title</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {fees.map(fee => (
              <tr key={fee.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                  {fee.receiptNumber || <span className="italic text-slate-300">Unsettled</span>}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">{fee.studentName || "Karthikeyan"}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{fee.title}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">₹{fee.amount.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-4 text-slate-500 text-xs">{fee.dueDate}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${
                    fee.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {fee.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {fee.status === 'UNPAID' ? (
                    <button
                      onClick={() => setSettleFeeId(fee.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded uppercase shadow-sm transition-all inline-flex items-center gap-1"
                    >
                      <CreditCard className="w-3 h-3" /> Pay Invoice
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Paid: {fee.paymentMethod}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment Confirmation Modal */}
        {settleFeeId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-100">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Settle Outstanding Invoice</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Confirm payment settlement for this tuition ledger file. Select transaction processing route.
              </p>

              <div className="space-y-3 mb-6 text-xs">
                <label className="block text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button" onClick={() => setPayMethod('ONLINE')}
                    className={`p-2.5 rounded border text-center font-bold ${
                      payMethod === 'ONLINE' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    Online Debit/Card
                  </button>
                  <button
                    type="button" onClick={() => setPayMethod('CASH')}
                    className={`p-2.5 rounded border text-center font-bold ${
                      payMethod === 'CASH' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    Cash / Bank Memo
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end text-xs">
                <button
                  onClick={() => setSettleFeeId(null)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onSettleFee(settleFeeId, payMethod);
                    setSettleFeeId(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded"
                >
                  Confirm Settlement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* ==========================================
          TAB 7: AUDIT LOGS
          ========================================== */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Terminal className="w-5 h-5 text-indigo-600" />
                System Audit Trail Logs
              </h3>
              <p className="text-slate-500 text-xs mt-1">Security logs and state mutation entries tracked by Spring Security filters.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-600 font-bold">
              SYS_LOGS: ON
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50 flex items-start gap-3.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500">
                    <span>Operator: <strong className="text-slate-700">{log.username}</strong> ({log.role})</span>
                    <span>Node IP: <strong className="text-slate-700">{log.ipAddress}</strong></span>
                    <span className="font-mono uppercase bg-slate-100 px-1.5 py-0.2 rounded text-slate-500 border border-slate-200">
                      {log.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
