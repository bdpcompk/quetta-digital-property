"use client";

import MediaViewer, { type ViewerSidebarItem, type ViewerTab } from "@/components/site/MediaViewer";
import type { Property } from "@/lib/types";

export type { ViewerTab } from "@/components/site/MediaViewer";

type AgentInfo = {
  name: string;
  sub: string;
  avatar: string;
  verified?: boolean;
};

type PropertyViewerProps = {
  open: boolean;
  tab: ViewerTab;
  onTabChange: (tab: ViewerTab) => void;
  onClose: () => void;
  title: string;
  images: string[];
  videoUrls: string[];
  videoThumb?: string | null;
  district: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  showMap: boolean;
  agent: AgentInfo;
  similar: Property[];
};

export default function PropertyViewer({
  agent,
  similar,
  ...rest
}: PropertyViewerProps) {
  const sidebarItems: ViewerSidebarItem[] = similar.map((s) => ({
    key: s.id,
    href: `/property/?id=${s.id}`,
    img: s.img,
    title: s.title,
    sub: s.priceText,
  }));

  return (
    <MediaViewer
      {...rest}
      videoFallbackLabel="Watch Property Video"
      sidebarHeading="Other Properties"
      sidebarMeta={{ label: "Agent", value: agent.name, verified: agent.verified }}
      sidebarItems={sidebarItems}
      sidebarEmpty="No other properties yet."
      sidebarFooterLabel="View all properties"
      sidebarFooterHref="/listings/"
    />
  );
}
