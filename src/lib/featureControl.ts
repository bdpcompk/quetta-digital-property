export type RoleId = "common" | "agent" | "owner";

export type FeatureId =
  | "image_upload"
  | "video_upload"
  | "location_map"
  | "featured_ads"
  | "scheme_listing"
  | "contact_display"
  | "whatsapp_button"
  | "video_gallery";

export const ROLES: { id: RoleId; label: string; sub: string; tone: string }[] = [
  { id: "common", label: "Common Person", sub: "(Aam User)", tone: "green" },
  { id: "agent", label: "Agent", sub: "(Property Agent)", tone: "blue" },
  { id: "owner", label: "Owner", sub: "(Scheme/Project Owner)", tone: "purple" },
];

export const FEATURES: { id: FeatureId; label: string; desc: string }[] = [
  { id: "image_upload", label: "Image Upload (Photos)", desc: "Tasveer upload karne ki ijazat" },
  { id: "video_upload", label: "Video Upload", desc: "Video upload karne ki ijazat" },
  { id: "location_map", label: "Location / Map", desc: "Property location add karne ki ijazat" },
  { id: "featured_ads", label: "Featured Ads", desc: "Paid featured listing ka option" },
  { id: "scheme_listing", label: "Scheme Listing", desc: "Housing scheme / project add karne ki ijazat" },
  { id: "contact_display", label: "Contact Details Display", desc: "Phone / WhatsApp / Email show karna" },
  { id: "whatsapp_button", label: "Direct WhatsApp Button", desc: "Seedha WhatsApp se contact" },
  { id: "video_gallery", label: "Video Gallery in Listing", desc: "Video gallery section show karna" },
];

export const roleKey = (role: RoleId, feature: FeatureId) => `fc_role_${role}_${feature}`;
export const globalKey = (feature: FeatureId) => `fc_global_${feature}`;

/** Feature -> legacy app_settings key kept in sync for existing components */
export const LEGACY_KEY: Partial<Record<FeatureId, string>> = {
  video_upload: "video_upload_enabled",
  whatsapp_button: "whatsapp_enabled",
};

export const MEDIA_KEYS = {
  maxImageMb: "media_max_image_mb",
  imageFormats: "media_image_formats",
  maxImages: "media_max_images",
  maxVideoMb: "media_max_video_mb",
  videoFormats: "media_video_formats",
  maxVideos: "media_max_videos",
  maxDuration: "media_max_duration",
  autoCompress: "media_autocompress",
  thumbnail: "media_thumbnail",
} as const;

export const MEDIA_DEFAULTS: Record<string, string> = {
  [MEDIA_KEYS.maxImageMb]: "5",
  [MEDIA_KEYS.imageFormats]: "JPG, PNG, JPEG, WEBP",
  [MEDIA_KEYS.maxImages]: "20",
  [MEDIA_KEYS.maxVideoMb]: "100",
  [MEDIA_KEYS.videoFormats]: "MP4, MOV, WEBM",
  [MEDIA_KEYS.maxVideos]: "5",
  [MEDIA_KEYS.maxDuration]: "5",
  [MEDIA_KEYS.autoCompress]: "on",
  [MEDIA_KEYS.thumbnail]: "on",
};

export const ROLE_DEFAULTS: Record<string, string> = {
  [roleKey("common", "image_upload")]: "on",
  [roleKey("common", "video_upload")]: "on",
  [roleKey("common", "location_map")]: "on",
  [roleKey("common", "featured_ads")]: "on",
  [roleKey("common", "scheme_listing")]: "off",
  [roleKey("common", "contact_display")]: "on",
  [roleKey("common", "whatsapp_button")]: "on",
  [roleKey("common", "video_gallery")]: "off",
  [roleKey("agent", "image_upload")]: "on",
  [roleKey("agent", "video_upload")]: "on",
  [roleKey("agent", "location_map")]: "on",
  [roleKey("agent", "featured_ads")]: "on",
  [roleKey("agent", "scheme_listing")]: "on",
  [roleKey("agent", "contact_display")]: "on",
  [roleKey("agent", "whatsapp_button")]: "on",
  [roleKey("agent", "video_gallery")]: "on",
  [roleKey("owner", "image_upload")]: "on",
  [roleKey("owner", "video_upload")]: "on",
  [roleKey("owner", "location_map")]: "on",
  [roleKey("owner", "featured_ads")]: "on",
  [roleKey("owner", "scheme_listing")]: "on",
  [roleKey("owner", "contact_display")]: "on",
  [roleKey("owner", "whatsapp_button")]: "on",
  [roleKey("owner", "video_gallery")]: "on",
};

export const GLOBAL_DEFAULTS: Record<string, string> = {
  [globalKey("image_upload")]: "on",
  [globalKey("video_upload")]: "on",
  [globalKey("location_map")]: "on",
  [globalKey("featured_ads")]: "on",
  [globalKey("scheme_listing")]: "on",
  [globalKey("contact_display")]: "on",
  [globalKey("whatsapp_button")]: "on",
  [globalKey("video_gallery")]: "on",
};

/** Features shown in the "Role-wise Media Access" status table */
export const ACCESS_COLUMNS: { id: FeatureId; label: string }[] = [
  { id: "image_upload", label: "Photos" },
  { id: "video_upload", label: "Video" },
  { id: "location_map", label: "Location" },
  { id: "scheme_listing", label: "Scheme" },
  { id: "featured_ads", label: "Featured" },
];
