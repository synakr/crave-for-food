import type { CommentRepository } from "./CommentRepository";
import { MockCommentRepository } from "./MockCommentRepository";
import { MockPostRepository } from "./MockPostRepository";
import type { PostRepository } from "./PostRepository";

export const postRepository: PostRepository = new MockPostRepository();

export const commentRepository: CommentRepository = new MockCommentRepository();
