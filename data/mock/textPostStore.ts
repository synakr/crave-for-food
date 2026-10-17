export type TextPost = {
  id: string;
  text: string;
  latitude: number;
  longitude: number;
  emoji?: string | null;
  metadata?: CaptionPostMetadata | null;
};

export type CaptionLink = {
  url: string;
  title?: string;
};

export type CaptionLocation = {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
};

export type CaptionPostMetadata = {
  links?: CaptionLink[];
  locations?: CaptionLocation[];
};

const DUMMY_POSTS: TextPost[] = [
  {
    id: "dummy-1",
    text: "Anyone up for coffee today? ☕",
    latitude: 23.8342,
    longitude: 91.2784, // Agartala
    metadata: {
      links: [
        {
          url: "https://example.com/coffee",
          title: "Coffee meetup details",
        },
      ],
      locations: [
        {
          name: "Cafe Coffee Day",
          address: "Agartala, Tripura",
          latitude: 23.8401,
          longitude: 91.2792,
        },
        {
          name: "Local Coffee House",
          address: "Agartala, Tripura",
          latitude: 23.8385,
          longitude: 91.2821,
        },
      ],
    },
  },
  {
    id: "dummy-2",
    text: "Beautiful day to explore Tripura! 🌸",
    emoji: "🌸",
    latitude: 23.5338,
    longitude: 91.4833, // Udaipur
    metadata: {
      links: [
        {
          url: "https://example.com/tripura-guide",
          title: "Tripura travel guide",
        },
      ],
      locations: [
        {
          name: "Neermahal",
          address: "Melaghar, Tripura",
          latitude: 23.4912,
          longitude: 91.3153,
        },
        {
          name: "Tripura Sundari Temple",
          address: "Udaipur, Tripura",
          latitude: 23.5331,
          longitude: 91.4838,
        },
      ],
    },
  },
  {
    id: "dummy-3",
    text: "Looking for teammates for a hackathon 💻",
    latitude: 24.3667,
    longitude: 92.1667, // Dharmanagar
    metadata: {
      links: [
        {
          url: "https://example.com/hackathon",
          title: "Hackathon registration",
        },
        {
          url: "https://github.com/",
          title: "GitHub",
        },
      ],
      locations: [
        {
          name: "Hackathon Meetup Point",
          address: "Dharmanagar, Tripura",
          latitude: 24.3691,
          longitude: 92.1702,
        },
      ],
    },
  },
];

let textPosts: TextPost[] = [...DUMMY_POSTS];

const listeners = new Set<() => void>();

export function getTextPosts(): TextPost[] {
  return [...textPosts];
}

export function addTextPost(post: TextPost): void {
  textPosts = [...textPosts, post];
  listeners.forEach((listener) => listener());
}

export function subscribeToTextPosts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
