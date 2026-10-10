export type ArticlePost = {
  id: string;
  title: string;
  body: string;
  articleType: string;
  latitude: number;
  longitude: number;
};

let articlePosts: ArticlePost[] = [
  {
    id: "article-dummy-1",
    title: "The Future of AI",
    body: "Artificial intelligence is transforming how we learn, build, and interact with technology. The real opportunity lies in using AI as a tool to amplify human creativity and solve meaningful problems.",
    articleType: "Article",
    latitude: 23.9022,
    longitude: 91.3088, // Jirania area
  },
  {
    id: "article-dummy-2",
    title: "A Poem for the Rain",
    body: "The clouds arrive, the skies turn grey,\nThe rain washes the world away.\nEach drop a song, each breeze a rhyme,\nA quiet pause outside of time.",
    articleType: "Poem",
    latitude: 23.5254,
    longitude: 91.6587, // Amarpur area
  },
  {
    id: "article-dummy-3",
    title: "Building Your First App",
    body: "Start small. Pick one problem and build a simple solution. Focus on a clean user experience, reliable functionality, and frequent testing. You do not need a perfect idea to begin—you need a working first version.",
    articleType: "Article",
    latitude: 23.2515,
    longitude: 91.4544, // Belonia
  },
  {
    id: "article-dummy-4",
    title: "The Beauty of Agartala",
    body: "From quiet streets to green landscapes, Agartala has a charm that reveals itself slowly. Sometimes the best way to explore a place is to put away your phone and take the longer route home.",
    articleType: "Travel",
    latitude: 23.9401,
    longitude: 91.9889, // Kailashahar area
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
