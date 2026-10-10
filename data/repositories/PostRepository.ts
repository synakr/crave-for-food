import { Post } from "../models/Post";
import { PostContent } from "../models/PostContent";

export interface ExplorePost extends Post {
  image: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;

  user: {
    name: string;
    avatar: string | null;
  };

  location: string;
  likes: number;
}

export interface CreatePostInput {
  post: Post;
  contents: PostContent[];
}

export interface PostRepository {
  getPosts(): Promise<Post[]>;

  getPostById(id: string): Promise<Post | null>;

  getPostContents(postId: string): Promise<PostContent[]>;

  getExplorePosts(): Promise<ExplorePost[]>;

  createPost(post: Post): Promise<Post>;

  /** Creates a post and its content together. */
  createPostWithContents(input: CreatePostInput): Promise<Post>;

  updatePost(post: Post): Promise<Post>;

  deletePost(id: string): Promise<void>;
}
