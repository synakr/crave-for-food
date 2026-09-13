export type PostContentType = "IMAGE" | "VIDEO" | "GIF" | "AUDIO" | "TEXT";

export interface PostContent {
  id: string;
  post_id: string;

  type: PostContentType;

  storage_key: string | null;
  text_content: string | null;

  metadata: Record<string, unknown> | null;

  content_order: number;

  created_at: string;
}
