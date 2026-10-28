export type ArtKind =
  | "range"
  | "fryer"
  | "griddle"
  | "combi"
  | "fridge"
  | "undercounter"
  | "chest"
  | "mixer"
  | "slicer"
  | "processor"
  | "dishwasher"
  | "sink"
  | "espresso"
  | "blender"
  | "icemaker"
  | "deckoven"
  | "proofer"
  | "kettle";

export interface Category {
  slug: string;
  name: string;
  short: string;
  description: string;
  art: ArtKind;
}

export interface Brand {
  slug: string;
  name: string;
  origin: string;
  founded: number;
  description: string;
  specialty: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  model: string;
  category: string; // Category.slug
  brand: string; // Brand.slug
  summary: string;
  description: string;
  features: string[];
  specs: Spec[];
  art: ArtKind;
  /** Uploaded photo file names (served from /api/files). Falls back to illustration when empty. */
  images: string[];
  /** Uploaded brochure file name. Falls back to a generated spec sheet when empty. */
  brochure: string | null;
  featured: boolean;
  isNew: boolean;
  leadTime: string;
  updatedAt: string;
}

export interface EnquiryItem {
  slug: string;
  name: string;
  model: string;
  brand: string;
  quantity: number;
  note?: string;
}

export interface Enquiry {
  id: string;
  reference: string;
  createdAt: string;
  kind: "quotation" | "contact";
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  businessType: string;
  timeline: string;
  requirements: string;
  items: EnquiryItem[];
  status: "new" | "in-progress" | "quoted" | "closed";
  emailDelivered: boolean;
}
