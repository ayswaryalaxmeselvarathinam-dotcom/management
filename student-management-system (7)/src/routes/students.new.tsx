import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { store } from "@/lib/sms-store";

export const Route = createFileRoute("/students/new")({
  head: () => ({ meta: [{ title: "Register Student — SMS" }] }),
  component: NewStudent,
});

function NewStudent() {
  const navigate = useNavigate();
  const courses = store.listCourses();
  const [form, setForm] = useState({
    rollNo: "", name: "", email: "", phone: "",
    course: courses[0]?.code ?? "", year: "1", gender: "Male",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.rollNo || !form.name || !form.email) { alert("Fill all required fields"); return; }
    store.addStudent(form);
    navigate({ to: "/students" });
  }

  const field = "w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none";
  const label = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <AppShell title="Student Registration">
      <form onSubmit={submit} className="bg-white rounded-xl border p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>Roll Number *</label>
            <input className={field} value={form.rollNo} onChange={e => set("rollNo", e.target.value)} required /></div>
          <div><label className={label}>Full Name *</label>
            <input className={field} value={form.name} onChange={e => set("name", e.target.value)} required /></div>
          <div><label className={label}>Email *</label>
            <input type="email" className={field} value={form.email} onChange={e => set("email", e.target.value)} required /></div>
          <div><label className={label}>Phone</label>
            <input className={field} value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
          <div><label className={label}>Course</label>
            <select className={field} value={form.course} onChange={e => set("course", e.target.value)}>
              {courses.map(c => <option key={c.id} value={c.code}>{c.code} — {c.name}</option>)}
            </select></div>
          <div><label className={label}>Year</label>
            <select className={field} value={form.year} onChange={e => set("year", e.target.value)}>
              {["1","2","3","4"].map(y => <option key={y}>{y}</option>)}
            </select></div>
          <div><label className={label}>Gender</label>
            <select className={field} value={form.gender} onChange={e => set("gender", e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select></div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Register</button>
          <button type="button" onClick={() => navigate({ to: "/students" })}
            className="px-5 py-2 border rounded-md hover:bg-slate-50">Cancel</button>
        </div>
      </form>
    </AppShell>
  );
}
