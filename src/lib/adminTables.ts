export type AdminField = {
  key: string;
  label: string;
  type: "text" | "number" | "bool" | "select" | "textarea" | "array" | "url";
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export type AdminTable = {
  name: string;
  title: string;
  singular: string;
  pk: string;
  orderCol: string;
  fields: AdminField[];
};

const PROPERTY_TYPES = [
  "Houses", "Plots", "Flats / Apartments", "Commercial",
  "Agricultural Land", "Shops / Offices", "Farm Houses", "Other",
];

export const ADMIN_TABLES: AdminTable[] = [
  {
    name: "properties",
    title: "Properties",
    singular: "Property",
    pk: "id",
    orderCol: "id",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "purpose", label: "Purpose", type: "select", options: ["For Sale", "For Rent"], required: true },
      { key: "type", label: "Type", type: "select", options: PROPERTY_TYPES, required: true },
      { key: "status", label: "Status", type: "select", options: ["active", "pending"], required: true },
      { key: "price", label: "Price (number)", type: "number", required: true },
      { key: "priceText", label: "Price Display", type: "text", placeholder: "PKR 1,50,00,000" },
      { key: "beds", label: "Beds", type: "number" },
      { key: "baths", label: "Baths", type: "number" },
      { key: "area", label: "Area", type: "text", placeholder: "5 Marla" },
      { key: "district", label: "District", type: "text", required: true },
      { key: "address", label: "Address", type: "text" },
      { key: "agent", label: "Agent Name", type: "text" },
      { key: "agentAvatar", label: "Agent Avatar URL", type: "url" },
      { key: "agentId", label: "Agent ID", type: "number" },
      { key: "img", label: "Cover Image URL", type: "url" },
      { key: "images", label: "Gallery URLs (one per line)", type: "array" },
      { key: "features", label: "Features (one per line)", type: "array" },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "verified", label: "Verified", type: "bool" },
      { key: "featured", label: "Featured", type: "bool" },
    ],
  },
  {
    name: "agents",
    title: "Agents",
    singular: "Agent",
    pk: "id",
    orderCol: "id",
    fields: [
      { key: "id", label: "ID", type: "number", required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "type", label: "Type", type: "text", placeholder: "Real Estate Agency" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "reviews", label: "Reviews", type: "text", placeholder: "120 reviews" },
      { key: "location", label: "Location", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "avatar", label: "Avatar URL / initials source", type: "url" },
      { key: "verified", label: "Verified", type: "bool" },
    ],
  },
  {
    name: "projects",
    title: "New Projects",
    singular: "Project",
    pk: "name",
    orderCol: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Under Development", "Completed", "Launching Soon"] },
      { key: "plotSizes", label: "Plot Sizes", type: "text", placeholder: "5 Marla, 10 Marla" },
      { key: "timeline", label: "Timeline", type: "text" },
      { key: "priceFrom", label: "Price From", type: "text" },
      { key: "img", label: "Image URL", type: "url" },
    ],
  },
  {
    name: "qda_schemes",
    title: "QDA Schemes",
    singular: "QDA Scheme",
    pk: "name",
    orderCol: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "district", label: "District", type: "text" },
      { key: "tehsil", label: "Tehsil", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "noc", label: "NOC Date", type: "text", placeholder: "12 Jan 2021" },
      { key: "developer", label: "Developer", type: "text" },
      { key: "totalArea", label: "Total Area", type: "text", placeholder: "500 Acres" },
      { key: "resPlots", label: "Residential Plots", type: "text" },
      { key: "comPlots", label: "Commercial Plots", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["QDA Approved", "Under Process", "Not Listed"] },
      { key: "img", label: "Image URL", type: "url" },
      { key: "scheme_id", label: "Scheme / Project ID", type: "text" },
      { key: "authority", label: "Relevant Authority", type: "select", options: ["QDA", "GDA", "Other"] },
      { key: "qvc_status", label: "QVC Status", type: "select", options: ["Approved", "Pending", "Rejected", "Not Found", "N/A"] },
      { key: "qvc_number", label: "QVC Number", type: "text" },
      { key: "qvc_date", label: "QVC Date", type: "text", placeholder: "12 Jan 2021" },
      { key: "nrc_status", label: "NRC Status", type: "select", options: ["Approved", "Pending", "Rejected", "Not Found", "N/A"] },
      { key: "nrc_number", label: "NRC Number", type: "text" },
      { key: "nrc_date", label: "NRC Date", type: "text" },
      { key: "pci_status", label: "PC-I Status", type: "select", options: ["Approved", "Not Approved", "N/A"] },
      { key: "noc_status", label: "NOC Status", type: "select", options: ["Valid", "Expired", "Suspended", "Cancelled", "Not Found"] },
      { key: "verification_source", label: "Verification Source", type: "text" },
      { key: "last_verified", label: "Last Verified", type: "text", placeholder: "20-09-2026" },
      { key: "final_status", label: "Final Status", type: "select", options: ["VERIFIED", "UNDER VERIFICATION", "NOT VERIFIED", "REJECTED"], required: true },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "document", label: "Official Document URL", type: "url" },
    ],
  },
  {
    name: "articles",
    title: "Guides & Articles",
    singular: "Article",
    pk: "id",
    orderCol: "id",
    fields: [
      { key: "id", label: "ID", type: "number", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "cat", label: "Category", type: "text", placeholder: "Buying Guide" },
      { key: "tagColor", label: "Tag Color", type: "text", placeholder: "#1a8754" },
      { key: "date", label: "Date", type: "text", placeholder: "Apr 12, 2025" },
      { key: "read", label: "Read Time", type: "text", placeholder: "5 min read" },
      { key: "img", label: "Image URL", type: "url" },
    ],
  },
  {
    name: "districts",
    title: "Districts",
    singular: "District",
    pk: "name",
    orderCol: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "count", label: "Count", type: "text", placeholder: "2,843+" },
      { key: "cover", label: "Cover URL", type: "url" },
    ],
  },
  {
    name: "areas",
    title: "Areas",
    singular: "Area",
    pk: "name",
    orderCol: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "district", label: "District", type: "text", required: true },
      { key: "count", label: "Count", type: "number" },
    ],
  },
  {
    name: "verification_history",
    title: "Verification Log",
    singular: "Log Entry",
    pk: "id",
    orderCol: "id",
    fields: [
      { key: "scheme", label: "Scheme / Project", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: ["VERIFIED", "UNDER VERIFICATION", "NOT VERIFIED", "REJECTED"], required: true },
      { key: "authority", label: "Authority", type: "text" },
      { key: "noc", label: "NOC / Reference No", type: "text" },
      { key: "verified_by", label: "Verified By", type: "text" },
      { key: "source", label: "Source", type: "text" },
    ],
  },
  {
    name: "contact_messages",
    title: "Messages",
    singular: "Message",
    pk: "id",
    orderCol: "id",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "subject", label: "Subject", type: "text" },
      { key: "message", label: "Message", type: "textarea", required: true },
    ],
  },
];

export const ADMIN_EMAIL = "admin@bdpcompk.com";
