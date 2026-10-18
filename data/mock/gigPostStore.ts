export type GigPostLink = {
  url: string;
  title?: string;
};

export type GigPostLocation = {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
};

export type GigPostMetadata = {
  links?: GigPostLink[];
  locations?: GigPostLocation[];
};

export type GigPost = {
  id: string;
  title: string;
  description: string;
  gigType: string;
  location: string;
  contact: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  /** Optional posts.metadata fields from gig-post.md. */
  metadata?: GigPostMetadata;
};

const CAMPUS = {
  latitude: 23.84251,
  longitude: 91.42521,
};

let gigPosts: GigPost[] = [
  {
    id: "gig-demo-1",
    title: "Looking for a Guitarist 🎸",
    description:
      "Searching for a guitarist to join our college band. We plan to practice twice a week and perform at upcoming campus events.",
    gigType: "Request",
    location: "Sabroom",
    contact: "DM me to collaborate",
    latitude: 23.0013,
    longitude: 91.7245, // Sabroom
    createdAt: new Date().toISOString(),
  },
  {
    id: "gig-demo-2",
    title: "Freelance Logo Designer",
    description:
      "Need a creative designer to make a modern logo for a student startup. Share your portfolio and estimated timeline.",
    gigType: "Offer",
    location: "Khowai",
    contact: "designer@example.com",
    latitude: 24.0667,
    longitude: 91.6, // Khowai
    createdAt: new Date().toISOString(),
  },
  {
    id: "gig-demo-3",
    title: "React Native Project Collaboration",
    description:
      "Looking for a developer interested in building a social discovery app. Great opportunity to learn, build a portfolio, and ship something real.",
    gigType: "Collaboration",
    location: "Teliamura",
    contact: "DM to discuss",
    latitude: 23.835,
    longitude: 91.606, // Teliamura
    createdAt: new Date().toISOString(),
  },
  {
    id: "gig-demo-4",
    title: "Photography for Campus Events 📸",
    description:
      "Offering photography coverage for college events, club activities, and student projects. Let's create something memorable.",
    gigType: "Offer",
    location: "Ambassa",
    contact: null,
    latitude: 23.9333,
    longitude: 91.8833, // Ambassa area
    createdAt: new Date().toISOString(),
  },
];

const listeners = new Set<() => void>();

export function getGigPosts(): GigPost[] {
  return [...gigPosts];
}

export function subscribeToGigPosts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addGigPost(
  post: Omit<GigPost, "id" | "latitude" | "longitude" | "createdAt">,
): GigPost {
  const createdPost: GigPost = {
    ...post,
    metadata: post.metadata
      ? {
          ...(post.metadata.links ? { links: [...post.metadata.links] } : {}),
          ...(post.metadata.locations
            ? { locations: [...post.metadata.locations] }
            : {}),
        }
      : undefined,
    id: `gig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    latitude: CAMPUS.latitude + (Math.random() - 0.5) * 0.008,
    longitude: CAMPUS.longitude + (Math.random() - 0.5) * 0.008,
    createdAt: new Date().toISOString(),
  };

  gigPosts = [createdPost, ...gigPosts];
  listeners.forEach((listener) => listener());

  return createdPost;
}
