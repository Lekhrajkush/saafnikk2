"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Tab = "users" | "drives" | "reports";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<any[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/");
    }
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || session.user.role !== "ADMIN") return;
    setLoading(true);
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/drives").then((r) => r.json()),
      fetch("/api/reports").then((r) => r.json()),
    ]).then(([u, d, r]) => {
      setUsers(u.users ?? []);
      setDrives(d.drives ?? []);
      setReports(r.reports ?? []);
      setLoading(false);
    });
  }, [status, session, tab === "reports"]);

  async function updateDriveStatus(driveId: string, driveStatus: string) {
    await fetch("/api/admin/drives", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driveId, status: driveStatus }),
    });
    setDrives((ds) => ds.map((d) => (d.id === driveId ? { ...d, status: driveStatus } : d)));
  }

  async function updateReportStatus(reportId: string, reportStatus: string) {
    await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status: reportStatus }),
    });
    setReports((rs) => rs.map((r) => (r.id === reportId ? { ...r, status: reportStatus } : r)));
  }

  async function updateUserRole(userId: string, role: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    setUsers((us) => us.map((u) => (u.id === userId ? { ...u, role } : u)));
  }

  if (status !== "authenticated" || session.user.role !== "ADMIN") {
    return <p className="text-sm text-canopy-900/50">Checking access…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-canopy-900">Admin panel</h1>

      <div className="mt-6 flex gap-2">
        {(["users", "drives", "reports"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === t ? "bg-canopy-800 text-stone-50" : "bg-canopy-100 text-canopy-800"
            }`}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-canopy-900/50">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          {tab === "users" && (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-canopy-200 text-xs uppercase tracking-wide text-canopy-900/45">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Points</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-canopy-100">
                    <td className="py-2.5">{u.name} <span className="text-canopy-900/40">@{u.username}</span></td>
                    <td>{u.email}</td>
                    <td>{u.city ?? "—"}</td>
                    <td>{u.points}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="rounded border border-canopy-200 bg-stone-50 px-2 py-1 text-xs"
                      >
                        <option value="USER">User</option>
                        <option value="DRIVE_LEADER">Drive leader</option>
                        <option value="SCHOOL_ADMIN">School admin</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "drives" && (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-canopy-200 text-xs uppercase tracking-wide text-canopy-900/45">
                  <th className="py-2">Title</th>
                  <th>Leader</th>
                  <th>Participants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d) => (
                  <tr key={d.id} className="border-b border-canopy-100">
                    <td className="py-2.5">{d.title}</td>
                    <td>{d.leader.name}</td>
                    <td>{d._count.participants}</td>
                    <td>
                      <select
                        value={d.status}
                        onChange={(e) => updateDriveStatus(d.id, e.target.value)}
                        className="rounded border border-canopy-200 bg-stone-50 px-2 py-1 text-xs"
                      >
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "reports" && (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-canopy-200 text-xs uppercase tracking-wide text-canopy-900/45">
                  <th className="py-2">Title</th>
                  <th>Reporter</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-canopy-100">
                    <td className="py-2.5">{r.title}</td>
                    <td>{r.reporter.name}</td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => updateReportStatus(r.id, e.target.value)}
                        className="rounded border border-canopy-200 bg-stone-50 px-2 py-1 text-xs"
                      >
                        <option value="OPEN">Open</option>
                        <option value="DRIVE_SCHEDULED">Drive scheduled</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
