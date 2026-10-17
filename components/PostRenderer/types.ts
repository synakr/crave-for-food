export type RenderPostType = "MEDIA" | "CAPTION" | "EVENT" | "GIG" | "ARTICLE";
export interface RenderablePost {
  id: string;
  type: RenderPostType;
  authorName: string;
  authorAvatar?: string | null;
  createdAt?: string;
  title?: string | null;
  caption?: string | null;
  body?: string | null;
  mediaUri?: string | null;
  mediaKind?: "IMAGE" | "VIDEO" | "GIF";
  location?: string | null;
  metadata?:
    | (Record<string, unknown> & {
        links?: {
          url: string;
          title?: string;
        }[];
        locations?: {
          name: string;
          address?: string;
          latitude: number;
          longitude: number;
        }[];
      })
    | null;
  likes?: number;
  comments?: number;
  saved?: boolean;
}
export interface PostRendererProps {
  post: RenderablePost;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onPress?: (post: RenderablePost) => void;
  metadata?: {
    links?: {
      url: string;
      title?: string;
    }[];
    locations?: {
      name: string;
      address?: string;
      latitude: number;
      longitude: number;
    }[];
  } | null;
}
