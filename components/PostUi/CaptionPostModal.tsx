import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { CaptionPost } from "@/components/PostRenderer";
import type { TextPost } from "@/data/mock/textPostStore";

type Props = {
  post: TextPost | null;
  onClose: () => void;
};

export default function CaptionPostModal({ post, onClose }: Props) {
  return (
    <Modal
      visible={!!post}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Text post</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close-circle" size={28} color="#725B4D" />
            </Pressable>
          </View>

          {post && (
            <CaptionPost
              post={{
                id: post.id,
                type: "CAPTION",
                authorName: "You",
                caption: post.text,
                metadata: {
                  ...(post.emoji ? { emoji: post.emoji } : {}),
                  ...(post.metadata ?? {}),
                },
                createdAt: "Just now",
                likes: 0,
                comments: 0,
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modal: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#F8F6F3",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#202020",
  },
});
