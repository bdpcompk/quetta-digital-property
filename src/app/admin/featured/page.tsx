import FeaturedAdsManager from "@/components/admin/FeaturedAdsManager";

export default function FeaturedAdsPage() {
  return (
    <div>
      <h1 className="mb-1 text-[22px] font-extrabold text-navy">Featured Ads</h1>
      <p className="mb-5 text-[13px] text-muted">
        Kisi bhi property ko featured mark karein — wo homepage carousel aur search mein upar dikhegi.
      </p>
      <FeaturedAdsManager />
    </div>
  );
}