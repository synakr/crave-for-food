import { db } from "../mock/db";
import { Post } from "../models/Post";
import { PostContent } from "../models/PostContent";
import { CreatePostInput, ExplorePost, PostRepository } from "./PostRepository";

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
    if (db.posts.some((existing) => existing.id === post.id)) {
      throw new Error("Post already exists");
    }

    db.posts.push(post);
    return post;
  }

  async createPostWithContents(input: CreatePostInput): Promise<Post> {
    const { post, contents } = input;

    if (db.posts.some((existing) => existing.id === post.id)) {
      throw new Error("Post already exists");
    }

    const contentIds = new Set<string>();

    for (const content of contents) {
      if (content.post_id !== post.id) {
        throw new Error("Every content item must belong to the new post");
      }

      if (contentIds.has(content.id)) {
        throw new Error("Duplicate content ID");
      }

      if (db.post_contents.some((existing) => existing.id === content.id)) {
        throw new Error("Content already exists");
      }

      contentIds.add(content.id);
    }

    const orderedContents = [...contents].sort(
      (a, b) => a.content_order - b.content_order,
    );

    // Validate everything before modifying the mock database.
    db.posts.push(post);

    try {
      db.post_contents.push(...orderedContents);
    } catch (error) {
      db.posts = db.posts.filter((existing) => existing.id !== post.id);
      db.post_contents = db.post_contents.filter(
        (content) => !contentIds.has(content.id),
      );
      throw error;
    }

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

    db.post_contents = db.post_contents.filter(
      (content) => content.post_id !== id,
    );
  }

  async getExplorePosts(): Promise<ExplorePost[]> {
    return db.posts.flatMap((post) => {
      // Coordinates now live directly on the post.
      if (!Number.isFinite(post.latitude) || !Number.isFinite(post.longitude)) {
        return [];
      }

      const author = db.users.find((user) => user.id === post.author_id);

      const contents = db.post_contents
        .filter((item) => item.post_id === post.id)
        .sort((a, b) => a.content_order - b.content_order);

      const media = contents.find(
        (item) =>
          item.type === "IMAGE" || item.type === "VIDEO" || item.type === "GIF",
      );

      const captionContent = contents.find((item) => item.type === "TEXT");
      const articleMetadata = captionContent?.metadata;

      return [
        {
          ...post,
          image: media?.storage_key ?? "",
          title:
            post.post_type === "ARTICLE" &&
            typeof articleMetadata?.title === "string"
              ? articleMetadata.title
              : "",
          description:
            post.post_type === "ARTICLE" &&
            typeof articleMetadata?.body === "string"
              ? articleMetadata.body
              : (captionContent?.text_content ?? ""),
          latitude: post.latitude,
          longitude: post.longitude,
          user: {
            name: author?.name ?? "Unknown",
            avatar: author?.avatar_url ?? null,
          },
          location: "",
          likes: post.like_count,
        },
      ];
    });
  }
}
