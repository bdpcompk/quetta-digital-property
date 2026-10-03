import type {
  District, PropertyType, Agent, Property, Article, Project, QdaScheme, Area,
  VerificationHistory, Scheme,
} from "./types";
import { supabase } from "./supabase";

export const DISTRICTS: District[] = [
  { name: "Quetta", count: "2,843+", cover: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600" },
  { name: "Gwadar", count: "1,105+", cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
  { name: "Turbat", count: "1,245+", cover: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600" },
  { name: "Khuzdar", count: "962+", cover: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600" },
  { name: "Chaman", count: "754+", cover: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" },
  { name: "Panjgur", count: "512+", cover: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600" },
  { name: "Lasbela", count: "478+", cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" },
  { name: "Sibi", count: "435+", cover: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600" },
  { name: "Zhob", count: "389+", cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { name: "Kech", count: "356+", cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" },
];

export const TYPES: PropertyType[] = [
  { name: "Houses", count: "12,458+", icon: "home", color: "#3b82f6", bg: "#eff6ff" },
  { name: "Plots", count: "8,742+", icon: "map", color: "#8b5cf6", bg: "#f5f3ff" },
  { name: "Flats / Apartments", count: "2,156+", icon: "building", color: "#f59e0b", bg: "#fffbeb" },
  { name: "Commercial", count: "1,893+", icon: "store", color: "#ef4444", bg: "#fef2f2" },
  { name: "Agricultural Land", count: "1,245+", icon: "leaf", color: "#22c55e", bg: "#f0fdf4" },
  { name: "Shops / Offices", count: "986+", icon: "briefcase", color: "#ec4899", bg: "#fdf2f8" },
  { name: "Farm Houses", count: "423+", icon: "warehouse", color: "#14b8a6", bg: "#f0fdfa" },
  { name: "Other", count: "312+", icon: "grid", color: "#6366f1", bg: "#eef2ff" },
];

export const AGENTS: Agent[] = [
  { id: 1, name: "Baloch Real Estate", type: "Real Estate Agency", rating: 4.8, reviews: "120 reviews", location: "Quetta, Balochistan", verified: true, phone: "+92-321-1234567", email: "info@balochre.com", avatar: "BR" },
  { id: 2, name: "Ocean View Properties", type: "Real Estate Agency", rating: 4.7, reviews: "98 reviews", location: "Gwadar, Balochistan", verified: true, phone: "+92-333-9876543", email: "info@oceanview.com", avatar: "OV" },
  { id: 3, name: "Skyline Properties", type: "Real Estate Agency", rating: 4.6, reviews: "76 reviews", location: "Quetta, Balochistan", verified: true, phone: "+92-345-5551234", email: "info@skyline.com", avatar: "SP" },
  { id: 4, name: "Baloch Land Agency", type: "Real Estate Agency", rating: 4.9, reviews: "67 reviews", location: "Kech, Balochistan", verified: true, phone: "+92-300-1112233", email: "info@balochland.com", avatar: "BL" },
];

export const PROPERTIES: Property[] = [
  {
    id: 1, title: "5 Marla House for Sale", price: 15000000, priceText: "PKR 1,50,00,000", purpose: "For Sale", type: "Houses",
    beds: 5, baths: 4, area: "5 Marla", district: "Quetta", address: "Satellite Town, Quetta, Balochistan",
    agent: "Baloch Real Estate", agentAvatar: "BR", verified: true, featured: true,
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ],
    desc: "Beautiful 5 marla house located in the heart of Satellite Town, Quetta. This property features modern construction with high-quality materials, marble flooring, and a spacious layout. Perfect for families looking for a comfortable home in a prime location.",
    features: ["Marble Flooring", "Car Parking", "Water Tank", "Boundary Wall", "Gas", "Electricity", "Near School", "Near Hospital"],
    agentId: 1,
  },
  {
    id: 2, title: "10 Marla Plot for Sale", price: 7500000, priceText: "PKR 75,00,000", purpose: "For Sale", type: "Plots",
    beds: 0, baths: 0, area: "10 Marla", district: "Gwadar", address: "Gwadar, Balochistan",
    agent: "Ocean View Properties", agentAvatar: "OV", verified: true, featured: true,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    ],
    desc: "Prime 10 marla plot in Gwadar, a rapidly developing area under CPEC. Excellent investment opportunity with great future appreciation potential.",
    features: ["Corner Plot", "Road Access", "Electricity", "Water", "Near Sea"],
    agentId: 2,
  },
  {
    id: 3, title: "2 Bed Flat for Rent", price: 35000, priceText: "PKR 35,000", purpose: "For Rent", type: "Flats / Apartments",
    beds: 2, baths: 2, area: "1,250 Sq.ft", district: "Quetta", address: "Jinnah Town, Quetta, Balochistan",
    agent: "Skyline Properties", agentAvatar: "SP", verified: true, featured: true,
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    desc: "Well-furnished 2 bed flat available for rent in Jinnah Town. Modern kitchen, attached bathrooms, and balcony with mountain views.",
    features: ["Furnished", "AC", "Parking", "Lift", "Security"],
    agentId: 3,
  },
  {
    id: 4, title: "50 Acres Agricultural Land", price: 12000000, priceText: "PKR 1,20,00,000", purpose: "For Sale", type: "Agricultural Land",
    beds: 0, baths: 0, area: "50 Acres", district: "Kech", address: "Turbat, Kech, Balochistan",
    agent: "Baloch Land Agency", agentAvatar: "BL", verified: true, featured: true,
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    images: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    ],
    desc: "50 acres of fertile agricultural land in Kech district. Ideal for farming, orchards, or investment. Water source nearby.",
    features: ["Water Source", "Fertile Land", "Road Access", "Clear Title"],
    agentId: 4,
  },
  {
    id: 5, title: "Commercial Building for Sale", price: 35000000, priceText: "PKR 3,50,00,000", purpose: "For Sale", type: "Commercial",
    beds: 0, baths: 5, area: "5 Marla", district: "Panjgur", address: "Panjgur, Balochistan",
    agent: "Elite Properties", agentAvatar: "EP", verified: true, featured: false,
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    ],
    desc: "Commercial building in prime location of Panjgur. Ground floor shops and upper floor offices. High rental yield potential.",
    features: ["Main Road", "High Footfall", "Parking", "Commercial Zone"],
    agentId: 1,
  },
  {
    id: 6, title: "3 Bed House for Rent", price: 45000, priceText: "PKR 45,000", purpose: "For Rent", type: "Houses",
    beds: 3, baths: 3, area: "8 Marla", district: "Panjgur", address: "Panjgur, Balochistan",
    agent: "Horizon Estate", agentAvatar: "HE", verified: true, featured: false,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    desc: "Spacious 3 bed house for rent in Panjgur. Fully furnished with modern amenities, ideal for families.",
    features: ["Furnished", "Generator", "Parking", "Garden"],
    agentId: 2,
  },
  {
    id: 7, title: "7 Marla Residential Plot", price: 2800000, priceText: "PKR 28,00,000", purpose: "For Sale", type: "Plots",
    beds: 0, baths: 0, area: "7 Marla", district: "Khuzdar", address: "Khuzdar, Balochistan",
    agent: "Al-Madina Real Estate", agentAvatar: "AM", verified: true, featured: false,
    img: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
    images: [
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    ],
    desc: "Residential plot in developing area of Khuzdar. Great investment opportunity at affordable price.",
    features: ["Road Access", "Electricity", "Water", "Developing Area"],
    agentId: 3,
  },
  {
    id: 8, title: "Farm House", price: 20000000, priceText: "PKR 2,00,00,000", purpose: "For Sale", type: "Farm Houses",
    beds: 4, baths: 3, area: "2 Kanal", district: "Zhob", address: "Zhob, Balochistan",
    agent: "Balochistan Homes", agentAvatar: "BH", verified: false, featured: true,
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    desc: "Beautiful 2 kanal farmhouse in Zhob with lush green orchards, mountain views, and modern amenities.",
    features: ["Orchard", "Mountain View", "Bore Water", "Solar", "Staff Quarter"],
    agentId: 4,
  },
  {
    id: 9, title: "4 Marla House in Cantt", price: 18500000, priceText: "PKR 1,85,00,000", purpose: "For Sale", type: "Houses",
    beds: 3, baths: 2, area: "4 Marla", district: "Quetta", address: "Cantt Area, Quetta, Balochistan",
    agent: "Baloch Real Estate", agentAvatar: "BR", verified: true, featured: false,
    img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    desc: "Well-maintained 4 marla house in Cantonment area with excellent security and green surroundings.",
    features: ["Cantt Area", "Security", "Garden", "Car Parking"],
    agentId: 1,
  },
  {
    id: 10, title: "12 Marla Plot Zarghoon Road", price: 32000000, priceText: "PKR 3,20,00,000", purpose: "For Sale", type: "Plots",
    beds: 0, baths: 0, area: "12 Marla", district: "Quetta", address: "Zarghoon Road, Quetta",
    agent: "Skyline Properties", agentAvatar: "SP", verified: true, featured: true,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    desc: "Premium 12 marla plot on Zarghoon Road, adjacent to government buildings. High-security zone.",
    features: ["Government Area", "High Security", "Wide Road", "All Utilities"],
    agentId: 3,
  },
  {
    id: 11, title: "3 Bed Flat for Rent", price: 25000, priceText: "PKR 25,000", purpose: "For Rent", type: "Flats / Apartments",
    beds: 3, baths: 2, area: "1,500 Sq.ft", district: "Quetta", address: "Samungli, Quetta",
    agent: "Ocean View Properties", agentAvatar: "OV", verified: false, featured: false,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    desc: "Affordable 3 bed flat for rent near Samungli Road.",
    features: ["Furnished", "Parking", "Security"],
    agentId: 2,
  },
  {
    id: 12, title: "2 Kanal House Serena View", price: 45000000, priceText: "PKR 4,50,00,000", purpose: "For Sale", type: "Houses",
    beds: 5, baths: 4, area: "2 Kanal", district: "Quetta", address: "Serena View, Quetta",
    agent: "Baloch Real Estate", agentAvatar: "BR", verified: true, featured: true,
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    desc: "Luxurious 2 kanal house in Serena View gated community with swimming pool and modern amenities.",
    features: ["Swimming Pool", "Lawn", "Servant Quarter", "Double Garage", "Generator", "Solar"],
    agentId: 1,
  },
  {
    id: 13, title: "5 Marla House Gwadar", price: 25000000, priceText: "PKR 2,50,00,000", purpose: "For Sale", type: "Houses",
    beds: 3, baths: 2, area: "5 Marla", district: "Gwadar", address: "Gwadar, Balochistan",
    agent: "Ocean View Properties", agentAvatar: "OV", verified: true, featured: false,
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"],
    desc: "New construction 5 marla house in Gwadar near CPEC zone. Great investment potential.",
    features: ["Sea View", "CPEC Area", "New Build", "Modern Design"],
    agentId: 2,
  },
  {
    id: 14, title: "Shop for Sale in Main Bazaar", price: 12000000, priceText: "PKR 1,20,00,000", purpose: "For Sale", type: "Shops / Offices",
    beds: 0, baths: 1, area: "2 Marla", district: "Quetta", address: "Jinnah Market, Quetta",
    agent: "Baloch Land Agency", agentAvatar: "BL", verified: true, featured: false,
    img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800",
    images: ["https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800"],
    desc: "Commercial shop in Jinnah Market with rental income of PKR 80,000/month.",
    features: ["Commercial", "Main Market", "Rental Income", "High Revenue"],
    agentId: 4,
  },
  {
    id: 15, title: "3 Marla Plot Zhob", price: 3500000, priceText: "PKR 35,00,000", purpose: "For Sale", type: "Plots",
    beds: 0, baths: 0, area: "3 Marla", district: "Zhob", address: "Zhob, Balochistan",
    agent: "Horizon Estate", agentAvatar: "HE", verified: false, featured: false,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    desc: "Affordable 3 marla plot in Zhob. Developing area with mountain views.",
    features: ["Mountain View", "Peaceful", "Affordable"],
    agentId: 3,
  },
  {
    id: 16, title: "4 Marla House Turbat", price: 9500000, priceText: "PKR 95,00,000", purpose: "For Sale", type: "Houses",
    beds: 2, baths: 2, area: "4 Marla", district: "Turbat", address: "Turbat, Kech, Balochistan",
    agent: "Baloch Land Agency", agentAvatar: "BL", verified: true, featured: false,
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"],
    desc: "Modern single-story house in Turbat with all essential amenities.",
    features: ["New Build", "Water Tank", "Boundary Wall", "Near Market"],
    agentId: 4,
  },
];

export const ARTICLES: Article[] = [
  { id: 1, title: "How to Buy Property in Balochistan (Complete Guide)", cat: "Buying Guide", tagColor: "bg-green text-white", date: "Apr 12, 2025", read: "5 min read", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800" },
  { id: 2, title: "Gwadar Real Estate: Investment Opportunities & Future", cat: "Market Trends", tagColor: "bg-amber-500 text-white", date: "Apr 10, 2025", read: "4 min read", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { id: 3, title: "Property Documents Checklist in Balochistan", cat: "Legal Guide", tagColor: "bg-red-500 text-white", date: "Apr 8, 2025", read: "6 min read", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800" },
  { id: 4, title: "Best Areas to Invest in Quetta", cat: "Tips & Advice", tagColor: "bg-blue-500 text-white", date: "Apr 5, 2025", read: "4 min read", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800" },
  { id: 5, title: "Rent Agreement Checklist: What to Verify Before Signing", cat: "Renting Guide", tagColor: "bg-green text-white", date: "Apr 2, 2025", read: "5 min read", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800" },
  { id: 6, title: "How to Verify a QDA NOC Before Buying a Plot", cat: "Legal Guide", tagColor: "bg-red-500 text-white", date: "Mar 28, 2025", read: "6 min read", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800" },
  { id: 7, title: "Plot vs House: Which Is the Better Investment in 2025?", cat: "Market Trends", tagColor: "bg-amber-500 text-white", date: "Mar 24, 2025", read: "7 min read", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" },
  { id: 8, title: "Rental Yields in Quetta: What Landlords Actually Earn", cat: "Market Trends", tagColor: "bg-blue-500 text-white", date: "Mar 20, 2025", read: "5 min read", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" },
  { id: 9, title: "First-Time Home Buyer? Avoid These 7 Mistakes", cat: "Tips & Advice", tagColor: "bg-green text-white", date: "Mar 16, 2025", read: "4 min read", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" },
  { id: 10, title: "Property Transfer Process & Taxes in Balochistan", cat: "Legal Guide", tagColor: "bg-red-500 text-white", date: "Mar 12, 2025", read: "8 min read", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800" },
  { id: 11, title: "Selling Your Home Fast: Pricing & Photography Tips", cat: "Selling Guide", tagColor: "bg-amber-500 text-white", date: "Mar 8, 2025", read: "5 min read", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" },
  { id: 12, title: "CPEC & Gwadar: What It Means for Property Prices", cat: "Market Trends", tagColor: "bg-blue-500 text-white", date: "Mar 4, 2025", read: "6 min read", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
];

export const PROJECTS: Project[] = [
  { name: "Gwadar Coastal Enclave", location: "Gwadar, Balochistan", status: "Under Development", plotSizes: "5,8,10 Marla", timeline: "3 Years", priceFrom: "PKR 45 Lac", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { name: "Quetta Smart City", location: "Quetta, Balochistan", status: "Launching Soon", plotSizes: "1,2,4 Kanal", timeline: "4 Years", priceFrom: "PKR 60 Lac", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" },
  { name: "Turbat Trade Center", location: "Kech, Balochistan", status: "Under Development", plotSizes: "Shops & Offices", timeline: "2 Years", priceFrom: "PKR 30 Lac", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800" },
  { name: "Khuzdar Green Residency", location: "Khuzdar, Balochistan", status: "Completed", plotSizes: "5,10 Marla", timeline: "Completed", priceFrom: "PKR 25 Lac", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800" },
  { name: "Panjgur Orchards", location: "Panjgur, Balochistan", status: "Under Development", plotSizes: "1 Kanal Farm", timeline: "3 Years", priceFrom: "PKR 40 Lac", img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800" },
  { name: "Chaman Border Plaza", location: "Chaman, Balochistan", status: "Launching Soon", plotSizes: "Commercial", timeline: "2 Years", priceFrom: "PKR 55 Lac", img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800" },
];

export const QDA_SCHEMES: QdaScheme[] = [
  { name: "Quetta Paradise Housing Scheme", district: "Quetta, Balochistan", noc: "12 Jan 2021", developer: "Al-Noor Developers", totalArea: "500 Acres", resPlots: "1,200", comPlots: "120", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800", status: "QDA Approved",
    scheme_id: "QDA/HSP/2021/041", tehsil: "Quetta", location: "Jinnah Town, Quetta-Sibi Highway Road, Quetta", authority: "QDA",
    qvc_status: "Approved", qvc_number: "QVC-2021-041", qvc_date: "12 Jan 2021",
    nrc_status: "Approved", nrc_number: "NRC/BAL/19-2217", nrc_date: "28 Jan 2021",
    pci_status: "Approved", noc_status: "Valid",
    verification_source: "QDA Official Records (qda.gov.pk)", last_verified: "20-09-2026",
    final_status: "VERIFIED", remarks: "NOC number, project name and layout plan match the QDA record room entry.",
    document: "/documents/qda-noc-sample.pdf" },
  { name: "Gwadar Pearl Enclave", district: "Kech, Balochistan", noc: "08 Mar 2022", developer: "Sunrise Builders", totalArea: "330 Acres", resPlots: "800", comPlots: "80", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", status: "QDA Approved",
    scheme_id: "GDA/NOC/2022/118", tehsil: "Gwadar", location: "Gwadar Coastal Zone, Makran Coastal Highway, Gwadar", authority: "GDA",
    qvc_status: "N/A", nrc_status: "N/A", pci_status: "Approved", noc_status: "Valid",
    verification_source: "GDA NOC Verification List (gda.gov.pk)", last_verified: "20-09-2026",
    final_status: "VERIFIED", remarks: "NOC entry found in the GDA published verification list.",
    document: "/documents/qda-noc-sample.pdf" },
  { name: "Green Valley Housing", district: "Pishin, Balochistan", noc: "15 Sep 2021", developer: "Green Valley Pvt Ltd", totalArea: "420 Acres", resPlots: "1,000", comPlots: "95", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", status: "QDA Approved",
    scheme_id: "QDA/HSP/2021/077", tehsil: "Pishin", location: "Eastern Bypass Road, Pishin, Balochistan", authority: "QDA",
    qvc_status: "Pending", nrc_status: "Pending", pci_status: "N/A", noc_status: "Expired",
    verification_source: "QDA Record Room (verification in progress)", last_verified: "12-08-2026",
    final_status: "UNDER VERIFICATION", remarks: "Developer supplied an NOC copy dated 15 Sep 2021 — official confirmation still pending.",
    document: "" },
  { name: "Quetta Garden", district: "Quetta, Balochistan", noc: "03 Feb 2023", developer: "Horizon Developers", totalArea: "400 Acres", resPlots: "1,500", comPlots: "150", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", status: "QDA Approved",
    scheme_id: "", tehsil: "Quetta", location: "Spinney Road, Quetta, Balochistan", authority: "QDA",
    qvc_status: "Not Found", nrc_status: "Not Found", pci_status: "N/A", noc_status: "Not Found",
    verification_source: "QDA Official Records (qda.gov.pk)", last_verified: "18-09-2026",
    final_status: "NOT VERIFIED", remarks: "No matching entry found against the details provided by the advertiser.",
    document: "" },
];

export const VERIFICATION_HISTORY: VerificationHistory[] = [
  { id: 1, scheme: "Quetta Paradise Housing Scheme", status: "UNDER VERIFICATION", authority: "QDA", noc: "QVC-2021-041", verified_by: "Admin", source: "Developer document received", created_date: "2026-08-05T10:00:00+00:00" },
  { id: 2, scheme: "Quetta Paradise Housing Scheme", status: "VERIFIED", authority: "QDA", noc: "QVC-2021-041", verified_by: "Admin", source: "Official Record", created_date: "2026-09-20T11:30:00+00:00" },
  { id: 3, scheme: "Gwadar Pearl Enclave", status: "VERIFIED", authority: "GDA", noc: "GDA/NOC/2022/118", verified_by: "Admin", source: "Official Record", created_date: "2026-09-20T11:45:00+00:00" },
  { id: 4, scheme: "Green Valley Housing", status: "UNDER VERIFICATION", authority: "QDA", noc: "", verified_by: "Admin", source: "Record Room Visit", created_date: "2026-08-12T09:15:00+00:00" },
  { id: 5, scheme: "Quetta Garden", status: "NOT VERIFIED", authority: "QDA", noc: "", verified_by: "Admin", source: "Official Record", created_date: "2026-09-18T14:00:00+00:00" },
];

export const SCHEMES: Scheme[] = [
  { id: 1, name: "Turbat Makran Housing Scheme", location: "Turbat, Kech, Balochistan", map_link: "", owner_name: "Gul Jan", owner_phone: "+92 321 8899001", noc_status: "Verified", facilities: ["bijli", "pani", "gas", "road"], price_total: 3500000, price_advance: 700000, price_monthly: 45000, photos: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"], status: "Active", verified: true },
  { id: 2, name: "Satellite Town Housing Block C", location: "Satellite Town, Quetta, Balochistan", map_link: "https://maps.google.com/?q=Satellite+Town+Quetta", owner_name: "Haji Nazar", owner_phone: "+92 333 2223344", noc_status: "Verified", facilities: ["bijli", "pani", "road"], price_total: 6200000, price_advance: 1500000, price_monthly: 85000, photos: ["https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800"], status: "Active", verified: true },
  { id: 3, name: "Gwadar New Town Plot 4-Marla", location: "Gwadar New Town, Gwadar, Balochistan", map_link: "https://maps.google.com/?q=Gwadar+New+Town", owner_name: "Karim Bakhsh", owner_phone: "+92 345 5556677", noc_status: "Pending", facilities: ["bijli", "road"], price_total: 2800000, price_advance: 500000, price_monthly: 40000, photos: ["https://images.unsplash.com/photo-1473042904451-00171c69419d?w=800"], status: "Active", verified: false },
  { id: 4, name: "Jinnah Town Commercial Plots", location: "Jinnah Town, Quetta-Sibi Highway Road, Quetta", map_link: "https://maps.google.com/?q=Jinnah+Town+Quetta", owner_name: "Abdul Rahim", owner_phone: "+92 300 1234567", noc_status: "Verified", facilities: ["bijli", "pani", "gas", "road"], price_total: 4500000, price_advance: 900000, price_monthly: 65000, photos: ["https://images.unsplash.com/photo-1486406157767-17132b723135?w=800", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"], status: "Active", verified: true },
  { id: 5, name: "Lasbela Hub City Commercial", location: "Hub, Lasbela, Balochistan", map_link: "https://maps.google.com/?q=Hub+Lasbela", owner_name: "Asif Baloch", owner_phone: "+92 336 4445566", noc_status: "Pending", facilities: ["pani", "road"], price_total: 8500000, price_advance: 2000000, price_monthly: 120000, photos: ["https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800"], status: "Sold", verified: false },
  { id: 6, name: "Khuzdar Sunrise Colony Plots", location: "Khuzdar, Balochistan", map_link: "", owner_name: "Sher Khan", owner_phone: "+92 300 7778899", noc_status: "No", facilities: ["bijli"], price_total: 1800000, price_advance: 300000, price_monthly: 25000, photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"], status: "Hold", verified: false },
];

export const AREAS: Area[] = [
  { name: "Jinnah Town", district: "Quetta", count: 42 },
  { name: "Satellite Town", district: "Quetta", count: 36 },
  { name: "Zarghoon Road", district: "Quetta", count: 28 },
  { name: "Samungli", district: "Quetta", count: 24 },
  { name: "Cantt", district: "Quetta", count: 31 },
  { name: "New Alizai", district: "Quetta", count: 18 },
  { name: "Khuzdar Road", district: "Quetta", count: 15 },
  { name: "Airport Road", district: "Quetta", count: 22 },
  { name: "Prince Road", district: "Quetta", count: 20 },
  { name: "Sariab Road", district: "Quetta", count: 17 },
  { name: "Gulshan Colony", district: "Quetta", count: 14 },
  { name: "Haji Camp", district: "Quetta", count: 12 },
];

/* ---------------- data access (Supabase-first, seed fallback) ---------------- */

export function formatPKR(n: number): string {
  if (!n || Number.isNaN(n)) return "";
  const s = Math.round(Math.abs(n)).toString();
  let out: string;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    let rest = s.slice(0, -3);
    const parts: string[] = [];
    while (rest.length > 2) {
      parts.unshift(rest.slice(-2));
      rest = rest.slice(0, -2);
    }
    if (rest) parts.unshift(rest);
    out = parts.join(",") + "," + last3;
  } else {
    out = s;
  }
  return "PKR " + out;
}

export async function getProperties(): Promise<Property[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .order("id");
    if (!error && data && data.length) return data as Property[];
  }
  return PROPERTIES;
}

export async function getPropertyById(id: number, viewerId?: string | null): Promise<Property | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) {
      const row = data as Property;
      if ((row.status ?? "active") !== "active" && row.created_by !== viewerId) return null;
      return row;
    }
  }
  return PROPERTIES.find((x) => x.id === id) ?? null;
}

export async function getSimilarLive(p: Property): Promise<Property[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")
      .eq("district", p.district)
      .neq("id", p.id)
      .limit(4);
    if (!error && data && data.length) return data as Property[];
  }
  return PROPERTIES.filter((x) => x.id !== p.id && x.district === p.district).slice(0, 4);
}

export async function getAgents(): Promise<Agent[]> {
  if (supabase) {
    const { data, error } = await supabase.from("agents").select("*").order("id");
    if (!error && data && data.length) return data as Agent[];
  }
  return AGENTS;
}

export async function getArticles(): Promise<Article[]> {
  if (supabase) {
    const { data, error } = await supabase.from("articles").select("*").order("id");
    if (!error && data && data.length) return data as Article[];
  }
  return ARTICLES;
}

export async function getDistricts(): Promise<District[]> {
  if (supabase) {
    const { data, error } = await supabase.from("districts").select("*");
    if (!error && data && data.length) {
      const rank = (n: string) => {
        const i = DISTRICTS.findIndex((d) => d.name === n);
        return i === -1 ? 999 : i;
      };
      return [...(data as District[])].sort((a, b) => rank(a.name) - rank(b.name));
    }
  }
  return DISTRICTS;
}

export async function getAreas(): Promise<Area[]> {
  if (supabase) {
    const { data, error } = await supabase.from("areas").select("*").order("count", { ascending: false });
    if (!error && data && data.length) return data as Area[];
  }
  return AREAS;
}

export async function getProjects(): Promise<Project[]> {
  if (supabase) {
    const { data, error } = await supabase.from("projects").select("*").order("name");
    if (!error && data && data.length) return data as Project[];
  }
  return PROJECTS;
}

export async function getQdaSchemes(): Promise<QdaScheme[]> {
  if (supabase) {
    const { data, error } = await supabase.from("qda_schemes").select("*").order("name");
    if (!error && data && data.length) return data as QdaScheme[];
  }
  return QDA_SCHEMES;
}

export async function getVerificationHistory(): Promise<VerificationHistory[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("verification_history")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data && data.length) return data as VerificationHistory[];
  }
  return VERIFICATION_HISTORY;
}

export async function getSchemes(): Promise<Scheme[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data && data.length) return data as Scheme[];
  }
  return SCHEMES;
}

export function getPropertySync(id: number): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}

export function getAgent(id: number | null | undefined): Agent {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0];
}

export function getSimilar(p: Property): Property[] {
  return PROPERTIES.filter((x) => x.id !== p.id && x.district === p.district).slice(0, 4);
}
