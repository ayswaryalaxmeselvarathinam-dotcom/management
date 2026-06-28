import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { store, exportToCSV, type Student } from "@/lib/sms-store";

export const Route = createFileRoute("/students")({
  head: () => ({ meta: [{ title: "Students — SMS" }] }),
  component: StudentList,
});

function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const refresh = () => setStudents(store.listStudents());
  useEffect(refresh, []);

  const courses = Array.from(new Set(students.map(s => s.course)));
  const filtered = students.filter(s =>
    (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.rollNo.toLowerCase().includes(q.toLowerCase())) &&
    (!filterCourse || s.course === filterCourse)
  );

  function remove(id: string) {
    if (!confirm("Delete this student?")) return;
    store.deleteStudent(id); refresh();
  }

  return (
    <AppShell title="Student List">
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <input placeholder="Search by name or roll no..." value={q} onChange={e => setQ(e.target.value)}
            className="flex-1 min-w-64 px-3 py-2 border rounded-md text-sm" />
          <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm">
            <option value="">All Courses</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => exportToCSV("students.csv", filtered)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700">
            Export CSV
          </button>
          <Link to="/students/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
            + New Student
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="p-3">Roll No</th><th className="p-3">Name</th><th className="p-3">Email</th>
                <th className="p-3">Phone</th><th className="p-3">Course</th><th className="p-3">Year</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{s.rollNo}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">{s.course}</td>
                  <td className="p-3">{s.year}</td>
                  <td className="p-3">
                    <button onClick={() => remove(s.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-slate-500">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
