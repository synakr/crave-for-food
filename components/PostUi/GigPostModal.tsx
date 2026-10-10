import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { GigPost } from "@/data/mock/gigPostStore";

type Props = {
  post: GigPost | null;
  onClose: () => void;
};

export default function GigPostModal({ post, onClose }: Props) {
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
              <Ionicons name="briefcase-outline" size={18} color="#477B69" />
              <Text style={styles.typeText}>{post?.gigType ?? "Gig"}</Text>
            </View>

            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close-circle" size={28} color="#477B69" />
            </Pressable>
          </View>

          {post && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.description}>{post.description}</Text>

              <View style={styles.detail}>
                <Ionicons name="location-outline" size={19} color="#477B69" />
                <Text style={styles.detailText}>{post.location}</Text>
              </View>

              {post.contact && (
                <View style={styles.detail}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={19}
                    color="#477B69"
                  />
                  <Text style={styles.detailText}>{post.contact}</Text>
                </View>
              )}

              <Text style={styles.author}>Posted by You</Text>
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
    gap: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#477B69",
  },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    color: "#202020",
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#49413B",
    marginBottom: 22,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: "#49413B",
  },
  author: {
    marginTop: 16,
    fontSize: 12,
    color: "#968A80",
  },
});
