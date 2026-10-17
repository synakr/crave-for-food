export type PostType = "MEDIA" | "CAPTION" | "EVENT" | "GIG" | "ARTICLE";

export interface Post {
  id: string;
  author_id: string;

  /** Coordinates for the post's main map marker. */
  latitude: number;
  longitude: number;

  /** Determines which post renderer and composer to use. */
  post_type: PostType;

  view_count: number;
  like_count: number;
  comment_count: number;

  expires_at: string | null;

  created_at: string;
  updated_at: string;

  /** Optional links, additional locations, and shared post metadata. */
  metadata: Record<string, unknown> | null;
}
