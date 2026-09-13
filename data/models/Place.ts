export interface Place {
  id: string;
  name: string;
  category: string;
  address: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}
