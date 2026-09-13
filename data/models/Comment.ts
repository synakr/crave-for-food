export interface Comment {
  id: string;
  post_id: string;
  user_id: string;

  parent_comment_id: string | null;

  content: string;

  created_at: string;
  updated_at: string;
}
