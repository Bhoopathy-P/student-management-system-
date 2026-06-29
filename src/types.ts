/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment?: string;
}

export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName?: string;
  designation: string;
  joiningDate: string;
  assignedCourses?: string[]; // Course IDs
}

export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  departmentId: string;
  departmentName?: string;
  admissionDate: string;
  currentSemester: number;
  guardianName: string;
  guardianPhone: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  departmentName?: string;
  teacherId?: string;
  teacherName?: string;
  credits: number;
  semester: number;
}

export interface StudentCourse {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  courseId: string;
  courseName?: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  remarks?: string;
}

export interface Mark {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  courseId: string;
  courseName?: string;
  examType: 'MID_TERM' | 'FINAL_EXAM' | 'ASSIGNMENT' | 'PRACTICAL';
  marksObtained: number;
  maxMarks: number;
  grade: string;
  enteredByTeacherId: string;
  createdAt: string;
}

export interface Fee {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  title: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'ONLINE';
  status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PARTIALLY_PAID';
  receiptNumber?: string;
}

export interface Notification {
  id: string;
  recipientId: string; // userId or 'ALL'
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  role: string;
  action: string;
  ipAddress: string;
  timestamp: string;
}
