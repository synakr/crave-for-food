import { MockCommentRepository } from "./MockCommentRepository";
import { MockLikeRepository } from "./MockLikeRepository";
import { MockPostRepository } from "./MockPostRepository";
import { MockSavedRepository } from "./MockSavedRepository";

import type { CommentRepository } from "./CommentRepository";
import type { LikeRepository } from "./LikeRepository";
import type { PostRepository } from "./PostRepository";
import type { SavedRepository } from "./SavedRepository";

export const postRepository: PostRepository = new MockPostRepository();

export const commentRepository: CommentRepository = new MockCommentRepository();

export const likeRepository: LikeRepository = new MockLikeRepository();
export const savedRepository: SavedRepository = new MockSavedRepository();
