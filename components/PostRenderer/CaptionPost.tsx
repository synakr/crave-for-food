import { PostBody, PostCard } from "./PostRendererShell";
import type { PostRendererProps } from "./types";
export default function CaptionPost(props: PostRendererProps) {
  return (
    <PostCard {...props}>
      <PostBody>{props.post.caption || ""}</PostBody>
    </PostCard>
  );
}
