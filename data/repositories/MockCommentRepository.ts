import { db } from "../mock/db";
import { Comment } from "../models/Comment";
import { CommentRepository } from "./CommentRepository";

export class MockCommentRepository implements CommentRepository {
  async getCommentCountByPostId(postId: string): Promise<number> {
    return db.comments.filter((comment) => comment.post_id === postId).length;
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return db.comments
      .filter((comment) => comment.post_id === postId)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
  }

  async getCommentById(id: string): Promise<Comment | null> {
    return db.comments.find((comment) => comment.id === id) ?? null;
  }

  async createComment(comment: Comment): Promise<Comment> {
    db.comments.push(comment);
    return comment;
  }

  async updateComment(comment: Comment): Promise<Comment> {
    const index = db.comments.findIndex(
      (existing) => existing.id === comment.id,
    );

    if (index === -1) {
      throw new Error("Comment not found");
    }

    db.comments[index] = comment;
    return comment;
  }

  async deleteComment(id: string): Promise<void> {
    const index = db.comments.findIndex((comment) => comment.id === id);

    if (index === -1) {
      throw new Error("Comment not found");
    }

    db.comments.splice(index, 1);
  }
}
