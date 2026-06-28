import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { store } from "@/lib/sms-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SMS" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, attendance: 0, marks: 0 });
  useEffect(() => {
    setStats({
      students: store.listStudents().length,
      courses: store.listCourses().length,
      attendance: store.listAttendance().length,
      marks: store.listMarks().length,
    });
  }, []);

  const cards = [
    { label: "Total Students", value: stats.students, color: "bg-indigo-500", icon: "👥" },
    { label: "Active Courses", value: stats.courses, color: "bg-emerald-500", icon: "📚" },
    { label: "Attendance Logs", value: stats.attendance, color: "bg-amber-500", icon: "✅" },
    { label: "Mark Entries", value: stats.marks, color: "bg-rose-500", icon: "📝" },
  ];

  const recentStudents = store.listStudents().slice(0, 5);
  const recentMarks = store.listMarks().slice(0, 5);

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">{c.label}</div>
                <div className="text-3xl font-bold mt-1">{c.value}</div>
              </div>
              <div className={`${c.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}>
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Recent Students</h2>
          {recentStudents.length === 0 ? (
            <p className="text-sm text-slate-500">No students yet.</p>
          ) : (
            <ul className="divide-y">
              {recentStudents.map(s => (
                <li key={s.id} className="py-2 flex justify-between text-sm">
                  <span>{s.name} <span className="text-slate-400">({s.rollNo})</span></span>
                  <span className="text-slate-500">{s.course}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Recent Marks</h2>
          {recentMarks.length === 0 ? (
            <p className="text-sm text-slate-500">No marks recorded yet.</p>
          ) : (
            <ul className="divide-y">
              {recentMarks.map(m => (
                <li key={m.id} className="py-2 flex justify-between text-sm">
                  <span>{m.course} — {m.exam}</span>
                  <span className="font-medium">{m.marks}/{m.maxMarks}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
