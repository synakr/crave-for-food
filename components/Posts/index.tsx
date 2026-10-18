import ArticlePost from "./ArticlePost";
import CaptionPost from "./CaptionPost";
import EventPost from "./EventPost";
import GigPost from "./GigPost";
import type { PostRendererProps } from "./types";
export { ArticlePostModal } from "./ArticlePost";
export { CaptionPostModal } from "./CaptionPost";
export { CreatedEventPostModal } from "./EventPost";
export { GigPostModal } from "./GigPost";

export function PostRenderer(props: PostRendererProps) {
  switch (props.post.type) {
    case "CAPTION":
      return <CaptionPost {...props} />;
    case "EVENT":
      return <EventPost {...props} />;
    case "GIG":
      return <GigPost {...props} />;
    case "ARTICLE":
      return <ArticlePost {...props} />;
    default:
      return null;
  }
}

export type {
  PostRendererProps,
  RenderablePost,
  RenderPostType,
} from "./types";
export { ArticlePost, CaptionPost, EventPost, GigPost };
