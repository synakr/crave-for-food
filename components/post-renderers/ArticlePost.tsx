import { Text, View } from "react-native";
import {
    PostBody,
    PostCard,
    PostTitle,
    rendererStyles,
} from "./PostRendererShell";
import type { PostRendererProps } from "./types";
export default function ArticlePost(props: PostRendererProps) {
  const { post } = props;
  const format =
    typeof post.metadata?.articleType === "string"
      ? post.metadata.articleType
      : "Article";
  const body = post.body || post.caption || "";
  return (
    <PostCard {...props}>
      <View style={rendererStyles.panel}>
        <View style={rendererStyles.badge}>
          <Text style={rendererStyles.badgeText}>{format.toUpperCase()}</Text>
        </View>
        <PostTitle>{post.title || "Untitled"}</PostTitle>
        <PostBody>{body}</PostBody>
      </View>
    </PostCard>
  );
}
