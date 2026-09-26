import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  isSaved: boolean;
  isLikeUpdating: boolean;

  onLike: () => void;
  onComments: () => void;
  onLikes: () => void;
  onSave: () => void;
}

export default function PostActions({
  isLiked,
  likeCount,
  commentCount,
  isSaved,
  isLikeUpdating,
  onLike,
  onComments,
  onLikes,
  onSave,
}: Props) {
  return (
    <View style={styles.actions}>
      {/* Like */}
      <View style={styles.likeAction}>
        <Pressable
          style={styles.iconButton}
          onPress={onLike}
          disabled={isLikeUpdating}
          accessibilityRole="button"
          accessibilityLabel={isLiked ? "Unlike post" : "Like post"}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={22}
            color={isLiked ? "#FF4D67" : "#FFFFFF"}
          />
        </Pressable>

        <Pressable
          onPress={onLikes}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`${likeCount} likes`}>
          <Text style={styles.actionCount}>{likeCount}</Text>
        </Pressable>
      </View>

      {/* Comments */}
      <Pressable
        style={styles.actionButton}
        onPress={onComments}
        accessibilityRole="button"
        accessibilityLabel={`${commentCount} comments`}>
        <Ionicons name="chatbubble-outline" size={21} color="#FFFFFF" />

        <Text style={styles.actionCount}>{commentCount}</Text>
      </Pressable>

      {/* Saved */}
      <Pressable
        onPress={onSave}
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Unsave post" : "Save post"}>
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={22}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  likeAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
