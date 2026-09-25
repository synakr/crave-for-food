import { db } from "../mock/db";
import type { Saved } from "../models/Saved";
import type { SavedRepository } from "./SavedRepository";

export class MockSavedRepository implements SavedRepository {
  async getSavedPost(postId: string, userId: string): Promise<Saved | null> {
    return (
      db.saved.find(
        (saved) => saved.post_id === postId && saved.user_id === userId,
      ) ?? null
    );
  }

  async getSavedPosts(userId: string): Promise<Saved[]> {
    return db.saved.filter((saved) => saved.user_id === userId);
  }

  async createSaved(saved: Saved): Promise<Saved> {
    db.saved.push(saved);

    return saved;
  }

  async deleteSaved(postId: string, userId: string): Promise<void> {
    const index = db.saved.findIndex(
      (saved) => saved.post_id === postId && saved.user_id === userId,
    );

    if (index === -1) return;

    db.saved.splice(index, 1);
  }
}
