import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { store, exportToCSV, type MarkRecord, type Student } from "@/lib/sms-store";

export const Route = createFileRoute("/marks")({
  head: () => ({ meta: [{ title: "Marks Entry — SMS" }] }),
  component: MarksPage,
});

function MarksPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const courses = store.listCourses();
  const [form, setForm] = useState({
    studentId: "", course: courses[0]?.code ?? "", exam: "Midterm", marks: 0, maxMarks: 100,
  });

  const refresh = () => { setStudents(store.listStudents()); setMarks(store.listMarks()); };
  useEffect(refresh, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.studentId) { alert("Select a student"); return; }
    store.addMark({ ...form, marks: Number(form.marks), maxMarks: Number(form.maxMarks) });
    setForm({ ...form, marks: 0 });
    refresh();
  }

  const field = "w-full px-3 py-2 border rounded-md text-sm";

  return (
    <AppShell title="Marks Entry">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="bg-white rounded-xl border p-6 space-y-3">
          <h2 className="font-semibold">Add Marks</h2>
          <select className={field} value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})}>
            <option value="">Select student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.rollNo} — {s.name}</option>)}
          </select>
          <select className={field} value={form.course} onChange={e => setForm({...form, course: e.target.value})}>
            {courses.map(c => <option key={c.id} value={c.code}>{c.code}</option>)}
          </select>
          <select className={field} value={form.exam} onChange={e => setForm({...form, exam: e.target.value})}>
            <option>Quiz</option><option>Midterm</option><option>Final</option><option>Assignment</option>
          </select>
          <div className="flex gap-2">
            <input type="number" className={field} placeholder="Marks" value={form.marks} onChange={e => setForm({...form, marks: Number(e.target.value)})} />
            <input type="number" className={field} placeholder="Max" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: Number(e.target.value)})} />
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Save Marks</button>
        </form>

        <div className="bg-white rounded-xl border p-6 lg:col-span-2 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">All Marks</h2>
            <button onClick={() => exportToCSV("marks.csv", marks)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700">Export CSV</button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr><th className="p-2">Student</th><th className="p-2">Course</th><th className="p-2">Exam</th><th className="p-2">Score</th><th className="p-2">%</th></tr>
            </thead>
            <tbody>
              {marks.map(m => {
                const s = students.find(x => x.id === m.studentId);
                const pct = ((m.marks / m.maxMarks) * 100).toFixed(1);
                return (
                  <tr key={m.id} className="border-t">
                    <td className="p-2">{s?.name ?? "—"}</td>
                    <td className="p-2">{m.course}</td>
                    <td className="p-2">{m.exam}</td>
                    <td className="p-2">{m.marks}/{m.maxMarks}</td>
                    <td className="p-2 font-medium">{pct}%</td>
                  </tr>
                );
              })}
              {marks.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No marks yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
