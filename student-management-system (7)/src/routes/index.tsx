import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { store, seedIfEmpty } from "@/lib/sms-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Management System" },
      { name: "description", content: "Manage students, courses, attendance and marks." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    seedIfEmpty();
    navigate({ to: store.getUser() ? "/dashboard" : "/login" });
  }, [navigate]);
  return null;
}
