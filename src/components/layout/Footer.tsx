import Link from "next/link";
import { Building2 } from "lucide-react";

const SOCIAL_PATHS = [
  {
    href: "#",
    label: "Facebook",
    d: "M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.2l.5-3H13v-1.2c0-.5.2-.8.5-.8z",
  },
  {
    href: "#",
    label: "Twitter / X",
    d: "M4 4l6.3 8.2L4.3 20h2.1l5-5.6L15.6 20H20l-6.6-8.6L18.9 4h-2.1l-4.5 5.1L8.4 4H4z",
  },
  {
    href: "#",
    label: "Instagram",
    d: "M12 8.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8zm0 5.3a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM17 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm1.9 13a1.9 1.9 0 0 1-1.9 1.9H7A1.9 1.9 0 0 1 5.1 17V7A1.9 1.9 0 0 1 7 5.1h10A1.9 1.9 0 0 1 18.9 7v10zm-2.7-9.9a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z",
  },
  {
    href: "#",
    label: "YouTube",
    d: "M21.6 8s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4.9 12 4.9 12 4.9h0s-4 0-6.8.2c-.4 0-1.3.1-2 .9-.6.6-.8 2-.8 2S2.2 9.6 2.2 11.3v1.4c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.7.7 2.1.8 1.6.2 6.7.2 6.7.2s4 0 6.8-.2c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.4c0-1.6-.2-3.2-.2-3.2zM9.9 14.6V9.4l5.2 2.6-5.2 2.6z",
  },
  {
    href: "#",
    label: "LinkedIn",
    d: "M6.9 8.6H4.1V20h2.8V8.6zM5.5 7.4a1.6 1.6 0 1 0 0-3.3 1.6 1.6 0 0 0 0 3.3zM20 13.6c0-2.8-1.5-4.1-3.5-4.1-1.6 0-2.3.9-2.7 1.5V8.6H11V20h2.8v-6c0-1.3.6-2.1 1.8-2.1s1.7.8 1.7 2.1v6H20v-6.4z",
  },
];

const COLS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Buy", href: "/listings/" },
      { label: "Rent", href: "/listings/?purpose=rent" },
      { label: "Sell", href: "/sell/" },
      { label: "Property Schemes", href: "/schemes/" },
      { label: "Agents", href: "/agents/" },
      { label: "Mortgage Calculator", href: "/mortgage/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "New Projects", href: "/projects/" },
      { label: "Areas & Locations", href: "/areas/" },
      { label: "Property Guides", href: "/guides/" },
      { label: "Blog", href: "/guides/" },
      { label: "Contact Us", href: "/contact/" },
    ],
  },
  {
    title: "Our Coverage",
    links: [
      { label: "All Districts (36)", href: "/areas/" },
      { label: "Quetta", href: "/listings/?district=Quetta" },
      { label: "Gwadar", href: "/listings/?district=Gwadar" },
      { label: "Turbat", href: "/listings/?district=Turbat" },
      { label: "Khuzdar", href: "/listings/?district=Khuzdar" },
      { label: "View All Districts →", href: "/areas/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy-deep text-white">
      <div className="wrap py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green">
                <Building2 size={19} />
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-extrabold">Balochistan Property Portal</span>
                <span className="text-[10.5px] text-white/50">Your Trusted Property Marketplace</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/60">
              Pakistan&apos;s most trusted property portal for buying, renting and selling properties
              across all districts of Balochistan.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIAL_PATHS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-green hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={s.d} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-white/60 transition-colors hover:text-green"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-bold">Download Our App</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { top: "GET IT ON", bottom: "Google Play", icon: "▶" },
                { top: "Download on the", bottom: "App Store", icon: "" },
              ].map((s) => (
                <a
                  key={s.bottom}
                  href="#"
                  className="flex w-[150px] items-center gap-2.5 rounded-lg border border-white/20 bg-black px-3 py-2 transition-all hover:border-green"
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="leading-tight">
                    <span className="block text-[8.5px] uppercase tracking-wide text-white/55">
                      {s.top}
                    </span>
                    <span className="block text-[13px] font-bold">{s.bottom}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-white/50 md:flex-row">
          <span>© 2025 Balochistan Property Portal. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
          <span className="text-green/80">Together for a Stronger Balochistan</span>
        </div>
      </div>
    </footer>
  );
}
