import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
    PostBody,
    PostCard,
    PostTitle,
    rendererStyles,
} from "./PostRendererShell";
import type { PostRendererProps } from "./types";
const textValue = (
  metadata: Record<string, unknown> | null | undefined,
  key: string,
) => {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
};
export default function GigPost(props: PostRendererProps) {
  const { post } = props;
  const gigType = textValue(post.metadata, "gigType") || "Opportunity";
  const location =
    textValue(post.metadata, "location") ||
    post.location ||
    "Location flexible";
  const contact = textValue(post.metadata, "contact");
  return (
    <PostCard {...props}>
      <View style={rendererStyles.panel}>
        <View style={rendererStyles.badge}>
          <Text style={rendererStyles.badgeText}>{gigType.toUpperCase()}</Text>
        </View>
        <PostTitle>{post.title || "Gig opportunity"}</PostTitle>
        <PostBody>{post.caption || ""}</PostBody>
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
          }}>
          <Ionicons name="location-outline" size={17} color="#765F51" />
          <Text style={{ color: "#555555", flex: 1 }}>{location}</Text>
        </View>
        {contact ? (
          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
            }}>
            <Ionicons name="mail-outline" size={17} color="#765F51" />
            <Text style={{ color: "#555555", flex: 1 }}>{contact}</Text>
          </View>
        ) : null}
      </View>
    </PostCard>
  );
}
