import { Post } from "@/data/models/Post";
import { PostContent } from "@/data/models/PostContent";
import { postRepository } from "@/data/repositories";

export interface CreateEventPostInput {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  audience: string;
  imageUri: string | null;
}

export async function createEventPost(input: CreateEventPostInput) {
  const now = new Date().toISOString();
  const id = `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const post: Post = {
    id,
    author_id: "user-1",
    latitude: 23.8328,
    longitude: 91.274,
    post_type: "EVENT",
    view_count: 0,
    like_count: 0,
    comment_count: 0,
    expires_at: null,
    created_at: now,
    updated_at: now,
    metadata: {
      title: input.title,
      category: input.category,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      location: input.location,
      audience: input.audience,
    },
  };

  const contents: PostContent[] = [
    {
      id: `${id}-details`,
      post_id: id,
      type: "TEXT",
      storage_key: null,
      text_content: input.description,
      metadata: {
        title: input.title,
        category: input.category,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        location: input.location,
        audience: input.audience,
      },
      content_order: 0,
      created_at: now,
    },
  ];

  if (input.imageUri) {
    contents.push({
      id: `${id}-image`,
      post_id: id,
      type: "IMAGE",
      storage_key: input.imageUri,
      text_content: null,
      metadata: null,
      content_order: 1,
      created_at: now,
    });
  }

  return postRepository.createPostWithContents({ post, contents });
}
