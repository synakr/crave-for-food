import type { Saved } from "../models/Saved";

export interface SavedRepository {
  getSavedPost(postId: string, userId: string): Promise<Saved | null>;

  getSavedPosts(userId: string): Promise<Saved[]>;

  createSaved(saved: Saved): Promise<Saved>;

  deleteSaved(postId: string, userId: string): Promise<void>;
}
