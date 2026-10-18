import type { PostContent } from "@/data/models/PostContent";
import type { ExplorePost } from "@/data/repositories/PostRepository";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
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
export default function ArticlePost(props: PostRendererProps) {
  const { post } = props;
  const format =
    typeof post.metadata?.article_type === "string"
      ? post.metadata.article_type
      : typeof post.metadata?.articleType === "string"
        ? post.metadata.articleType
        : "Article";
  const title =
    post.title ||
    (typeof post.metadata?.title === "string"
      ? post.metadata.title
      : "Untitled");
  const body =
    post.body ||
    post.caption ||
    (typeof post.metadata?.body === "string" ? post.metadata.body : "");
  return (
    <PostCard {...props}>
      <View style={rendererStyles.panel}>
        <View style={rendererStyles.badge}>
          <Text style={rendererStyles.badgeText}>{format.toUpperCase()}</Text>
        </View>
        <PostTitle>{title}</PostTitle>
        <PostBody>{body}</PostBody>
        {post.metadata?.links?.map((link) => (
          <Text key={link.url} style={rendererStyles.attachment}>
            {link.title || link.url}
          </Text>
        ))}
        {post.metadata?.locations?.map((location) => (
          <Text
            key={`${location.name}-${location.latitude}-${location.longitude}`}
            style={rendererStyles.attachment}>
            {location.address
              ? `${location.name} - ${location.address}`
              : location.name}
          </Text>
        ))}
      </View>
    </PostCard>
  );
}

type ArticlePostModalProps = {
  post: ExplorePost | null;
  contents: PostContent[];
  onClose: () => void;
};

export function ArticlePostModal({
  post,
  contents,
  onClose,
}: ArticlePostModalProps) {
  const textContent = contents.find((content) => content.type === "TEXT");
  const textMetadata = textContent?.metadata;
  const title =
    post?.title ||
    (typeof textMetadata?.title === "string" ? textMetadata.title : "Untitled");
  const body =
    post?.description ||
    (typeof textMetadata?.body === "string" ? textMetadata.body : "");
  const articleType =
    typeof textMetadata?.article_type === "string"
      ? textMetadata.article_type
      : "Article";
  const images = contents.filter(
    (content) => content.type === "IMAGE" && content.storage_key,
  );
  const links = Array.isArray(post?.metadata?.links) ? post.metadata.links : [];
  const locations = Array.isArray(post?.metadata?.locations)
    ? post.metadata.locations
    : [];

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
              <Ionicons name="book-outline" size={16} color="#725B4D" />
              <Text style={modalStyles.typeText}>{articleType}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close-circle" size={28} color="#725B4D" />
            </Pressable>
          </View>

          {post && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.storage_key! }}
                  style={modalStyles.image}
                />
              ))}
              <Text style={modalStyles.title}>{title}</Text>
              <Text style={modalStyles.body}>{body}</Text>
              {links.map((link, index) => (
                <View key={`${link.url}-${index}`} style={modalStyles.detail}>
                  <Ionicons name="link-outline" size={18} color="#725B4D" />
                  <Text style={modalStyles.detailText}>
                    {link.title || link.url}
                  </Text>
                </View>
              ))}
              {locations.map((location, index) => (
                <View
                  key={`${location.name}-${index}`}
                  style={modalStyles.detail}>
                  <Ionicons name="location-outline" size={18} color="#725B4D" />
                  <Text style={modalStyles.detailText}>
                    {location.address
                      ? `${location.name} - ${location.address}`
                      : location.name}
                  </Text>
                </View>
              ))}
              <Text style={modalStyles.author}>Published by You</Text>
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
  typeLabel: { flexDirection: "row", alignItems: "center", gap: 7 },
  typeText: { fontSize: 12, fontWeight: "700", color: "#725B4D" },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    color: "#202020",
    marginBottom: 16,
  },
  body: { fontSize: 16, lineHeight: 25, color: "#49413B" },
  image: {
    width: "100%",
    height: 190,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#E8E1DC",
  },
  detail: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18 },
  detailText: { flex: 1, color: "#725B4D", fontSize: 14 },
  author: { marginTop: 24, fontSize: 12, color: "#968A80" },
});
