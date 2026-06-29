/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, BookOpen, CheckCircle, Award, DollarSign, FileText, 
  Terminal, LogOut, ChevronRight, Bell, ShieldCheck, School, Menu, X, 
  Download, LayoutDashboard, UserCheck 
} from 'lucide-react';

import DashboardCards from './components/DashboardCards';
import ManagementPanels from './components/ManagementPanels';
import ReportsPanel from './components/ReportsPanel';
import ZipExportPanel from './components/ZipExportPanel';
import { Student, Teacher, Course, Department, Attendance, Mark, Fee, AuditLog } from './types';

export default function App() {
  // Navigation & Role simulation
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');
  const [userRole, setUserRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('ADMIN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core database state from server
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  
  // UI States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Custom Toast helper
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch initial data from custom Express API
  const refreshDatabase = async () => {
    try {
      const [
        studentsRes, teachersRes, coursesRes, deptsRes, 
        attRes, marksRes, feesRes, logsRes, statsRes, notifRes
      ] = await Promise.all([
        fetch('/api/students').then(r => r.json()),
        fetch('/api/teachers').then(r => r.json()),
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/departments').then(r => r.json()),
        fetch('/api/attendance').then(r => r.json()),
        fetch('/api/marks').then(r => r.json()),
        fetch('/api/fees').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/dashboard/stats').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json())
      ]);

      setStudents(studentsRes);
      setTeachers(teachersRes);
      setCourses(coursesRes);
      setDepartments(deptsRes);
      setAttendance(attRes);
      setMarks(marksRes);
      setFees(feesRes);
      setAuditLogs(logsRes);
      setDashboardStats(statsRes);
      setNotifications(notifRes);
    } catch (err) {
      console.error("Failed to load local DB state", err);
    }
  };

  useEffect(() => {
    refreshDatabase();
  }, [userRole]);

  // Handle switching active user role
  const handleSwitchRole = async (role: 'ADMIN' | 'TEACHER' | 'STUDENT') => {
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        setUserRole(role);
        triggerToast(`Switched workspace perspective to ${role}`, 'info');
        setActiveTab('DASHBOARD');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // State mutations via REST API proxy triggers
  const handleAddStudent = async (data: any) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        triggerToast("Successfully registered student file!", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Failed to register student record", "error");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast("Removed student enrollment profile", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Error removing student record", "error");
    }
  };

  const handleAddTeacher = async (data: any) => {
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        triggerToast("Successfully onboarded faculty member", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Failed to onboard teacher", "error");
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast("Successfully cleared teacher profile", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Error clearing teacher profile", "error");
    }
  };

  const handleAddCourse = async (data: any) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        triggerToast("Course module created successfully", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Failed to create course", "error");
    }
  };

  const handleMarkAttendance = async (records: any[]) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records)
      });
      if (res.ok) {
        triggerToast("Classroom attendance logged securely", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Failed to register class attendance", "error");
    }
  };

  const handleAddMark = async (data: any) => {
    try {
      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        triggerToast("Student grade scorecard uploaded", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Failed to upload grade card", "error");
    }
  };

  const handleSettleFee = async (id: string, method: string) => {
    try {
      const res = await fetch(`/api/fees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID', paymentMethod: method })
      });
      if (res.ok) {
        triggerToast("Tuition invoice settled and receipt issued", "success");
        refreshDatabase();
      }
    } catch (err) {
      triggerToast("Settle payment transaction rejected", "error");
    }
  };

  // Nav items filtered by active role authorization
  const getNavItems = () => {
    const base = [
      { id: 'DASHBOARD', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> }
    ];

    if (userRole === 'ADMIN') {
      return [
        ...base,
        { id: 'STUDENTS', label: 'Manage Students', icon: <Users className="w-4.5 h-4.5" /> },
        { id: 'TEACHERS', label: 'Manage Teachers', icon: <GraduationCap className="w-4.5 h-4.5" /> },
        { id: 'COURSES', label: 'Syllabus & Courses', icon: <BookOpen className="w-4.5 h-4.5" /> },
        { id: 'ATTENDANCE', label: 'Attendance Sheets', icon: <UserCheck className="w-4.5 h-4.5" /> },
        { id: 'MARKS', label: 'Exam Grades Desk', icon: <Award className="w-4.5 h-4.5" /> },
        { id: 'FEES', label: 'Tuition Ledgers', icon: <DollarSign className="w-4.5 h-4.5" /> },
        { id: 'REPORTS', label: 'Report Generator', icon: <FileText className="w-4.5 h-4.5" /> },
        { id: 'AUDIT_LOGS', label: 'System Security Logs', icon: <Terminal className="w-4.5 h-4.5" /> },
        { id: 'EXPORT_CODE', label: 'Enterprise Exporter', icon: <Download className="w-4.5 h-4.5 text-indigo-500" /> }
      ];
    }

    if (userRole === 'TEACHER') {
      return [
        ...base,
        { id: 'COURSES', label: 'My Assigned Courses', icon: <BookOpen className="w-4.5 h-4.5" /> },
        { id: 'ATTENDANCE', label: 'Classroom Roll Call', icon: <UserCheck className="w-4.5 h-4.5" /> },
        { id: 'MARKS', label: 'Input Grades', icon: <Award className="w-4.5 h-4.5" /> },
        { id: 'REPORTS', label: 'Class Reports', icon: <FileText className="w-4.5 h-4.5" /> },
        { id: 'EXPORT_CODE', label: 'Get Java Boilerplate', icon: <Download className="w-4.5 h-4.5 text-indigo-500" /> }
      ];
    }

    // Student navigation
    return [
      ...base,
      { id: 'COURSES', label: 'My Syllabus Schedule', icon: <BookOpen className="w-4.5 h-4.5" /> },
      { id: 'ATTENDANCE', label: 'My Attendance Sheet', icon: <UserCheck className="w-4.5 h-4.5" /> },
      { id: 'MARKS', label: 'My Marksheet Transcript', icon: <Award className="w-4.5 h-4.5" /> },
      { id: 'FEES', label: 'My Outstanding Fees', icon: <DollarSign className="w-4.5 h-4.5" /> },
      { id: 'REPORTS', label: 'Print Transcripts', icon: <FileText className="w-4.5 h-4.5" /> },
      { id: 'EXPORT_CODE', label: 'Download Source ZIP', icon: <Download className="w-4.5 h-4.5 text-indigo-500" /> }
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Warning Banner / Switch Perspective Control */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2 text-xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Enterprise Preview Terminal Mode</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Simulate Role:</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => handleSwitchRole('ADMIN')}
              className={`px-2.5 py-1 rounded-md transition-all ${userRole === 'ADMIN' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              ADMIN
            </button>
            <button
              onClick={() => handleSwitchRole('TEACHER')}
              className={`px-2.5 py-1 rounded-md transition-all ${userRole === 'TEACHER' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              TEACHER
            </button>
            <button
              onClick={() => handleSwitchRole('STUDENT')}
              className={`px-2.5 py-1 rounded-md transition-all ${userRole === 'STUDENT' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              STUDENT
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className={`md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                E
              </div>
              <div>
                <h1 className="font-bold tracking-tight text-white text-sm">ESU Portal</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Excelsior University</p>
              </div>
            </div>
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile card inside sidebar */}
          <div className="p-4 border-b border-slate-800/60 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-indigo-300 font-bold text-sm uppercase">
                {userRole === 'ADMIN' ? 'AD' : userRole === 'TEACHER' ? 'TE' : 'ST'}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {userRole === 'ADMIN' ? 'Dr. Ramesh Kumar' : userRole === 'TEACHER' ? 'Dr. Senthil Kumar' : 'Karthikeyan'}
                </p>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono font-bold uppercase border border-slate-700/50 mt-1 inline-block">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-3 transition-colors ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {activeTab === item.id && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </nav>

          {/* Export Action Shortcut block in footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center">
            <button
              onClick={() => setActiveTab('EXPORT_CODE')}
              className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Spring ZIP
            </button>
          </div>
        </aside>

        {/* Main Workspace Frame */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Header Navbar */}
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5.5 h-5.5" />
              </button>
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <School className="w-5 h-5 text-indigo-600" />
                Excelsior Administration Console
              </h2>
            </div>

            {/* Notification icons and indicators */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <span className="font-bold text-xs text-slate-700 uppercase">Publish Board</span>
                      <button 
                        onClick={() => {
                          fetch('/api/notifications/read-all', { method: 'POST' });
                          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                          setNotifDropdownOpen(false);
                          triggerToast("Marked all alerts read", "info");
                        }}
                        className="text-[10px] text-indigo-600 font-bold uppercase hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 text-xs hover:bg-slate-50">
                          <p className={`font-semibold ${n.isRead ? 'text-slate-600' : 'text-slate-900 font-bold'}`}>{n.title}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-6 w-[1px] bg-slate-200"></div>

              {/* Verified Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Security Protected</span>
              </div>
            </div>
          </header>

          {/* Active Work Area */}
          <div className="p-6 space-y-6 flex-1 max-w-7xl mx-auto w-full">
            
            {/* Dashboard View */}
            {activeTab === 'DASHBOARD' && (
              <div className="space-y-6">
                
                {/* Visual Greeting Banner */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-indigo-950 flex flex-col md:flex-row items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                      Welcome Back, {userRole === 'ADMIN' ? 'Dr. Ramesh' : userRole === 'TEACHER' ? 'Dr. Senthil' : 'Karthikeyan'}
                    </h1>
                    <p className="text-slate-300 text-xs mt-1.5 max-w-xl leading-relaxed">
                      This preview terminals tracks database logs, active semester marksheet metrics, and lets you verify full-stack actions.
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-xs font-mono">
                    <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Academic Term</span>
                    <span className="text-indigo-300 font-bold text-sm">SPRING SEMESTER 2026</span>
                  </div>
                </div>

                {/* KPI Metrics row */}
                <DashboardCards role={userRole} stats={dashboardStats} />

                {/* Mini Quick Access bento elements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Recent Audit Trail / Academic Bulletins */}
                  <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide border-b pb-2">Active Courses Registry</h3>
                    <div className="space-y-3.5">
                      {courses.slice(0, 3).map(c => (
                        <div key={c.id} className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded border border-slate-100 hover:bg-slate-100/50 transition-colors">
                          <div>
                            <span className="font-bold text-slate-800 block text-sm">{c.name}</span>
                            <span className="text-slate-500 mt-1 block">Course Code: <strong className="font-mono text-indigo-600">{c.code}</strong> • Credits: {c.credits}</span>
                          </div>
                          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded">
                            Sem {c.semester}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Quick Status / Exporter CTA card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Enterprise Exporter</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Ready to deploy the project into production? Use our zip archiver tool to download the entire Spring Boot + React files locally.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('EXPORT_CODE')}
                      className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
                    >
                      <Download className="w-4 h-4" /> Inspect & Export Codebase
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Comprehensive Crud & Workflow Pages */}
            {activeTab !== 'DASHBOARD' && activeTab !== 'REPORTS' && activeTab !== 'EXPORT_CODE' && (
              <ManagementPanels 
                activeTab={activeTab}
                students={students}
                teachers={teachers}
                courses={courses}
                departments={departments}
                attendance={attendance}
                marks={marks}
                fees={fees}
                auditLogs={auditLogs}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
                onAddTeacher={handleAddTeacher}
                onDeleteTeacher={handleDeleteTeacher}
                onAddCourse={handleAddCourse}
                onMarkAttendance={handleMarkAttendance}
                onAddMark={handleAddMark}
                onSettleFee={handleSettleFee}
              />
            )}

            {/* Official PDF / Transcript Reporting Suite */}
            {activeTab === 'REPORTS' && (
              <ReportsPanel 
                students={students}
                courses={courses}
                marks={marks}
                attendance={attendance}
                fees={fees}
              />
            )}

            {/* Interactive Dark IDE Exporter Panel */}
            {activeTab === 'EXPORT_CODE' && (
              <ZipExportPanel />
            )}

          </div>

          {/* Clean Portal Footer */}
          <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 shrink-0">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-medium text-slate-400">Excelsior University • Academic Portal Console</p>
              <p className="text-slate-500">
                &copy; {new Date().getFullYear()} Excelsior University. All rights reserved. Developed by <span className="font-semibold text-slate-800">Bhoopathy</span>
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Elegant toast alerts */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
