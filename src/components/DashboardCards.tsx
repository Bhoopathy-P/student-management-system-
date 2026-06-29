/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, GraduationCap, BookOpen, Building, CheckCircle, Percent, DollarSign, Award, BookOpenCheck } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  sparklineColor?: string;
  sparklineData?: number[];
}

function MetricCard({ title, value, subtext, icon, trend, trendUp, sparklineColor = 'indigo', sparklineData = [10, 25, 15, 30, 45, 35, 60] }: MetricCardProps) {
  // Generate simple SVG path from array of numbers
  const width = 100;
  const height = 30;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
        <span className="text-xs text-slate-500 leading-none">{subtext}</span>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Embedded Sparkline SVG */}
      <div className="mt-3">
        <svg className="w-full h-[30px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={sparklineColor === 'emerald' ? '#10b981' : sparklineColor === 'amber' ? '#f59e0b' : sparklineColor === 'rose' ? '#f43f5e' : '#4f46e5'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}

interface DashboardCardsProps {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  stats: any;
  studentData?: any;
}

export default function DashboardCards({ role, stats, studentData }: DashboardCardsProps) {
  if (role === 'ADMIN') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Students"
          value={stats.totalStudents || 124}
          subtext="Enrolled this term"
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          trend="+12% MoM"
          trendUp={true}
          sparklineColor="indigo"
          sparklineData={[15, 18, 22, 21, 25, 29, 32]}
        />
        <MetricCard
          title="Faculty Members"
          value={stats.totalTeachers || 18}
          subtext="Full-time and adjunct"
          icon={<GraduationCap className="w-5 h-5 text-emerald-600" />}
          trend="Stable"
          trendUp={true}
          sparklineColor="emerald"
          sparklineData={[10, 10, 11, 11, 11, 11, 12]}
        />
        <MetricCard
          title="Active Courses"
          value={stats.totalCourses || 34}
          subtext="Across 3 departments"
          icon={<BookOpen className="w-5 h-5 text-amber-600" />}
          trend="+4 New"
          trendUp={true}
          sparklineColor="amber"
          sparklineData={[5, 12, 10, 15, 22, 28, 30]}
        />
        <MetricCard
          title="Average Attendance"
          value={`${stats.attendancePercentage || 92}%`}
          subtext="Daily present quota"
          icon={<CheckCircle className="w-5 h-5 text-indigo-500" />}
          trend="+2.1% improvement"
          trendUp={true}
          sparklineColor="indigo"
          sparklineData={[82, 85, 87, 86, 90, 89, 92]}
        />
      </div>
    );
  }

  if (role === 'TEACHER') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard
          title="Assigned Courses"
          value={2}
          subtext="Algorithms, Databases"
          icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
          trend="Sem-4"
          trendUp={true}
          sparklineColor="indigo"
          sparklineData={[1, 1, 2, 2, 2, 2, 2]}
        />
        <MetricCard
          title="Students Under Supervision"
          value={stats.totalStudents || 64}
          subtext="Active in your modules"
          icon={<Users className="w-5 h-5 text-emerald-600" />}
          trend="85% Active"
          trendUp={true}
          sparklineColor="emerald"
          sparklineData={[30, 42, 45, 50, 52, 58, 64]}
        />
        <MetricCard
          title="Average Attendance Marked"
          value="94.2%"
          subtext="In CSE-201 & CSE-202"
          icon={<CheckCircle className="w-5 h-5 text-amber-600" />}
          trend="Excellent"
          trendUp={true}
          sparklineColor="amber"
          sparklineData={[90, 92, 91, 93, 94, 94, 95]}
        />
      </div>
    );
  }

  // Student Metrics
  const presentCount = 2; // Derived from attendance seeds
  const totalCount = 3;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <MetricCard
        title="Attendance Rate"
        value={`${attendanceRate}%`}
        subtext="Classroom quota"
        icon={<CheckCircle className="w-5 h-5 text-indigo-600" />}
        trend={attendanceRate >= 75 ? "Eligible for exams" : "Critical limit"}
        trendUp={attendanceRate >= 75}
        sparklineColor={attendanceRate >= 75 ? "indigo" : "rose"}
        sparklineData={[50, 60, 66, 75, 71, 75, 66]}
      />
      <MetricCard
        title="My Cumulative Grade"
        value="A+ / O"
        subtext="CGPA: 9.35"
        icon={<Award className="w-5 h-5 text-emerald-600" />}
        trend="Top 5% of Class"
        trendUp={true}
        sparklineColor="emerald"
        sparklineData={[85, 88, 90, 91, 92, 93, 94]}
      />
      <MetricCard
        title="Registered Courses"
        value={2}
        subtext="DSA, DBMS (Sem-4)"
        icon={<BookOpenCheck className="w-5 h-5 text-amber-600" />}
        trend="12 Credits"
        trendUp={true}
        sparklineColor="amber"
        sparklineData={[2, 2, 2, 2, 2, 2, 2]}
      />
      <MetricCard
        title="Outstanding Balance"
        value="₹1,500"
        subtext="Library Fees due"
        icon={<DollarSign className="w-5 h-5 text-rose-500" />}
        trend="Due: July 15"
        trendUp={false}
        sparklineColor="rose"
        sparklineData={[3650, 3650, 3650, 3500, 3500, 150, 150]}
      />
    </div>
  );
}
