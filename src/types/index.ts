export interface Info {
  _id: string;
  greeting: string; // e.g., "Hello"
  greetingSign: string; // e.g., "👋"
  name: string; // e.g., "Full Stack Engineer " (used as professional headline)
  designation: string; // e.g., "Architecting scalable cross-platform solutions..."
  image: string; // Cloudinary profile asset link
  resume: string; // Cloudinary PDF asset link
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface TimelineItem {
  icon: string; // e.g., "61286", "62086"
  description: string; // e.g., "Website Development"
  _id?: string; // MongoDB ObjectID generated for sub-documents (optional check)
}

export interface StatItem {
  count: string; // e.g., "7", "90"
  sign: string; // e.g., "+" or "%"
  description: string; // e.g., "Year of \nExperience"
  _id?: string;
}

export interface Profile {
  _id: string;
  title: string; // e.g., "About"
  description: string; // The primary bio markdown/text
  stats: StatItem[]; // Metric milestones
  timeline: TimelineItem[]; // The array driving your Stepper timeline component
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number; // MongoDB version key

  // Optional / Fallback fields (if you extend your backend later)
  tagline?: string;
  avatarUrl?: string;
  email?: string;
  location?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: string;
}

export interface Tech {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "mobile";
  thumbnail?: string;
  proficiency: number;
  url?: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  slug: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
