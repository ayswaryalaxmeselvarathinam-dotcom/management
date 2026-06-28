import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { store, type User } from "@/lib/sms-store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SMS" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = store.getUser();
    if (u) { setUser(u); setForm({ name: u.name, email: u.email }); }
  }, []);

  if (!user) return null;

  function save(e: React.FormEvent) {
    e.preventDefault();
    const u = store.updateProfile(form);
    if (u) setUser(u);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AppShell title="Profile">
      <div className="bg-white rounded-xl border p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-sm text-slate-500">@{user.username}</div>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded capitalize">{user.role}</span>
          </div>
        </div>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
            <input className="w-full px-3 py-2 border rounded-md text-sm"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-md text-sm"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Update Profile</button>
            {saved && <span className="text-sm text-emerald-600">✓ Saved</span>}
          </div>
        </form>
      </div>
    </AppShell>
  );
}
