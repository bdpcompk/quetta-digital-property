"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck, Ban, CheckCircle2, Clock, ExternalLink, FileText, Loader2, ShieldCheck,
  Trash2, UserCog, Users, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLiveRefresh } from "@/lib/useLiveRefresh";
import { ROLE_LABEL, ROLE_STATUS_STYLE, type RequestRole } from "@/lib/roleRequests";

type Req = {
  id: number;
  user_id: string;
  email: string;
  requested_role: RequestRole;
  full_name?: string | null;
  phone?: string | null;
  cnic?: string | null;
  address?: string | null;
  city?: string | null;
  agency_name?: string | null;
  agency_type?: string | null;
  experience?: string | null;
  owner_org?: string | null;
  contact_person?: string | null;
  scheme_name?: string | null;
  scheme_location?: string | null;
  authority?: string | null;
  noc_number?: string | null;
  registration_doc?: string | null;
  profile_photo?: string | null;
  cnic_copy?: string | null;
  logo_doc?: string | null;
  extra_docs?: string | null;
  notes?: string | null;
  status: string;
  admin_note?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string | null;
};

const DOC_FIELDS: { key: keyof Req; label: string }[] = [
  { key: "registration_doc", label: "Authority / License" },
  { key: "cnic_copy", label: "CNIC / NOC" },
  { key: "logo_doc", label: "Logo" },
  { key: "profile_photo", label: "Photo" },
  { key: "extra_docs", label: "Extra docs" },
];

type Account = {
  user_id: string;
  email: string;
  role: string;
  blocked: boolean;
  created_at?: string | null;
  last_sign_in_at?: string | null;
};

type PaymentLite = {
  user_id: string | null;
  plan: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function AdminUsersRolesPage() {
  const [tab, setTab] = useState<"requests" | "users">("requests");
  const [roleFilter, setRoleFilter] = useState<"all" | "agent" | "owner" | "common">("all");
  const [reqs, setReqs] = useState<Req[]>([]);
  const [filter, setFilter] = useState<"all" | RequestRole>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [payments, setPayments] = useState<PaymentLite[]>([]);
  const [busyUser, setBusyUser] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<Account | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "users") setTab("users");
    const role = params.get("role");
    if (role === "agent" || role === "owner" || role === "common") {
      setRoleFilter(role);
    }
  }, []);

  const load = async (silent = false) => {
    if (!supabase) return;
    if (!silent) setLoading(true);
    const { data } = await supabase
      .from("role_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setReqs((data as Req[]) || []);

    const [accRes, payRes, rlRes] = await Promise.all([
      supabase.rpc("admin_list_users"),
      supabase
        .from("payments")
        .select("user_id, plan, amount, status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("user_roles")
        .select("user_id, email, role")
        .order("role", { ascending: true }),
    ]);

    if (Array.isArray(accRes.data)) {
      setAccounts(accRes.data as Account[]);
    } else {
      setAccounts(
        ((rlRes.data as Account[]) || []).map((x) => ({ ...x, blocked: Boolean(x.blocked) })),
      );
    }
    setPayments((payRes.data as PaymentLite[]) || []);
    setLoading(false);
  };

  useLiveRefresh(["role_requests", "user_roles"], () => load(true), { pollMs: 10000 });

  const shown = filter === "all" ? reqs : reqs.filter((r) => r.requested_role === filter);

  const approve = async (r: Req) => {
    if (!supabase) return;
    setBusyId(r.id);
    setMsg("");
    try {
      // 1. user role update
      const { error: e1 } = await supabase
        .from("user_roles")
        .upsert({ user_id: r.user_id, email: r.email, role: r.requested_role });
      if (e1) throw new Error(e1.message);

      // 2. agent directory entry
      if (r.requested_role === "agent") {
        const { data: existing } = await supabase
          .from("agents")
          .select("id")
          .eq("user_id", r.user_id)
          .maybeSingle();
        if (!existing) {
          const { error: e2 } = await supabase.from("agents").insert({
            name: r.full_name || r.email || "Agent",
            type: r.agency_type || "Agent",
            rating: 5,
            reviews: "0",
            location: r.city || "",
            verified: true,
            phone: r.phone || "",
            email: r.email || "",
            avatar: r.profile_photo || "",
            user_id: r.user_id,
          });
          if (e2) throw new Error(e2.message);
        }
      }

      // 3. mark request approved
      const { error: e3 } = await supabase
        .from("role_requests")
        .update({
          status: "approved",
          admin_note: note || null,
          reviewed_by: "Admin",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", r.id);
      if (e3) throw new Error(e3.message);

      setMsg(`Approved — ${r.full_name || r.email} is now ${ROLE_LABEL[r.requested_role]}.`);
      setOpenId(null);
      setNote("");
      load();
    } catch (e) {
      setMsg("Could not approve: " + (e as Error).message);
    }
    setBusyId(null);
  };

  const reject = async (r: Req) => {
    if (!supabase) return;
    setBusyId(r.id);
    setMsg("");
    const { error } = await supabase
      .from("role_requests")
      .update({
        status: "rejected",
        admin_note: note || null,
        reviewed_by: "Admin",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", r.id);
    if (error) setMsg("Could not reject: " + error.message);
    else {
      setMsg(`Rejected — ${r.full_name || r.email}.`);
      setOpenId(null);
      setNote("");
    }
    load();
    setBusyId(null);
  };

  const setUserRole = async (userId: string, email: string, role: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, email, role });
    if (error) setMsg("Could not update role: " + error.message);
    else {
      setAccounts((prev) => prev.map((a) => (a.user_id === userId ? { ...a, role } : a)));
      setMsg(`Role updated to ${ROLE_NAME[role]}.`);
      load(true);
    }
  };

  const setBlocked = async (u: Account, blocked: boolean) => {
    if (!supabase) return;
    setBusyUser(u.user_id);
    setMsg("");
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: u.user_id, email: u.email, role: u.role, blocked });
    setBusyUser(null);
    if (error) {
      setMsg("Could not update: " + error.message);
      return;
    }
    setAccounts((prev) =>
      prev.map((a) => (a.user_id === u.user_id ? { ...a, blocked } : a)),
    );
    setMsg(
      blocked
        ? `${u.email} blocked — payment na aane tak login nahi kar sakega.`
        : `${u.email} unblocked — ab login kar sakta hai.`,
    );
  };

  const deleteAccount = async () => {
    if (!supabase || !confirmDel) return;
    setBusyUser(confirmDel.user_id);
    setMsg("");
    const { error } = await supabase.rpc("admin_delete_user", {
      target: confirmDel.user_id,
    });
    setBusyUser(null);
    if (error) {
      setMsg("Could not delete: " + error.message);
      return;
    }
    setMsg(`${confirmDel.email} permanently deleted.`);
    setConfirmDel(null);
    load(true);
  };

  const latestPay = useMemo(() => {
    const map = new Map<string, PaymentLite>();
    for (const p of payments) {
      if (p.user_id && !map.has(p.user_id)) map.set(p.user_id, p);
    }
    return map;
  }, [payments]);

  const shownAccounts = useMemo(
    () =>
      roleFilter === "all"
        ? accounts
        : accounts.filter((a) => a.role === roleFilter),
    [accounts, roleFilter],
  );

  const roleCounts = useMemo(
    () => ({
      all: accounts.length,
      agent: accounts.filter((a) => a.role === "agent").length,
      owner: accounts.filter((a) => a.role === "owner").length,
      common: accounts.filter((a) => a.role === "common").length,
    }),
    [accounts],
  );

  const pendingCount = reqs.filter((r) => r.status === "pending").length;

  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Users &amp; Roles</h1>
      <p className="mb-5 text-[13px] leading-relaxed text-muted">
        Agent aur Scheme Owner registration requests yahan approve/reject hoti hain. Approve karte
        hi user ka role update ho jata hai aur us ke features (Media &amp; Feature Control) khul
        jate hain. <strong className="text-navy">Users</strong> tab mein Agents / Scheme Owners
        filter se unke accounts ko <strong className="text-navy">Block / Unblock / Delete</strong>{" "}
        bhi kar sakte hain.
      </p>

      <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-line bg-white p-1">
        <button
          onClick={() => setTab("requests")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13.5px] font-semibold transition-colors ${
            tab === "requests" ? "bg-navy text-white" : "text-muted hover:text-ink"
          }`}
        >
          <UserCog size={15} /> Role Requests
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-extrabold text-navy">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("users")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13.5px] font-semibold transition-colors ${
            tab === "users" ? "bg-navy text-white" : "text-muted hover:text-ink"
          }`}
        >
          <Users size={15} /> Users ({accounts.length})
        </button>
      </div>

      {msg && (
        <p
          className={`mb-4 rounded-xl px-4 py-2.5 text-[13px] font-semibold ${
            msg.startsWith("Could not") ? "bg-red-50 text-red-600" : "bg-green-soft text-green"
          }`}
        >
          {msg}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-green" size={28} />
        </div>
      ) : tab === "requests" ? (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {(["all", "agent", "owner"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors ${
                  filter === f ? "bg-green text-white" : "border border-line bg-white text-muted hover:text-navy"
                }`}
              >
                {f === "all" ? "All Requests" : ROLE_LABEL[f]}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="rounded-2xl border border-line bg-white px-6 py-14 text-center text-[14px] text-muted">
              Abhi koi registration request nahi aayi.
            </p>
          ) : (
            <div className="space-y-3">
              {shown.map((r) => (
                <div key={r.id} className="rounded-2xl border border-line bg-white">
                  <button
                    onClick={() => {
                      setOpenId(openId === r.id ? null : r.id);
                      setNote(r.admin_note || "");
                    }}
                    className="flex w-full flex-wrap items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase ${
                        ROLE_STATUS_STYLE[r.status] ?? "bg-slate-500 text-white"
                      }`}
                    >
                      {r.status === "pending" ? (
                        <Clock size={11} />
                      ) : r.status === "approved" ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <X size={11} />
                      )}
                      {r.status}
                    </span>
                    <span className="text-[14px] font-bold text-navy">
                      {r.full_name || r.email}
                    </span>
                    <span className="rounded-lg bg-surface px-2.5 py-1 text-[11.5px] font-bold text-navy">
                      {ROLE_LABEL[r.requested_role]}
                    </span>
                    <span className="text-[12.5px] text-muted">{r.email}</span>
                    <span className="ms-auto text-[12px] text-muted">
                      {r.created_at ? new Date(r.created_at).toLocaleString("en-GB") : ""}
                    </span>
                  </button>

                  {openId === r.id && (
                    <div className="border-t border-line px-4 py-4">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <Info2 label="Full Name" value={r.full_name} />
                        <Info2 label="Email" value={r.email} />
                        <Info2 label="Phone" value={r.phone} />
                        <Info2 label="CNIC" value={r.cnic} />
                        <Info2 label="City" value={r.city} />
                        <Info2 label="Address" value={r.address} />
                        {r.requested_role === "agent" ? (
                          <>
                            <Info2 label="Agency" value={r.agency_name} />
                            <Info2 label="Business Type" value={r.agency_type} />
                            <Info2 label="Experience" value={r.experience} />
                          </>
                        ) : (
                          <>
                            <Info2 label="Owner / Organization" value={r.owner_org} />
                            <Info2 label="Contact Person" value={r.contact_person} />
                            <Info2 label="Scheme Name" value={r.scheme_name} />
                            <Info2 label="Scheme Location" value={r.scheme_location} />
                            <Info2 label="Authority" value={r.authority} />
                            <Info2 label="NOC Number" value={r.noc_number} />
                          </>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {DOC_FIELDS.map((d) => {
                          const url = r[d.key] as string | null;
                          if (!url) return null;
                          return (
                            <a
                              key={d.key as string}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-[12.5px] font-semibold text-navy hover:border-green hover:text-green"
                            >
                              <FileText size={14} className="text-green" /> {d.label}
                              <ExternalLink size={12} />
                            </a>
                          );
                        })}
                        {r.profile_photo && (
                          <img src={r.profile_photo} alt="" className="h-11 w-11 rounded-lg border border-line object-cover" />
                        )}
                      </div>

                      <div className="mt-4">
                        <label className="mb-1.5 block text-[12px] font-semibold text-muted">
                          Admin note (user ko dikhta hai)
                        </label>
                        <input
                          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-[13px] outline-none focus:border-green"
                          placeholder="e.g. CNIC image blurry — dobara upload karein"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>

                      {r.status === "pending" ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => approve(r)}
                            disabled={busyId === r.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-green-dark disabled:opacity-60"
                          >
                            {busyId === r.id ? <Loader2 size={14} className="animate-spin" /> : <BadgeCheck size={15} />}
                            Approve
                          </button>
                          <button
                            onClick={() => reject(r)}
                            disabled={busyId === r.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                          >
                            <X size={15} /> Reject
                          </button>
                        </div>
                      ) : (
                        <p className="mt-3 text-[12.5px] text-muted">
                          Reviewed by {r.reviewed_by || "Admin"}
                          {r.reviewed_at ? ` • ${new Date(r.reviewed_at).toLocaleString("en-GB")}` : ""}
                          {r.admin_note ? ` • ${r.admin_note}` : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {(["all", "agent", "owner", "common"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors ${
                  roleFilter === f
                    ? "bg-green text-white"
                    : "border border-line bg-white text-muted hover:text-navy"
                }`}
              >
                {f === "all"
                  ? "All Accounts"
                  : f === "agent"
                    ? "Agents"
                    : f === "owner"
                      ? "Scheme Owners"
                      : "Common Users"}{" "}
                ({roleCounts[f]})
              </button>
            ))}
          </div>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[760px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shownAccounts.map((u) => {
                const pay = latestPay.get(u.user_id);
                const isAdmin = u.email === "bdpcompk@gmail.com";
                return (
                  <tr key={u.user_id} className={u.blocked ? "bg-red-50/40" : undefined}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy">{u.email?.split("@")[0]}</p>
                      <p className="text-[12px] text-muted">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-navy outline-none focus:border-green disabled:opacity-60"
                        value={u.role}
                        disabled={isAdmin}
                        onChange={(e) => setUserRole(u.user_id, u.email, e.target.value)}
                      >
                        {(["common", "agent", "owner"] as const).map((x) => (
                          <option key={x} value={x}>
                            {ROLE_NAME[x]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <PaymentChip pay={pay} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                          u.blocked ? "bg-red-500 text-white" : "bg-green-soft text-green"
                        }`}
                      >
                        {u.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <p className="text-right text-[12px] font-semibold text-muted">Admin</p>
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setBlocked(u, !u.blocked)}
                            disabled={busyUser === u.user_id}
                            title={
                              u.blocked
                                ? "Unblock — payment milne ke baad"
                                : "Block — charges/payment pending"
                            }
                            className={`rounded-lg border p-1.5 transition-colors disabled:opacity-50 ${
                              u.blocked
                                ? "border-green/50 bg-green-soft text-green hover:bg-green hover:text-white"
                                : "border-red-300 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                            }`}
                          >
                            {busyUser === u.user_id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : u.blocked ? (
                              <ShieldCheck size={14} />
                            ) : (
                              <Ban size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDel(u)}
                            disabled={busyUser === u.user_id}
                            title="Delete account permanently"
                            className="rounded-lg border border-line p-1.5 text-muted transition-colors hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {shownAccounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    Is role mein koi account nahi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-deep/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-[15px] font-bold text-navy">Delete account permanently?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">{confirmDel.email}</span> ka account,
              agent listing aur data delete ho jayega. Ye action undo nahi hota.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmDel(null)} className="btn-ghost">
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={busyUser === confirmDel.user_id}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busyUser === confirmDel.user_id && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ROLE_NAME: Record<string, string> = {
  common: "Common Person",
  agent: "Agent",
  owner: "Scheme Owner",
};

function PaymentChip({ pay }: { pay?: PaymentLite }) {
  if (!pay) {
    return (
      <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-muted">
        Unpaid
      </span>
    );
  }
  const cls =
    pay.status === "approved"
      ? "bg-green-soft text-green"
      : pay.status === "pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-50 text-red-600";
  return (
    <span className={`inline-flex flex-col rounded-lg px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      <span>{pay.status === "approved" ? "Paid" : pay.status}</span>
      <span className="text-[10px] font-medium opacity-80">
        {pay.plan} · PKR {Number(pay.amount || 0).toLocaleString()}
      </span>
    </span>
  );
}

function Info2({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-surface px-3.5 py-2.5">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 break-words text-[13px] font-bold text-navy">{value || "—"}</p>
    </div>
  );
}
