import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { store, type Student } from "@/lib/sms-store";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance — SMS" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const courses = store.listCourses();
  const [course, setCourse] = useState(courses[0]?.code ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, "Present" | "Absent" | "Late">>({});

  useEffect(() => { setStudents(store.listStudents()); }, []);

  const list = students.filter(s => !course || s.course === course);

  function save() {
    const records = list.map(s => ({
      studentId: s.id, course, date, status: marks[s.id] ?? "Present" as const,
    }));
    store.saveAttendance(records);
    alert(`Saved ${records.length} attendance records.`);
    setMarks({});
  }

  return (
    <AppShell title="Attendance">
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <select value={course} onChange={e => setCourse(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
            {courses.map(c => <option key={c.id} value={c.code}>{c.code} — {c.name}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 border rounded-md text-sm" />
          <button onClick={save} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Attendance</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Roll No</th><th className="p-3">Name</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.rollNo}</td><td className="p-3">{s.name}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {(["Present","Absent","Late"] as const).map(st => (
                      <label key={st} className={`px-3 py-1 rounded-md text-xs cursor-pointer border ${
                        (marks[s.id] ?? "Present") === st
                          ? st === "Present" ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                          : st === "Absent" ? "bg-red-100 border-red-400 text-red-800"
                          : "bg-amber-100 border-amber-400 text-amber-800"
                          : "border-slate-200 text-slate-600"
                      }`}>
                        <input type="radio" name={`a-${s.id}`} className="hidden"
                          checked={(marks[s.id] ?? "Present") === st}
                          onChange={() => setMarks(m => ({ ...m, [s.id]: st }))} />
                        {st}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-slate-500">No students for this course.</td></tr>}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
