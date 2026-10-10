export type ComposerPostType = "MEDIA" | "CAPTION" | "EVENT" | "GIG" | "ARTICLE";

export interface PostDraft {
  type: ComposerPostType;
  title?: string;
  caption?: string;
  body?: string;
  mediaUri?: string | null;
  mediaKind?: "IMAGE" | "VIDEO" | "GIF";
  metadata?: Record<string, string | number | boolean | null>;
}

export interface ComposerProps {
  onSubmit: (draft: PostDraft) => void | Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}
