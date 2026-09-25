import type { Like } from "../models/Like";

export interface LikeRepository {
  getLike(postId: string, userId: string): Promise<Like | null>;

  getLikesByPostId(postId: string): Promise<Like[]>;

  createLike(like: Like): Promise<Like>;

  deleteLike(postId: string, userId: string): Promise<void>;
}
