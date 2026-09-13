import { db } from "../mock/db";
import { Post } from "../models/Post";
import { PostContent } from "../models/PostContent";
import { ExplorePost, PostRepository } from "./PostRepository";

export class MockPostRepository implements PostRepository {
  async getPosts(): Promise<Post[]> {
    return db.posts;
  }

  async getPostById(id: string): Promise<Post | null> {
    return db.posts.find((post) => post.id === id) ?? null;
  }

  async getPostContents(postId: string): Promise<PostContent[]> {
    return db.post_contents
      .filter((content) => content.post_id === postId)
      .sort((a, b) => a.content_order - b.content_order);
  }

  async createPost(post: Post): Promise<Post> {
    db.posts.push(post);

    return post;
  }

  async updatePost(post: Post): Promise<Post> {
    const index = db.posts.findIndex((existing) => existing.id === post.id);

    if (index === -1) {
      throw new Error("Post not found");
    }

    db.posts[index] = post;

    return post;
  }

  async deletePost(id: string): Promise<void> {
    const index = db.posts.findIndex((post) => post.id === id);

    if (index === -1) {
      throw new Error("Post not found");
    }

    db.posts.splice(index, 1);
  }

  async getExplorePosts(): Promise<ExplorePost[]> {
    return db.posts.map((post) => {
      const author = db.users.find((user) => user.id === post.author_id);

      const place = db.places.find((place) => place.id === post.place_id);

      const content = db.post_contents.find(
        (content) => content.post_id === post.id && content.type === "IMAGE",
      );

      return {
        ...post,

        image: content?.storage_key ?? "",

        title: place?.name ?? "Unknown place",

        description: post.caption ?? "",

        latitude: place?.latitude ?? 0,
        longitude: place?.longitude ?? 0,

        user: {
          name: author?.name ?? "Unknown",
          avatar: author?.avatar_url ?? null,
        },

        location: place?.address ?? place?.name ?? "Unknown",

        likes: post.like_count,
      };
    });
  }
}
