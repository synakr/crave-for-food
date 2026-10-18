export type ArticlePost = {
  id: string;
  title: string;
  body: string;
  articleType: string;
  latitude: number;
  longitude: number;
  metadata?: Record<string, unknown> | null;
  mediaUris?: string[];
};

let articlePosts: ArticlePost[] = [
  {
    id: "article-dummy-1",
    title: "The Future of AI",
    body: "Artificial intelligence is transforming how we learn, build, and interact with technology. The real opportunity lies in using AI as a tool to amplify human creativity and solve meaningful problems.",
    articleType: "Article",
    latitude: 23.9022,
    longitude: 91.3088, // Jirania area — map marker
    mediaUris: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    ],
    metadata: {
      articleType: "Article",
      uri: "https://www.ibm.com/think/topics/artificial-intelligence",
      source: "IBM Think",
      publishedAt: "2026-09-12T09:00:00.000Z",
      readingTimeMinutes: 4,
      tags: ["AI", "Technology", "Creativity"],
      links: [
        {
          url: "https://www.ibm.com/think/topics/artificial-intelligence",
          title: "What is artificial intelligence?",
        },
        {
          url: "https://ai.google/",
          title: "Google AI",
        },
      ],
      locations: [
        {
          name: "NIT Agartala",
          address: "Jirania, Tripura, India",
          latitude: 23.8372,
          longitude: 91.421,
        },
      ],
    },
  },
  {
    id: "article-dummy-2",
    title: "A Poem for the Rain",
    body: "The clouds arrive, the skies turn grey,\nThe rain washes the world away.\nEach drop a song, each breeze a rhyme,\nA quiet pause outside of time.",
    articleType: "Poem",
    latitude: 23.5254,
    longitude: 91.6587, // Amarpur area — map marker
    mediaUris: [
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200",
    ],
    metadata: {
      articleType: "Poem",
      uri: "https://www.poetryfoundation.org/",
      source: "Poetry Foundation",
      publishedAt: "2026-08-22T06:30:00.000Z",
      readingTimeMinutes: 1,
      tags: ["Poetry", "Rain", "Nature"],
      mood: "Calm and reflective",
      links: [
        {
          url: "https://www.poetryfoundation.org/",
          title: "Explore poetry",
        },
      ],
      locations: [
        {
          name: "Dumboor Lake",
          address: "Gandacherra, Tripura, India",
          latitude: 23.5317,
          longitude: 91.8542,
        },
      ],
    },
  },
  {
    id: "article-dummy-3",
    title: "Building Your First App",
    body: "Start small. Pick one problem and build a simple solution. Focus on a clean user experience, reliable functionality, and frequent testing. You do not need a perfect idea to begin—you need a working first version.",
    articleType: "Article",
    latitude: 23.2515,
    longitude: 91.4544, // Belonia — map marker
    mediaUris: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
    ],
    metadata: {
      articleType: "Tutorial",
      uri: "https://developer.mozilla.org/en-US/docs/Learn",
      source: "MDN Web Docs",
      publishedAt: "2026-10-02T11:15:00.000Z",
      readingTimeMinutes: 3,
      difficulty: "Beginner",
      tags: ["Programming", "App Development", "Beginners"],
      links: [
        {
          url: "https://developer.mozilla.org/en-US/docs/Learn",
          title: "MDN Learn Web Development",
        },
        {
          url: "https://reactnative.dev/docs/getting-started",
          title: "React Native: Get Started",
        },
      ],
      locations: [
        {
          name: "Belonia Town",
          address: "Belonia, South Tripura, India",
          latitude: 23.0831,
          longitude: 91.6024,
        },
      ],
    },
  },
  {
    id: "article-dummy-4",
    title: "The Beauty of Agartala",
    body: "From quiet streets to green landscapes, Agartala has a charm that reveals itself slowly. Sometimes the best way to explore a place is to put away your phone and take the longer route home.",
    articleType: "Travel",
    latitude: 23.9401,
    longitude: 91.9889, // Kailashahar area — map marker
    mediaUris: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
    ],
    metadata: {
      articleType: "Travel",
      uri: "https://tripuratourism.gov.in/",
      source: "Tripura Tourism",
      publishedAt: "2026-09-28T08:45:00.000Z",
      readingTimeMinutes: 5,
      tags: ["Tripura", "Travel", "Local Discovery"],
      bestTimeToVisit: "October to March",
      links: [
        {
          url: "https://tripuratourism.gov.in/",
          title: "Official Tripura Tourism",
        },
        {
          url: "https://en.wikipedia.org/wiki/Agartala",
          title: "About Agartala",
        },
      ],
      locations: [
        {
          name: "Ujjayanta Palace",
          address: "Agartala, Tripura, India",
          latitude: 23.8351,
          longitude: 91.2794,
        },
      ],
    },
  },
];

const listeners = new Set<() => void>();

export function getArticlePosts(): ArticlePost[] {
  return [...articlePosts];
}

export function addArticlePost(post: ArticlePost): void {
  articlePosts = [...articlePosts, post];
  listeners.forEach((listener) => listener());
}

export function subscribeToArticlePosts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
