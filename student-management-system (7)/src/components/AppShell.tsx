import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { store, type User } from "@/lib/sms-store";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/students", label: "Students", icon: "👥" },
  { to: "/students/new", label: "Register Student", icon: "➕" },
  { to: "/courses", label: "Courses", icon: "📚" },
  { to: "/attendance", label: "Attendance", icon: "✅" },
  { to: "/marks", label: "Marks Entry", icon: "📝" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = store.getUser();
    if (!u) { navigate({ to: "/login" }); return; }
    setUser(u);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="text-lg font-bold">🎓 SMS</div>
          <div className="text-xs text-slate-400">Student Management</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(item => {
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-slate-400 capitalize">{user.role}</div>
          <button onClick={() => { store.logout(); navigate({ to: "/login" }); }}
            className="mt-3 w-full text-xs bg-slate-800 hover:bg-slate-700 py-2 rounded-md">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
