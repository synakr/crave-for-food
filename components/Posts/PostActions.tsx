import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PostActions({
  postId,
  likes = 0,
  comments = 0,
  saved = false,
  onLike,
  onComment,
  onSave,
}: {
  postId: string;
  likes?: number;
  comments?: number;
  saved?: boolean;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onSave?: (id: string) => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Like post"
        onPress={() => onLike?.(postId)}
        style={styles.action}>
        <Ionicons name="heart-outline" size={21} color="#242424" />
        <Text style={styles.count}>{likes}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Comment on post"
        onPress={() => onComment?.(postId)}
        style={styles.action}>
        <Ionicons name="chatbubble-outline" size={20} color="#242424" />
        <Text style={styles.count}>{comments}</Text>
      </Pressable>
      <View style={{ flex: 1 }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={saved ? "Unsave post" : "Save post"}
        onPress={() => onSave?.(postId)}
        style={styles.action}>
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={21}
          color="#242424"
        />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 20, paddingTop: 13 },
  action: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 30 },
  count: { fontSize: 13, color: "#555555" },
});
