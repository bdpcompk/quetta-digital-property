"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, Loader2, Send, MessageSquare } from "lucide-react";
import { useSession } from "@/lib/useSession";

type Review = {
  id: number;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
};

export default function Reviews({
  targetType,
  targetId,
}: {
  targetType: "agent" | "scheme";
  targetId: number;
}) {
  const { session, supabase: sb, name } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!sb) return;
    setLoading(true);
    const { data } = await sb
      .from("reviews")
      .select("id, rating, comment, reviewer_name, created_at")
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }, [sb, targetType, targetId]);

  useEffect(() => {
    const t = setTimeout(() => load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb || !session) return;
    setErr("");
    setMsg("");
    setBusy(true);

    const { error: e1 } = await sb.from("reviews").upsert(
      {
        user_id: session.user.id,
        target_type: targetType,
        target_id: targetId,
        rating,
        comment: comment.trim(),
        reviewer_name: name || "Anonymous",
      },
      { onConflict: "user_id,target_type,target_id" }
    );

    setBusy(false);
    if (e1) setErr(e1.message);
    else {
      setMsg("Review submitted ✓");
      setComment("");
      load();
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[16px] font-extrabold text-navy">
          <MessageSquare size={16} className="text-green" /> Reviews & Ratings
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="text-[15px] font-extrabold text-ink">{avg}</span>
            <span className="text-[12.5px] text-muted">({reviews.length})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-[13px] text-muted">
          <Loader2 size={14} className="animate-spin" /> Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-muted">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-surface p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">{r.reviewer_name}</span>
                <span className="text-[11.5px] text-muted">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-line"}
                  />
                ))}
              </div>
              {r.comment && <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {session ? (
        <form onSubmit={submit} className="mt-5 border-t border-line pt-5">
          <p className="mb-2 text-[13px] font-semibold text-ink">Write a Review</p>
          <div className="mb-2.5 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
              >
                <Star
                  size={22}
                  className={`transition-colors ${
                    s <= (hoverStar || rating) ? "fill-amber-400 text-amber-400" : "text-line"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-green"
          />
          {msg && <p className="mt-2 text-[13px] font-medium text-green">{msg}</p>}
          {err && <p className="mt-2 text-[13px] text-red-600">{err}</p>}
          <button type="submit" disabled={busy} className="btn-primary mt-3">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Submit Review
          </button>
        </form>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-center text-[13px] text-muted">
          <a href="/login/" className="font-semibold text-green hover:underline">Login</a> to write a review.
        </p>
      )}
    </div>
  );
}
