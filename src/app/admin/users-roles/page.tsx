"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck, CheckCircle2, Clock, ExternalLink, FileText, Loader2, UserCog, Users, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
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

export default function AdminUsersRolesPage() {
  const [tab, setTab] = useState<"requests" | "users">("requests");
  const [reqs, setReqs] = useState<Req[]>([]);
  const [filter, setFilter] = useState<"all" | RequestRole>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [roles, setRoles] = useState<{ user_id: string; email: string; role: string }[]>([]);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("role_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setReqs((data as Req[]) || []);
    const { data: rl } = await supabase
      .from("user_roles")
      .select("user_id, email, role")
      .order("role", { ascending: true });
    setRoles((rl as { user_id: string; email: string; role: string }[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, []);

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
      setMsg(`Role updated to ${ROLE_NAME[role]}.`);
      load();
    }
  };

  const pendingCount = reqs.filter((r) => r.status === "pending").length;

  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Users &amp; Roles</h1>
      <p className="mb-5 text-[13px] leading-relaxed text-muted">
        Agent aur Scheme Owner registration requests yahan approve/reject hoti hain. Approve karte
        hi user ka role update ho jata hai aur us ke features (Media &amp; Feature Control) khul
        jate hain.
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
          <Users size={15} /> Users ({roles.length})
        </button>
      </div>

      {msg && (
        <p className="mb-4 rounded-xl bg-green-soft px-4 py-2.5 text-[13px] font-semibold text-green">{msg}</p>
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
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[520px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Current Role</th>
                <th className="px-4 py-3">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {roles.map((u) => (
                <tr key={u.user_id}>
                  <td className="px-4 py-3 font-semibold text-navy">{u.email?.split("@")[0]}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-surface px-2.5 py-1 text-[11.5px] font-bold text-navy">
                      {ROLE_NAME[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-navy outline-none focus:border-green"
                      value={u.role}
                      onChange={(e) => setUserRole(u.user_id, u.email, e.target.value)}
                    >
                      {(["common", "agent", "owner"] as const).map((x) => (
                        <option key={x} value={x}>
                          {ROLE_NAME[x]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

function Info2({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-surface px-3.5 py-2.5">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 break-words text-[13px] font-bold text-navy">{value || "—"}</p>
    </div>
  );
}
