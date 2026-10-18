import { getRandomLocation } from "@/utils/randomLocation";

export type CreatedEventPost = {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  audience: string;
  imageUri: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  likes: number;
  comments: number;
  interested: number;
};

const posts: CreatedEventPost[] = [
  {
    id: "mock-image-event",
    category: "Meetup",
    title: "Sunset Coding Meetup",
    description:
      "A relaxed evening meetup for developers, builders, and anyone interested in technology. Bring your laptop, share what you're building, and meet other people from the community.",
    date: "Saturday, October 10",
    startTime: "5:00 PM",
    endTime: "7:30 PM",
    location: "NIT Agartala Campus",
    audience: "Students & Developers",
    imageUri:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    latitude: 23.842334,
    longitude: 91.4267382,
    createdAt: new Date().toISOString(),
    likes: 24,
    comments: 7,
    interested: 18,
  },
  {
    id: "mock-text-event",
    category: "Workshop",
    title: "React Native Study Session",
    description:
      "Working on a React Native project? Join us for a casual study session where we can build together, discuss problems, and help each other debug things along the way.",
    date: "Sunday, October 11",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    location: "Central Library",
    audience: "React Native Developers",
    imageUri: null,
    latitude: 23.51,
    longitude: 91.8891,
    createdAt: new Date().toISOString(),
    likes: 12,
    comments: 4,
    interested: 9,
  },
];

const listeners = new Set<() => void>();

function notify() {
  [...listeners].forEach((listener) => listener());
}

function getUniqueLocation() {
  let location = getRandomLocation();

  while (
    posts.some(
      (post) =>
        post.latitude === location.latitude &&
        post.longitude === location.longitude,
    )
  ) {
    location = getRandomLocation();
  }

  return location;
}

export function getCreatedPosts(): CreatedEventPost[] {
  return [...posts];
}

export function subscribeToCreatedPosts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function addCreatedPost(
  post: Omit<
    CreatedEventPost,
    | "id"
    | "latitude"
    | "longitude"
    | "createdAt"
    | "likes"
    | "comments"
    | "interested"
  >,
): CreatedEventPost {
  const location = getUniqueLocation();

  const createdPost: CreatedEventPost = {
    ...post,
    ...location,
    id: `created-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0,
    interested: 0,
  };

  posts.unshift(createdPost);
  notify();

  return createdPost;
}
