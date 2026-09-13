import { MockPostRepository } from "./MockPostRepository";
import type { PostRepository } from "./PostRepository";

export const postRepository: PostRepository = new MockPostRepository();
