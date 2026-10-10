import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
    PostBody,
    PostCard,
    PostTitle,
    rendererStyles,
} from "./PostRendererShell";
import type { PostRendererProps } from "./types";
const value = (
  metadata: Record<string, unknown> | null | undefined,
  key: string,
) => {
  const item = metadata?.[key];
  return typeof item === "string" || typeof item === "number"
    ? String(item)
    : "";
};
export default function EventPost(props: PostRendererProps) {
  const { post } = props;
  const date = value(post.metadata, "date");
  const start = value(post.metadata, "startTime");
  const end = value(post.metadata, "endTime");
  const category = value(post.metadata, "category") || "Event";
  const location =
    value(post.metadata, "location") ||
    post.location ||
    "Location to be announced";
  return (
    <PostCard {...props}>
      <View style={rendererStyles.panel}>
        <Text style={rendererStyles.badgeText}>{category.toUpperCase()}</Text>
        <PostTitle>{post.title || "Community event"}</PostTitle>
        {post.caption ? <PostBody>{post.caption}</PostBody> : null}
        <View style={{ marginTop: 14, gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={18} color="#765F51" />
            <Text style={{ color: "#37302B", flex: 1 }}>
              {date || "Date to be announced"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Ionicons name="time-outline" size={18} color="#765F51" />
            <Text style={{ color: "#37302B", flex: 1 }}>
              {[start, end].filter(Boolean).join(" – ") ||
                "Time to be announced"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Ionicons name="location-outline" size={18} color="#765F51" />
            <Text style={{ color: "#37302B", flex: 1 }}>{location}</Text>
          </View>
        </View>
      </View>
    </PostCard>
  );
}
