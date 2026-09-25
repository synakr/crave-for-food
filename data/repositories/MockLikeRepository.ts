import { db } from "../mock/db";
import type { Like } from "../models/Like";
import type { LikeRepository } from "./LikeRepository";

export class MockLikeRepository implements LikeRepository {
  async getLike(postId: string, userId: string): Promise<Like | null> {
    return (
      db.likes.find(
        (like) => like.post_id === postId && like.user_id === userId,
      ) ?? null
    );
  }

  async getLikesByPostId(postId: string): Promise<Like[]> {
    return db.likes.filter((like) => like.post_id === postId);
  }

  async createLike(like: Like): Promise<Like> {
    db.likes.push(like);

    const post = db.posts.find((post) => post.id === like.post_id);

    if (post) {
      post.like_count += 1;
      post.updated_at = new Date().toISOString();
    }

    return like;
  }

  async deleteLike(postId: string, userId: string): Promise<void> {
    const index = db.likes.findIndex(
      (like) => like.post_id === postId && like.user_id === userId,
    );

    if (index === -1) return;

    db.likes.splice(index, 1);

    const post = db.posts.find((post) => post.id === postId);

    if (post) {
      post.like_count = Math.max(0, post.like_count - 1);
      post.updated_at = new Date().toISOString();
    }
  }
}
