export type RequestRole = "agent" | "owner";

export const ROLE_LABEL: Record<RequestRole, string> = {
  agent: "Agent",
  owner: "Scheme Owner",
};

export const ROLE_DESC: Record<RequestRole, string> = {
  agent: "Real Estate Agent • Broker",
  owner: "Housing Scheme • Developer",
};

export const CITIES = [
  "Quetta",
  "Gwadar",
  "Turbat",
  "Khuzdar",
  "Lasbela",
  "Hub",
  "Chaman",
  "Loralai",
  "Barkhan",
  "Mastung",
  "Kalat",
  "Nushki",
  "Pishin",
  "Killa Abdullah",
  "Zhob",
  "Sibi",
  "Jhelum",
  "Dera Bugti",
  "Harnai",
  "Kachhi",
  "Dalbandin",
  "Bolan",
  "Sanjawi",
  "Qila Saifullah",
  "Bukhari",
  "Moola Chotok",
  "Rajo Khanpur",
  "Lehri",
  "Mastung",
  "Mach",
  "Khanqar",
];

export const AGENCY_TYPES = [
  "Real Estate Broker",
  "Dealer / Property Trader",
  "Builder / Developer",
  "Real Estate Consultant",
  "Property Manager",
  "Commission Agent",
];

export const AUTHORITIES = ["QDA", "BDA", "GDA", "BHTPA", "Other"];

export const DOC_BUCKET = "role-docs";

/** Max sizes (MB) per upload slot, matching the design */
export const DOC_LIMITS = {
  registrationDoc: 5,
  profilePhoto: 2,
  cnicCopy: 5,
  logoDoc: 5,
  extraDocs: 5,
  schemeDocs: 10,
} as const;

export type DocSlot = keyof typeof DOC_LIMITS;

export function isDocSlot(key: string): key is DocSlot {
  return key in DOC_LIMITS;
}

export function docPath(userId: string, slot: string, fileName: string) {
  const safe = fileName.replace(/[^\w.-]/g, "_");
  return `${userId}/${slot}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
}

export const ROLE_STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-400 text-navy",
  approved: "bg-green text-white",
  rejected: "bg-red-500 text-white",
};
