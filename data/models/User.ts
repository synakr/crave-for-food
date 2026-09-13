export interface User {
  id: string;
  username: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}
