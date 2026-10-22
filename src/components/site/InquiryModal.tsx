"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InquiryModal({
  open,
  onClose,
  propertyId,
  ownerId,
  title,
}: {
  open: boolean;
  onClose: () => void;
  propertyId?: number;
  ownerId?: string | null;
  title?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const close = () => {
    setDone(false);
    setName("");
    setPhone("");
    setMessage("");
    setErr(null);
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = supabase;
    if (!sb) {
      setErr("Service unavailable — try again later.");
      return;
    }
    setBusy(true);
    setErr(null);
    const { error } = await sb.from("inquiries").insert({
      property_id: propertyId ?? null,
      owner_id: ownerId ?? null,
      name,
      phone,
      message,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-deep/60 sm:items-center sm:p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-[440px] rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[17px] font-extrabold text-navy">Send an Inquiry</h3>
            <p className="mt-0.5 truncate text-[12px] text-muted">{title}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto text-green" size={40} />
            <p className="mt-3 text-[14px] font-bold text-navy">Inquiry bhej di gayi!</p>
            <p className="mt-1 text-[12px] text-muted">Agent aap se jald rabta karega.</p>
            <button
              type="button"
              onClick={close}
              className="mt-4 rounded-xl bg-green px-5 py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-green-dark"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label className="field-label">Your Name *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                placeholder="e.g. Ahmed Khan"
              />
            </div>
            <div>
              <label className="field-label">Phone Number *</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field"
                placeholder="03XX-XXXXXXX"
              />
            </div>
            <div>
              <label className="field-label">Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="field resize-none"
                placeholder="I am interested in this property..."
              />
            </div>
            {err && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[11.5px] text-red-600">{err}</p>
            )}
            <button
              disabled={busy}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green py-3 text-[13px] font-bold text-white transition-colors hover:bg-green-dark disabled:opacity-60"
            >
              {busy && <Loader2 size={15} className="animate-spin" />} Send Inquiry
            </button>
            <p className="text-center text-[10.5px] text-muted">
              Aap ka number sirf is agent ke sath share hoga.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
