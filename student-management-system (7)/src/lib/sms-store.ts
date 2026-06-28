// Lightweight client-side store for the Student Management System demo.
// Uses localStorage so the static frontend works without a backend.

export type Student = {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: string;
  gender: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  course: string;
  date: string;
  status: "Present" | "Absent" | "Late";
};

export type MarkRecord = {
  id: string;
  studentId: string;
  course: string;
  exam: string;
  marks: number;
  maxMarks: number;
};

export type User = {
  username: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email: string;
};

const K = {
  students: "sms.students",
  courses: "sms.courses",
  attendance: "sms.attendance",
  marks: "sms.marks",
  user: "sms.user",
  seeded: "sms.seeded.v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}
const uid = () => Math.random().toString(36).slice(2, 10);

export function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(K.seeded)) return;
  const courses: Course[] = [
    { id: uid(), code: "CS101", name: "Intro to Computer Science", credits: 4, instructor: "Dr. Smith" },
    { id: uid(), code: "MA201", name: "Linear Algebra", credits: 3, instructor: "Prof. Johnson" },
    { id: uid(), code: "EN105", name: "English Composition", credits: 2, instructor: "Ms. Davis" },
    { id: uid(), code: "PH110", name: "Physics I", credits: 4, instructor: "Dr. Lee" },
  ];
  const students: Student[] = [
    { id: uid(), rollNo: "S001", name: "Alice Carter", email: "alice@uni.edu", phone: "9876543210", course: "CS101", year: "1", gender: "Female" },
    { id: uid(), rollNo: "S002", name: "Brian Patel", email: "brian@uni.edu", phone: "9876501234", course: "MA201", year: "2", gender: "Male" },
    { id: uid(), rollNo: "S003", name: "Chloe Nguyen", email: "chloe@uni.edu", phone: "9870012345", course: "EN105", year: "1", gender: "Female" },
    { id: uid(), rollNo: "S004", name: "Diego Ramirez", email: "diego@uni.edu", phone: "9000123456", course: "PH110", year: "3", gender: "Male" },
  ];
  write(K.courses, courses);
  write(K.students, students);
  write(K.attendance, []);
  write(K.marks, []);
  localStorage.setItem(K.seeded, "1");
}

export const store = {
  // Auth
  getUser: () => read<User | null>(K.user, null),
  login(username: string, password: string): User | null {
    if (!username || !password) return null;
    const role: User["role"] = username.toLowerCase() === "admin" ? "admin" : username.toLowerCase().includes("teach") ? "teacher" : "student";
    const u: User = { username, role, name: username, email: `${username}@uni.edu` };
    write(K.user, u);
    return u;
  },
  logout() { if (typeof window !== "undefined") localStorage.removeItem(K.user); },
  updateProfile(p: Partial<User>) {
    const u = store.getUser();
    if (!u) return null;
    const next = { ...u, ...p };
    write(K.user, next);
    return next;
  },

  // Students
  listStudents: () => read<Student[]>(K.students, []),
  addStudent(s: Omit<Student, "id">) { const list = store.listStudents(); const n = { ...s, id: uid() }; write(K.students, [n, ...list]); return n; },
  updateStudent(id: string, p: Partial<Student>) { const list = store.listStudents().map(s => s.id === id ? { ...s, ...p } : s); write(K.students, list); },
  deleteStudent(id: string) { write(K.students, store.listStudents().filter(s => s.id !== id)); },

  // Courses
  listCourses: () => read<Course[]>(K.courses, []),
  addCourse(c: Omit<Course, "id">) { const list = store.listCourses(); const n = { ...c, id: uid() }; write(K.courses, [n, ...list]); return n; },
  deleteCourse(id: string) { write(K.courses, store.listCourses().filter(c => c.id !== id)); },

  // Attendance
  listAttendance: () => read<AttendanceRecord[]>(K.attendance, []),
  saveAttendance(records: Omit<AttendanceRecord, "id">[]) {
    const existing = store.listAttendance();
    const withIds = records.map(r => ({ ...r, id: uid() }));
    write(K.attendance, [...withIds, ...existing]);
  },

  // Marks
  listMarks: () => read<MarkRecord[]>(K.marks, []),
  addMark(m: Omit<MarkRecord, "id">) { const list = store.listMarks(); const n = { ...m, id: uid() }; write(K.marks, [n, ...list]); return n; },
  deleteMark(id: string) { write(K.marks, store.listMarks().filter(m => m.id !== id)); },
};

export function exportToCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
