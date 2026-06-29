/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import JSZip from "jszip";
import { getSpringCodebase } from "./src/javaCodebaseGenerator";
import { 
  User, Student, Teacher, Course, Department, Attendance, Mark, Fee, AuditLog, Notification 
} from "./src/types";

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

// ==========================================
// 1. IN-MEMORY DATABASE SEED DATA (SmsDb)
// ==========================================
class SmsDb {
  users: User[] = [
    { id: "usr-admin", username: "admin", email: "ramesh@university.edu", role: "ADMIN", fullName: "Dr. Ramesh Kumar", createdAt: "2026-01-10T10:00:00Z" },
    { id: "usr-teacher1", username: "senthil_kumar", email: "senthil@university.edu", role: "TEACHER", fullName: "Dr. Senthil Kumar", createdAt: "2026-01-15T09:30:00Z" },
    { id: "usr-teacher2", username: "rajasekar", email: "rajasekar@university.edu", role: "TEACHER", fullName: "Prof. Rajasekar", createdAt: "2026-01-20T10:00:00Z" },
    { id: "usr-student1", username: "karthikeyan", email: "karthikeyan@student.edu", role: "STUDENT", fullName: "Karthikeyan", createdAt: "2026-02-01T11:45:00Z" },
    { id: "usr-student2", username: "nandhini", email: "nandhini@student.edu", role: "STUDENT", fullName: "Nandhini", createdAt: "2026-02-05T12:00:00Z" }
  ];

  departments: Department[] = [
    { id: "dept-cs", name: "Computer Science & Engineering", code: "CSE", description: "Department of Computer Science Engineering and Artificial Intelligence", headOfDepartment: "Dr. Senthil Kumar" },
    { id: "dept-ece", name: "Electronics & Communication", code: "ECE", description: "Department of Electronics and Communication Engineering", headOfDepartment: "Prof. Rajasekar" },
    { id: "dept-math", name: "Mathematics", code: "MATH", description: "Department of Pure and Applied Mathematics", headOfDepartment: "Prof. Kannan" }
  ];

  teachers: Teacher[] = [
    { id: "tchr-01", userId: "usr-teacher1", employeeId: "EMP1001", fullName: "Dr. Senthil Kumar", email: "senthil@university.edu", phone: "+919441112233", departmentId: "dept-cs", designation: "Associate Professor", joiningDate: "2020-08-15" },
    { id: "tchr-02", userId: "usr-teacher2", employeeId: "EMP1002", fullName: "Prof. Rajasekar", email: "rajasekar@university.edu", phone: "+919441112244", departmentId: "dept-ece", designation: "Professor", joiningDate: "2018-06-10" }
  ];

  students: Student[] = [
    { id: "std-01", userId: "usr-student1", rollNumber: "ROLL202601", fullName: "Karthikeyan", email: "karthikeyan@student.edu", phone: "+919443011223", dob: "2004-05-12", gender: "MALE", departmentId: "dept-cs", admissionDate: "2022-09-01", currentSemester: 4, guardianName: "Selvam", guardianPhone: "+919443011224" },
    { id: "std-02", userId: "usr-student2", rollNumber: "ROLL202602", fullName: "Nandhini", email: "nandhini@student.edu", phone: "+919443011225", dob: "2004-08-20", gender: "FEMALE", departmentId: "dept-cs", admissionDate: "2022-09-01", currentSemester: 4, guardianName: "Subramanian", guardianPhone: "+919443011226" }
  ];

  courses: Course[] = [
    { id: "crs-dsa", name: "Data Structures & Algorithms", code: "CSE-201", departmentId: "dept-cs", teacherId: "tchr-01", credits: 4, semester: 4 },
    { id: "crs-dbms", name: "Database Management Systems", code: "CSE-202", departmentId: "dept-cs", teacherId: "tchr-01", credits: 3, semester: 4 },
    { id: "crs-linear", name: "Linear Algebra", code: "MATH-102", departmentId: "dept-math", teacherId: "tchr-02", credits: 3, semester: 2 }
  ];

  attendance: Attendance[] = [
    { id: "att-01", studentId: "std-01", courseId: "crs-dsa", date: "2026-06-20", status: "PRESENT", remarks: "On time" },
    { id: "att-02", studentId: "std-01", courseId: "crs-dsa", date: "2026-06-21", status: "PRESENT", remarks: "On time" },
    { id: "att-03", studentId: "std-01", courseId: "crs-dsa", date: "2026-06-22", status: "ABSENT", remarks: "Medical Leave" },
    { id: "att-04", studentId: "std-02", courseId: "crs-dsa", date: "2026-06-20", status: "PRESENT", remarks: "On time" }
  ];

  marks: Mark[] = [
    { id: "mrk-01", studentId: "std-01", courseId: "crs-dsa", examType: "MID_TERM", marksObtained: 42, maxMarks: 50, grade: "A", enteredByTeacherId: "tchr-01", createdAt: "2026-06-20T14:00:00Z" },
    { id: "mrk-02", studentId: "std-01", courseId: "crs-dbms", examType: "MID_TERM", marksObtained: 45, maxMarks: 50, grade: "O", enteredByTeacherId: "tchr-01", createdAt: "2026-06-21T15:00:00Z" },
    { id: "mrk-03", studentId: "std-02", courseId: "crs-dsa", examType: "MID_TERM", marksObtained: 48, maxMarks: 50, grade: "O", enteredByTeacherId: "tchr-01", createdAt: "2026-06-20T14:00:00Z" }
  ];

  fees: Fee[] = [
    { id: "fee-01", studentId: "std-01", title: "Semester 4 Tuition Fee", amount: 45000, dueDate: "2026-06-30", paymentDate: "2026-06-15", paymentMethod: "ONLINE", status: "PAID", receiptNumber: "REC9981273" },
    { id: "fee-02", studentId: "std-01", title: "Annual Library Fee", amount: 1500, dueDate: "2026-07-15", status: "UNPAID" },
    { id: "fee-03", studentId: "std-02", title: "Semester 4 Tuition Fee", amount: 45000, dueDate: "2026-06-30", status: "UNPAID" }
  ];

  notifications: Notification[] = [
    { id: "notif-1", recipientId: "ALL", title: "End Semester Exams Schedule", message: "The End Semester Exams will commence from July 5, 2026. Make sure to clear all outstanding fees.", type: "WARNING", isRead: false, createdAt: "2026-06-20T09:00:00Z" },
    { id: "notif-2", recipientId: "usr-student1", title: "Fee Payment Received", message: "Your payment of ₹45,000 for Semester 4 Tuition Fee has been approved.", type: "SUCCESS", isRead: false, createdAt: "2026-06-15T10:30:00Z" }
  ];

  auditLogs: AuditLog[] = [
    { id: "log-1", userId: "usr-admin", username: "admin", role: "ADMIN", action: "System Database Initialized", ipAddress: "127.0.0.1", timestamp: "2026-06-24T12:00:00Z" }
  ];
}

const db = new SmsDb();

// Active Session Storage
let activeUser: User | null = db.users[0]; // Standard default active session is Admin

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log action helper
  const addAuditLog = (action: string, user: User | null) => {
    const log: AuditLog = {
      id: generateId("log"),
      userId: user?.id || "guest",
      username: user?.username || "Guest",
      role: user?.role || "GUEST",
      action,
      ipAddress: "127.0.0.1",
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(log);
  };

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    // For local mock demonstration, match any demo credential with "password"
    const user = db.users.find(u => u.username === username);
    if (user && password === "password") {
      activeUser = user;
      addAuditLog(`User logged in: ${username}`, user);
      res.json({ token: `mock-jwt-token-for-${user.id}`, user });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    addAuditLog(`User logged out: ${activeUser?.username}`, activeUser);
    activeUser = null;
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    if (activeUser) {
      res.json(activeUser);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Switch demo account (Utility for UI testing)
  app.post("/api/auth/switch", (req, res) => {
    const { role } = req.body;
    const user = db.users.find(u => u.role === role);
    if (user) {
      activeUser = user;
      addAuditLog(`Switched session role to: ${role}`, user);
      res.json(user);
    } else {
      res.status(404).json({ message: "Role user not found" });
    }
  });

  // ==========================================
  // DEPARTMENTS ENDPOINTS
  // ==========================================
  app.get("/api/departments", (req, res) => {
    res.json(db.departments);
  });

  app.post("/api/departments", (req, res) => {
    const { name, code, description, headOfDepartment } = req.body;
    const dept: Department = {
      id: generateId("dept"),
      name,
      code,
      description: description || "",
      headOfDepartment: headOfDepartment || ""
    };
    db.departments.push(dept);
    addAuditLog(`Created Department: ${code}`, activeUser);
    res.status(201).json(dept);
  });

  // ==========================================
  // TEACHERS ENDPOINTS
  // ==========================================
  app.get("/api/teachers", (req, res) => {
    const data = db.teachers.map(t => ({
      ...t,
      departmentName: db.departments.find(d => d.id === t.departmentId)?.name || "N/A"
    }));
    res.json(data);
  });

  app.post("/api/teachers", (req, res) => {
    const { fullName, email, phone, departmentId, designation, joiningDate } = req.body;
    const userId = generateId("usr");
    const teacherId = generateId("tchr");

    // Create user object
    const username = fullName.toLowerCase().replace(/\s+/g, "_");
    const newUser: User = {
      id: userId,
      username,
      email,
      role: "TEACHER",
      fullName,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);

    // Create teacher object
    const newTeacher: Teacher = {
      id: teacherId,
      userId,
      employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
      fullName,
      email,
      phone,
      departmentId,
      designation,
      joiningDate
    };
    db.teachers.push(newTeacher);

    addAuditLog(`Registered Teacher: ${fullName}`, activeUser);
    res.status(201).json(newTeacher);
  });

  app.delete("/api/teachers/:id", (req, res) => {
    const { id } = req.params;
    const teacherIdx = db.teachers.findIndex(t => t.id === id);
    if (teacherIdx !== -1) {
      const teacher = db.teachers[teacherIdx];
      db.teachers.splice(teacherIdx, 1);
      // Clean user
      db.users = db.users.filter(u => u.id !== teacher.userId);
      addAuditLog(`Deleted Teacher profile: ${teacher.fullName}`, activeUser);
      res.json({ success: true });
    } else {
      res.status(404).json({ message: "Teacher not found" });
    }
  });

  // ==========================================
  // STUDENTS ENDPOINTS
  // ==========================================
  app.get("/api/students", (req, res) => {
    const data = db.students.map(s => ({
      ...s,
      departmentName: db.departments.find(d => d.id === s.departmentId)?.name || "N/A"
    }));
    res.json(data);
  });

  app.post("/api/students", (req, res) => {
    const { fullName, email, phone, dob, gender, departmentId, admissionDate, currentSemester, guardianName, guardianPhone } = req.body;
    const userId = generateId("usr");
    const studentId = generateId("std");

    const username = fullName.toLowerCase().replace(/\s+/g, "_");
    const newUser: User = {
      id: userId,
      username,
      email,
      role: "STUDENT",
      fullName,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);

    const newStudent: Student = {
      id: studentId,
      userId,
      rollNumber: `ROLL2026${Math.floor(10 + Math.random() * 90)}`,
      fullName,
      email,
      phone,
      dob,
      gender,
      departmentId,
      admissionDate,
      currentSemester: Number(currentSemester) || 1,
      guardianName,
      guardianPhone
    };
    db.students.push(newStudent);

    // Auto-create initial tuition fee for student
    db.fees.push({
      id: generateId("fee"),
      studentId,
      title: `Semester ${currentSemester || 1} Tuition Fee`,
      amount: 45000,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "UNPAID"
    });

    addAuditLog(`Registered Student: ${fullName}`, activeUser);
    res.status(201).json(newStudent);
  });

  app.put("/api/students/:id", (req, res) => {
    const { id } = req.params;
    const student = db.students.find(s => s.id === id);
    if (student) {
      Object.assign(student, req.body);
      addAuditLog(`Updated Student profile: ${student.fullName}`, activeUser);
      res.json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  });

  app.delete("/api/students/:id", (req, res) => {
    const { id } = req.params;
    const studentIdx = db.students.findIndex(s => s.id === id);
    if (studentIdx !== -1) {
      const student = db.students[studentIdx];
      db.students.splice(studentIdx, 1);
      db.users = db.users.filter(u => u.id !== student.userId);
      addAuditLog(`Deleted Student profile: ${student.fullName}`, activeUser);
      res.json({ success: true });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  });

  // ==========================================
  // COURSES ENDPOINTS
  // ==========================================
  app.get("/api/courses", (req, res) => {
    const data = db.courses.map(c => ({
      ...c,
      departmentName: db.departments.find(d => d.id === c.departmentId)?.name || "N/A",
      teacherName: db.teachers.find(t => t.id === c.teacherId)?.fullName || "Unassigned"
    }));
    res.json(data);
  });

  app.post("/api/courses", (req, res) => {
    const { name, code, departmentId, teacherId, credits, semester } = req.body;
    const course: Course = {
      id: generateId("crs"),
      name,
      code,
      departmentId,
      teacherId: teacherId || undefined,
      credits: Number(credits) || 3,
      semester: Number(semester) || 1
    };
    db.courses.push(course);
    addAuditLog(`Created Course: ${name} (${code})`, activeUser);
    res.status(201).json(course);
  });

  app.put("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    const course = db.courses.find(c => c.id === id);
    if (course) {
      Object.assign(course, req.body);
      addAuditLog(`Updated Course: ${course.name}`, activeUser);
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  });

  // ==========================================
  // ATTENDANCE ENDPOINTS
  // ==========================================
  app.get("/api/attendance", (req, res) => {
    const data = db.attendance.map(a => {
      const std = db.students.find(s => s.id === a.studentId);
      const crs = db.courses.find(c => c.id === a.courseId);
      return {
        ...a,
        studentName: std?.fullName || "Unknown",
        rollNumber: std?.rollNumber || "N/A",
        courseName: crs?.name || "Unknown"
      };
    });
    res.json(data);
  });

  app.post("/api/attendance", (req, res) => {
    const records = req.body; // Expecting array of attendance records
    if (Array.isArray(records)) {
      records.forEach(r => {
        // Look if record already exists for the student on this course + date
        const existing = db.attendance.find(a => a.studentId === r.studentId && a.courseId === r.courseId && a.date === r.date);
        if (existing) {
          existing.status = r.status;
          existing.remarks = r.remarks;
        } else {
          db.attendance.push({
            id: generateId("att"),
            studentId: r.studentId,
            courseId: r.courseId,
            date: r.date,
            status: r.status,
            remarks: r.remarks
          });
        }
      });
      addAuditLog(`Submitted attendance for course: ${records[0]?.courseId}`, activeUser);
      res.json({ success: true, count: records.length });
    } else {
      res.status(400).json({ message: "Invalid payload format. Expected array." });
    }
  });

  // ==========================================
  // MARKS ENDPOINTS
  // ==========================================
  app.get("/api/marks", (req, res) => {
    const data = db.marks.map(m => {
      const std = db.students.find(s => s.id === m.studentId);
      const crs = db.courses.find(c => c.id === m.courseId);
      return {
        ...m,
        studentName: std?.fullName || "Unknown",
        rollNumber: std?.rollNumber || "N/A",
        courseName: crs?.name || "Unknown"
      };
    });
    res.json(data);
  });

  app.post("/api/marks", (req, res) => {
    const { studentId, courseId, examType, marksObtained, maxMarks, grade, enteredByTeacherId } = req.body;
    const mark: Mark = {
      id: generateId("mrk"),
      studentId,
      courseId,
      examType,
      marksObtained: Number(marksObtained),
      maxMarks: Number(maxMarks),
      grade,
      enteredByTeacherId: enteredByTeacherId || "tchr-01",
      createdAt: new Date().toISOString()
    };
    db.marks.push(mark);
    addAuditLog(`Entered marks for Student ID: ${studentId}`, activeUser);
    res.status(201).json(mark);
  });

  // ==========================================
  // FEES ENDPOINTS
  // ==========================================
  app.get("/api/fees", (req, res) => {
    const data = db.fees.map(f => {
      const std = db.students.find(s => s.id === f.studentId);
      return {
        ...f,
        studentName: std?.fullName || "Unknown",
        rollNumber: std?.rollNumber || "N/A"
      };
    });
    res.json(data);
  });

  app.put("/api/fees/:id", (req, res) => {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;
    const fee = db.fees.find(f => f.id === id);
    if (fee) {
      fee.status = status;
      if (status === "PAID") {
        fee.paymentDate = new Date().toISOString().split('T')[0];
        fee.paymentMethod = paymentMethod || "ONLINE";
        fee.receiptNumber = `REC${Math.floor(1000000 + Math.random() * 9000000)}`;
      }
      addAuditLog(`Updated Payment Status for Fee Record: ${fee.title}`, activeUser);
      res.json(fee);
    } else {
      res.status(404).json({ message: "Fee record not found" });
    }
  });

  // ==========================================
  // AUDIT LOGS & NOTIFICATIONS ENDPOINTS
  // ==========================================
  app.get("/api/audit-logs", (req, res) => {
    res.json(db.auditLogs);
  });

  app.get("/api/notifications", (req, res) => {
    res.json(db.notifications);
  });

  app.post("/api/notifications/read-all", (req, res) => {
    db.notifications.forEach(n => n.isRead = true);
    res.json({ success: true });
  });

  // ==========================================
  // DASHBOARD STATISTICS ENDPOINT
  // ==========================================
  app.get("/api/dashboard/stats", (req, res) => {
    // Total numbers
    const totalStudents = db.students.length;
    const totalTeachers = db.teachers.length;
    const totalCourses = db.courses.length;
    const totalDepartments = db.departments.length;

    // Calculate overall attendance rate
    const totalAttRecords = db.attendance.length;
    const presentAttRecords = db.attendance.filter(a => a.status === "PRESENT" || a.status === "LATE").length;
    const attendancePercentage = totalAttRecords > 0 ? Math.round((presentAttRecords / totalAttRecords) * 100) : 85;

    // Calculate pass rate (marks obtained >= 40% of max marks)
    const totalMarksRecords = db.marks.length;
    const passedMarksRecords = db.marks.filter(m => (m.marksObtained / m.maxMarks) >= 0.4).length;
    const passPercentage = totalMarksRecords > 0 ? Math.round((passedMarksRecords / totalMarksRecords) * 100) : 92;

    // Department Stats (Students count per department)
    const departmentStats = db.departments.map(dept => {
      const studentCount = db.students.filter(s => s.departmentId === dept.id).length;
      return {
        name: dept.code,
        students: studentCount,
        courses: db.courses.filter(c => c.departmentId === dept.id).length
      };
    });

    res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalDepartments,
      attendancePercentage,
      passPercentage,
      departmentStats
    });
  });

  // ==========================================
  // ZIP SOURCE EXPORTER ENDPOINT (Enterprise Package)
  // ==========================================
  app.get("/api/export-zip", async (req, res) => {
    try {
      const zip = new JSZip();

      // Get Spring Boot files
      const springFiles = getSpringCodebase();
      
      // Inject backend files into zip
      springFiles.forEach(file => {
        zip.file(`backend/${file.path}`, file.content);
      });

      // Dynamically read actual React files from our codebase to ensure 100% feature parity!
      const readLocalFile = (relativePath: string) => {
        try {
          return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
        } catch (e) {
          console.error(`Error reading ${relativePath}:`, e);
          return "";
        }
      };

      let appTsxContent = readLocalFile("src/App.tsx");
      // Replace ZipExportPanel import with clean fallback component to avoid missing generator dependencies
      appTsxContent = appTsxContent.replace(
        "import ZipExportPanel from './components/ZipExportPanel';",
        `const ZipExportPanel = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">Code Exported Successfully</h2>
    <p className="text-slate-500 text-sm leading-relaxed mb-6">
      This full-stack codebase has been compiled, packaged, and exported. You are currently running the local offline deployment of the Student Management System.
    </p>
    <div className="p-4 bg-slate-50 rounded-lg text-left text-xs font-mono text-slate-600 border border-slate-100">
      <span className="font-bold text-slate-800 block mb-1">💡 Pro-Tip</span>
      To regenerate or customize this codebase, return to your Google AI Studio workspace.
    </div>
  </div>
);`
      );

      const typesContent = readLocalFile("src/types.ts");
      const dashboardCardsContent = readLocalFile("src/components/DashboardCards.tsx");
      const managementPanelsContent = readLocalFile("src/components/ManagementPanels.tsx");
      const reportsPanelContent = readLocalFile("src/components/ReportsPanel.tsx");

      // Inject React Frontend files into zip
      const reactFiles = [
        {
          path: "package.json",
          content: `{
  "name": "student-management-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "lucide-react": "^0.546.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.8.0",
    "vite": "^6.2.3"
  }
}`
        },
        {
          path: "tsconfig.json",
          content: `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`
        },
        {
          path: "vite.config.ts",
          content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})`
        },
        {
          path: "index.html",
          content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Management System</title>
  </head>
  <body class="bg-slate-50 text-slate-900">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        },
        {
          path: "src/main.tsx",
          content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
        },
        {
          path: "src/index.css",
          content: `@import "tailwindcss";`
        },
        {
          path: "src/App.tsx",
          content: appTsxContent
        },
        {
          path: "src/types.ts",
          content: typesContent
        },
        {
          path: "src/components/DashboardCards.tsx",
          content: dashboardCardsContent
        },
        {
          path: "src/components/ManagementPanels.tsx",
          content: managementPanelsContent
        },
        {
          path: "src/components/ReportsPanel.tsx",
          content: reportsPanelContent
        },
        {
          path: "Dockerfile",
          content: `# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } location /api/ { proxy_pass http://backend:8080/api/; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
        }
      ];

      reactFiles.forEach(file => {
        zip.file(`frontend/${file.path}`, file.content);
      });

      // Generate visual deployment guide inside root
      zip.file("DEPLOYMENT_GUIDE.md", `# Deployment Handbook - Student Management System

## 📦 Architecture Overview
This contains:
1. **backend/**: A standard Maven Spring Boot 3.x project running Java 21, Spring Security with stateless JWT validation, and Spring Data JPA.
2. **frontend/**: A modular React 18+ app styled with Tailwind CSS, leveraging Axios for REST requests.

## 💾 Database Configuration
1. Install MySQL 8 and create a database named \`student_management_db\`.
2. Apply the DDL schema inside \`backend/src/main/resources/schema.sql\`.
3. Apply default initial data from \`backend/src/main/resources/data.sql\`.

## ⚙️ Running the Services

### Docker Deployment
1. Run \`docker-compose up -d\` from the root directory.
2. The system spins up the database, automatically runs SQL files, and executes the backend.

### Manual Backend Deployment
1. Open \`backend/src/main/resources/application.yml\` and update credentials if needed.
2. Build and run:
   \`\`\`bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   \`\`\`

### Manual Frontend Deployment
1. Install dependencies and start server:
   \`\`\`bash
   cd frontend
   npm install
   npm run dev
   \`\`\`
2. Open \`http://localhost:3000\` to experience the web UI.
`);

      const content = await zip.generateAsync({ type: "nodebuffer" });
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=Student_Management_System_Enterprise.zip");
      res.send(content);
      
      addAuditLog("Exported Full Enterprise Source Code ZIP Package", activeUser);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Failed to assemble the project ZIP." });
    }
  });

  // ==========================================
  // VITE DEVELOPMENT MIDDLEWARE SETUP
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
