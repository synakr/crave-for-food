export type ComposerPostType =
  | "MEDIA"
  | "CAPTION"
  | "EVENT"
  | "GIG"
  | "ARTICLE";

export type CaptionLink = {
  url: string;
  title?: string;
};

export type CaptionLocation = {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
};

export type ArticleMetadata = {
  articleType: string;
  links?: CaptionLink[];
  locations?: CaptionLocation[];
};

export type CaptionMetadata = {
  emoji?: string;
  links?: CaptionLink[];
  locations?: CaptionLocation[];
};

export type GigMetadata = {
  gigType: string;
  location: string;
  contact?: string | null;
  links?: CaptionLink[];
  locations?: CaptionLocation[];
};

export type EventMetadata = {
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  audience: string;
  location: string;
  links?: CaptionLink[];
  locations?: CaptionLocation[];
};

export interface PostDraft {
  type: ComposerPostType;
  title?: string;
  caption?: string;
  body?: string;
  mediaUri?: string | null;
  mediaUris?: string[];
  mediaKind?: "IMAGE" | "VIDEO" | "GIF";
  metadata?: Record<string, unknown>;

  // Map marker coordinates
  latitude?: number;
  longitude?: number;
}

export interface ComposerProps {
  onSubmit: (draft: PostDraft) => void | Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}
