import type { GigPost as GigPostData } from "@/data/mock/gigPostStore";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

type GigPostModalProps = {
  post: GigPostData | null;
  onClose: () => void;
};

export function GigPostModal({ post, onClose }: GigPostModalProps) {
  return (
    <Modal
      visible={!!post}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modal}>
          <View style={modalStyles.header}>
            <View style={modalStyles.typeLabel}>
              <Ionicons name="briefcase-outline" size={18} color="#477B69" />
              <Text style={modalStyles.typeText}>{post?.gigType ?? "Gig"}</Text>
            </View>

            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close-circle" size={28} color="#477B69" />
            </Pressable>
          </View>

          {post && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={modalStyles.title}>{post.title}</Text>
              <Text style={modalStyles.description}>{post.description}</Text>

              <View style={modalStyles.detail}>
                <Ionicons name="location-outline" size={19} color="#477B69" />
                <Text style={modalStyles.detailText}>{post.location}</Text>
              </View>

              {post.contact && (
                <View style={modalStyles.detail}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={19}
                    color="#477B69"
                  />
                  <Text style={modalStyles.detailText}>{post.contact}</Text>
                </View>
              )}

              <Text style={modalStyles.author}>Posted by You</Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
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
  typeLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  typeText: { fontSize: 12, fontWeight: "700", color: "#477B69" },
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
  detailText: { flex: 1, fontSize: 14, color: "#49413B" },
  author: { marginTop: 16, fontSize: 12, color: "#968A80" },
});
