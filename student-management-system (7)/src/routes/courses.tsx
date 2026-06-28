import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { store, type Course } from "@/lib/sms-store";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "Courses — SMS" }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ code: "", name: "", credits: 3, instructor: "" });
  const refresh = () => setCourses(store.listCourses());
  useEffect(refresh, []);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.name) return;
    store.addCourse({ ...form, credits: Number(form.credits) });
    setForm({ code: "", name: "", credits: 3, instructor: "" });
    refresh();
  }
  function remove(id: string) {
    if (!confirm("Delete course?")) return;
    store.deleteCourse(id); refresh();
  }

  const field = "px-3 py-2 border rounded-md text-sm";

  return (
    <AppShell title="Course Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={add} className="bg-white rounded-xl border p-6 space-y-3">
          <h2 className="font-semibold">Add Course</h2>
          <input className={field + " w-full"} placeholder="Code (e.g. CS101)" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
          <input className={field + " w-full"} placeholder="Course name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="number" className={field + " w-full"} placeholder="Credits" value={form.credits} onChange={e => setForm({...form, credits: Number(e.target.value)})} />
          <input className={field + " w-full"} placeholder="Instructor" value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})} />
          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Add Course</button>
        </form>
        <div className="bg-white rounded-xl border p-6 lg:col-span-2 overflow-x-auto">
          <h2 className="font-semibold mb-4">All Courses</h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr><th className="p-2">Code</th><th className="p-2">Name</th><th className="p-2">Credits</th><th className="p-2">Instructor</th><th className="p-2"></th></tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-2 font-medium">{c.code}</td>
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.credits}</td>
                  <td className="p-2">{c.instructor}</td>
                  <td className="p-2"><button onClick={() => remove(c.id)} className="text-red-600 hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
