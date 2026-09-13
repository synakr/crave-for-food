import { Comment } from "../models/Comment";

export interface CommentRepository {
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  getCommentById(id: string): Promise<Comment | null>;
  createComment(comment: Comment): Promise<Comment>;
  updateComment(comment: Comment): Promise<Comment>;
  deleteComment(id: string): Promise<void>;
}
