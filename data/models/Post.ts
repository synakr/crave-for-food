export interface Post {
  id: string;
  author_id: string;
  place_id: string | null;

  caption: string | null;

  view_count: number;
  like_count: number;
  comment_count: number;

  expires_at: string | null;

  created_at: string;
  updated_at: string;
}
