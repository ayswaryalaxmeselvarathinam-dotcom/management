import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { store, seedIfEmpty } from "@/lib/sms-store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — SMS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  useEffect(() => { seedIfEmpty(); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = store.login(username.trim(), password);
    if (!u) { setError("Invalid credentials"); return; }
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎓</div>
          <h1 className="text-2xl font-bold text-slate-800">Student Management System</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md font-medium">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-xs text-slate-500 bg-slate-50 rounded-md p-3">
          <div className="font-semibold mb-1">Demo accounts</div>
          <div>• <b>admin</b> / admin123 — admin role</div>
          <div>• <b>teacher1</b> / any — teacher role</div>
          <div>• <b>student1</b> / any — student role</div>
        </div>
      </div>
    </div>
  );
}
