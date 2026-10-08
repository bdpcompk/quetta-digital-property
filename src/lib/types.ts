export type District = { name: string; count: string; cover: string };
export type PropertyType = { name: string; count: string; icon: string; color: string; bg: string };
export type Agent = {
  id: number; name: string; type: string; rating: number; reviews: string;
  location: string; verified: boolean; phone: string; email: string; avatar: string;
};
export type Property = {
  id: number; title: string; price: number; priceText: string;
  purpose: "For Sale" | "For Rent"; type: string; beds: number; baths: number;
  area: string; district: string; address: string; agent: string; agentAvatar: string;
  verified: boolean; featured: boolean; img: string; images: string[];
  desc: string; features: string[]; agentId: number | null;
  phone?: string; created_by?: string | null; status?: string;
};
export type Article = {
  id: number; title: string; cat: string; tagColor: string;
  date: string; read: string; img: string;
};
export type Project = {
  name: string; location: string; status: string; plotSizes: string;
  timeline: string; priceFrom: string; img: string;
};
export type QdaScheme = {
  name: string; district: string; noc: string; developer: string;
  totalArea: string; resPlots: string; comPlots: string; img: string; status: string;
  scheme_id?: string; tehsil?: string; location?: string; authority?: string;
  registration_method?: string;
  qvc_status?: string; qvc_number?: string; qvc_date?: string;
  nrc_status?: string; nrc_number?: string; nrc_date?: string;
  pci_status?: string; noc_status?: string;
  verification_source?: string; last_verified?: string;
  final_status?: string; remarks?: string; document?: string;
};
export type VerificationHistory = {
  id: number; scheme: string; status: string; authority: string;
  noc: string; verified_by: string; source: string; created_date: string;
};
export type Scheme = {
  id: number; name: string; location: string; map_link: string;
  owner_name: string; owner_phone: string; noc_status: string;
  authority: string; noc_number: string; registration_method: string;
  facilities: string[]; price_total: number; price_advance: number;
  price_monthly: number; photos: string[]; status: string;
  verified: boolean; created_by?: string | null;
  total_area?: string; total_plots?: string; development_status?: string;
};
export type Area = { name: string; district: string; count: number };
