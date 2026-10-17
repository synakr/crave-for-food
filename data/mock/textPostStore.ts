export type TextPost = {
  id: string;
  text: string;
  latitude: number;
  longitude: number;
  emoji?: string | null;
};

const DUMMY_POSTS: TextPost[] = [
  {
    id: "dummy-1",
    text: "Anyone up for coffee today? ☕",
    latitude: 23.8342,
    longitude: 91.2784, // Agartala
  },
  {
    id: "dummy-2",
    text: "Beautiful day to explore Tripura! 🌸",
    latitude: 23.5338,
    longitude: 91.4833, // Udaipur
  },
  {
    id: "dummy-3",
    text: "Looking for teammates for a hackathon 💻",
    latitude: 24.3667,
    longitude: 92.1667, // Dharmanagar
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
