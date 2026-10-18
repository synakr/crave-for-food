import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PostActions from "./PostActions";
import type { PostRendererProps } from "./types";

export function PostCard({
  post,
  children,
  onLike,
  onComment,
  onSave,
  onPress,
}: PostRendererProps & { children: React.ReactNode }) {
  const initials =
    post.authorName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";
  return (
    <Pressable
      onPress={() => onPress?.(post)}
      disabled={!onPress}
      style={styles.card}>
      <View style={styles.authorRow}>
        {post.authorAvatar ? (
          <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.author}>{post.authorName}</Text>
          {post.createdAt ? (
            <Text style={styles.time}>{post.createdAt}</Text>
          ) : null}
        </View>
        {post.location ? (
          <View style={styles.location}>
            <Ionicons name="location-outline" size={13} color="#686868" />
            <Text numberOfLines={1} style={styles.locationText}>
              {post.location}
            </Text>
          </View>
        ) : null}
      </View>
      {children}
      <PostActions
        postId={post.id}
        likes={post.likes}
        comments={post.comments}
        saved={post.saved}
        onLike={onLike}
        onComment={onComment}
        onSave={onSave}
      />
    </Pressable>
  );
}
export function PostTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}
export function PostBody({ children }: { children: string }) {
  return <Text style={styles.body}>{children}</Text>;
}
export const rendererStyles = StyleSheet.create({
  media: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    backgroundColor: "#E7E5E2",
    marginTop: 10,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    backgroundColor: "#F0E9E4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 9,
  },
  badgeText: { color: "#6A5145", fontSize: 11, fontWeight: "700" },
  panel: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F8F6F3",
  },
  attachment: {
    marginTop: 10,
    fontSize: 13,
    color: "#725B4D",
  },
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ECE9E6",
    marginBottom: 12,
  },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEEEEE",
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEE8E2",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontSize: 12, fontWeight: "800", color: "#6D5548" },
  author: { fontSize: 14, fontWeight: "700", color: "#222222" },
  time: { fontSize: 11, color: "#888888", marginTop: 2 },
  location: {
    maxWidth: 130,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: { fontSize: 11, color: "#686868", flexShrink: 1 },
  title: { marginTop: 10, fontSize: 17, fontWeight: "800", color: "#202020" },
  body: { marginTop: 8, fontSize: 14, lineHeight: 21, color: "#454545" },
});
