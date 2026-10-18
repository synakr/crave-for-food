import type { ArticlePost as StoredArticlePost } from "@/data/mock/articlePostStore";
import {
  getArticlePosts,
  subscribeToArticlePosts,
} from "@/data/mock/articlePostStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
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

type ArticleLink = {
  url: string;
  title?: string;
};

type ArticleLocation = {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
};

function isArticleLink(value: unknown): value is ArticleLink {
  if (!value || typeof value !== "object") return false;
  const link = value as Record<string, unknown>;
  return (
    typeof link.url === "string" &&
    (link.title === undefined || typeof link.title === "string")
  );
}

function isArticleLocation(value: unknown): value is ArticleLocation {
  if (!value || typeof value !== "object") return false;
  const location = value as Record<string, unknown>;
  return (
    typeof location.name === "string" &&
    typeof location.latitude === "number" &&
    Number.isFinite(location.latitude) &&
    typeof location.longitude === "number" &&
    Number.isFinite(location.longitude) &&
    (location.address === undefined || typeof location.address === "string")
  );
}

function getArticleLinks(metadata: unknown): ArticleLink[] {
  if (!metadata || typeof metadata !== "object") return [];
  const links = (metadata as Record<string, unknown>).links;
  return Array.isArray(links) ? links.filter(isArticleLink) : [];
}

function getArticleLocations(metadata: unknown): ArticleLocation[] {
  if (!metadata || typeof metadata !== "object") return [];
  const locations = (metadata as Record<string, unknown>).locations;
  return Array.isArray(locations) ? locations.filter(isArticleLocation) : [];
}

async function openArticleLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open link", "Please try again.");
  }
}

export default function ArticlePost(props: PostRendererProps) {
  const { post } = props;
  const metadata = post.metadata;

  const articleType =
    typeof metadata?.article_type === "string"
      ? metadata.article_type
      : typeof metadata?.articleType === "string"
        ? metadata.articleType
        : "Article";

  const title =
    post.title ||
    (typeof metadata?.title === "string" ? metadata.title : "Untitled");

  const body =
    post.body ||
    post.caption ||
    (typeof metadata?.body === "string" ? metadata.body : "");

  const links = getArticleLinks(metadata);
  const locations = getArticleLocations(metadata);

  return (
    <PostCard {...props}>
      <View style={rendererStyles.panel}>
        <View style={rendererStyles.badge}>
          <Text style={rendererStyles.badgeText}>
            {articleType.toUpperCase()}
          </Text>
        </View>

        <PostTitle>{title}</PostTitle>
        <PostBody>{body}</PostBody>

        {links.length > 0 && (
          <View style={styles.attachments}>
            {links.map((link, index) => (
              <Pressable
                key={`${link.url}-${index}`}
                onPress={() => void openArticleLink(link.url)}
                accessibilityRole="link"
                accessibilityLabel={link.title || link.url}
                style={styles.attachment}>
                <Ionicons name="link-outline" size={17} color="#725B4D" />
                <Text style={styles.linkText}>{link.title || link.url}</Text>
                <Ionicons name="open-outline" size={15} color="#968A80" />
              </Pressable>
            ))}
          </View>
        )}

        {locations.length > 0 && (
          <View style={styles.attachments}>
            {locations.map((location, index) => (
              <View
                key={`${location.latitude}-${location.longitude}-${index}`}
                style={styles.attachment}>
                <Ionicons name="location-outline" size={18} color="#725B4D" />
                <View style={styles.locationContent}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  {location.address ? (
                    <Text style={styles.locationAddress}>
                      {location.address}
                    </Text>
                  ) : null}
                  <Text style={styles.coordinates}>
                    {location.latitude}, {location.longitude}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </PostCard>
  );
}

type ArticlePostModalProps = {
  post: StoredArticlePost | null;
  onClose: () => void;
};

/** Article modal reads its complete article data directly from articlePostStore. */
export function ArticlePostModal({ post, onClose }: ArticlePostModalProps) {
  const title = post?.title.trim() ? post.title : "Untitled";
  const body = post?.body ?? "";
  const articleType = post?.articleType.trim() || "Article";
  const links = getArticleLinks(post?.metadata);
  const locations = getArticleLocations(post?.metadata);

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

            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close article">
              <Ionicons name="close-circle" size={28} color="#725B4D" />
            </Pressable>
          </View>

          {post && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={modalStyles.content}>
              <Text style={modalStyles.title}>{title}</Text>
              {body ? (
                <Text style={modalStyles.body}>{body}</Text>
              ) : (
                <Text style={modalStyles.emptyBody}>No article content.</Text>
              )}

              {links.map((link, index) => (
                <Pressable
                  key={`${link.url}-${index}`}
                  style={modalStyles.detail}
                  onPress={() => void openArticleLink(link.url)}
                  accessibilityRole="link"
                  accessibilityLabel={link.title || link.url}>
                  <Ionicons name="link-outline" size={18} color="#725B4D" />
                  <Text style={modalStyles.detailText}>
                    {link.title || link.url}
                  </Text>
                  <Ionicons name="open-outline" size={16} color="#968A80" />
                </Pressable>
              ))}

              {locations.map((location, index) => (
                <View
                  key={`${location.latitude}-${location.longitude}-${index}`}
                  style={modalStyles.detail}>
                  <Ionicons name="location-outline" size={18} color="#725B4D" />
                  <View style={modalStyles.locationContent}>
                    <Text style={modalStyles.detailText}>{location.name}</Text>
                    {location.address ? (
                      <Text style={modalStyles.locationAddress}>
                        {location.address}
                      </Text>
                    ) : null}
                    <Text style={modalStyles.coordinates}>
                      {location.latitude}, {location.longitude}
                    </Text>
                  </View>
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

/** Subscribe to the article store so map screens update when articles are added. */
export function useStoredArticlePosts(): StoredArticlePost[] {
  const [articles, setArticles] =
    useState<StoredArticlePost[]>(getArticlePosts);

  useEffect(() => {
    const unsubscribe = subscribeToArticlePosts(() => {
      setArticles(getArticlePosts());
    });
    return () => {
      unsubscribe;
    };
  }, []);

  return articles;
}

const styles = StyleSheet.create({
  attachments: {
    marginTop: 10,
    gap: 8,
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F3F0ED",
  },
  linkText: {
    flex: 1,
    color: "#765640",
    fontWeight: "600",
  },
  locationContent: {
    flex: 1,
  },
  locationName: {
    color: "#302A26",
    fontWeight: "600",
  },
  locationAddress: {
    color: "#77706B",
    marginTop: 3,
    fontSize: 13,
  },
  coordinates: {
    color: "#77706B",
    fontSize: 11,
    marginTop: 3,
  },
});

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
  content: {
    paddingBottom: 12,
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
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 22,
    color: "#968A80",
    fontStyle: "italic",
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
  },
  detailText: {
    flex: 1,
    color: "#725B4D",
    fontSize: 14,
  },
  locationContent: {
    flex: 1,
  },
  locationAddress: {
    color: "#77706B",
    marginTop: 3,
    fontSize: 13,
  },
  coordinates: {
    color: "#77706B",
    fontSize: 11,
    marginTop: 3,
  },
  author: {
    marginTop: 24,
    fontSize: 12,
    color: "#968A80",
  },
});
