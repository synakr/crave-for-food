import type { ArticlePost } from "@/data/mock/articlePostStore";
import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  post: ArticlePost | null;
  onClose: () => void;
};

export default function ArticlePostModal({ post, onClose }: Props) {
  return (
    <Modal
      visible={!!post}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.typeLabel}>
              <Ionicons name="book-outline" size={16} color="#725B4D" />
              <Text style={styles.typeText}>
                {post?.articleType ?? "Article"}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close-circle" size={28} color="#725B4D" />
            </Pressable>
          </View>

          {post && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.body}>{post.body}</Text>
              <Text style={styles.author}>Published by You</Text>
            </ScrollView>
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
    maxHeight: "85%",
    padding: 20,
    paddingBottom: 32,
    backgroundColor: "#F8F6F3",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#725B4D",
  },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    color: "#202020",
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    color: "#49413B",
  },
  author: {
    marginTop: 24,
    fontSize: 12,
    color: "#968A80",
  },
});
