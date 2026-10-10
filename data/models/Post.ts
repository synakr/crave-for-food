export type PostType = "MEDIA" | "CAPTION" | "EVENT" | "GIG" | "ARTICLE";

export interface Post {
  id: string;
  author_id: string;
  place_id: string | null;

  /** Determines which post renderer and composer to use. */
  post_type?: PostType;

  /** Optional shared caption accompanying the post. */
  caption: string | null;

  view_count: number;
  like_count: number;
  comment_count: number;

  expires_at: string | null;

  created_at: string;
  updated_at: string;
}
