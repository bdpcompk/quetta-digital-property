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
      { key: "id", label: "ID", type: "number", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "purpose", label: "Purpose", type: "select", options: ["For Sale", "For Rent"], required: true },
      { key: "type", label: "Type", type: "select", options: PROPERTY_TYPES, required: true },
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
      { key: "noc", label: "NOC Issued", type: "text", placeholder: "12 Jan 2021" },
      { key: "developer", label: "Developer", type: "text" },
      { key: "totalArea", label: "Total Area", type: "text", placeholder: "500 Acres" },
      { key: "resPlots", label: "Residential Plots", type: "text" },
      { key: "comPlots", label: "Commercial Plots", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["approved", "under_process", "not_listed"] },
      { key: "img", label: "Image URL", type: "url" },
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
];

export const ADMIN_EMAIL = "admin@bdpcompk.com";
