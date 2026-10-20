import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import type { ReactNode } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { TextPost } from "@/data/mock/textPostStore";
import PostActions from "./PostActions";
import type { PostRendererProps } from "./types";

type CaptionLink = {
  url: string;
  title?: string;
};

type CaptionLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

type PostCardProps = PostRendererProps & {
  children: ReactNode;
  headerAccessory?: ReactNode;
};

function PostCard({
  post,
  children,
  onLike,
  onComment,
  onSave,
  onPress,
  headerAccessory,
}: PostCardProps) {
  const initials =
    post.authorName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.identityGroup}>
          {headerAccessory && (
            <View style={styles.headerAccessory}>{headerAccessory}</View>
          )}

          {post.authorAvatar ? (
            <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={styles.authorInfo}>
          <Text numberOfLines={1} style={styles.author}>
            {post.authorName}
          </Text>

          {!!post.createdAt && (
            <Text numberOfLines={1} style={styles.time}>
              {post.createdAt}
            </Text>
          )}

          {!!post.location && (
            <View style={styles.postLocation}>
              <Ionicons name="location-outline" size={12} color="#77716D" />
              <Text numberOfLines={1} style={styles.postLocationText}>
                {post.location}
              </Text>
            </View>
          )}
        </View>

        {onPress && (
          <Pressable
            onPress={() => onPress(post)}
            style={({ pressed }) => [
              styles.openButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open post"
            hitSlop={8}>
            <Ionicons name="arrow-forward" size={27} color="#FFFFFF" />
          </Pressable>
        )}
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
    </View>
  );
}

function isCaptionLink(value: unknown): value is CaptionLink {
  if (!value || typeof value !== "object") return false;

  const link = value as Record<string, unknown>;

  return (
    typeof link.url === "string" &&
    (link.title === undefined || typeof link.title === "string")
  );
}

function isCaptionLocation(value: unknown): value is CaptionLocation {
  if (!value || typeof value !== "object") return false;

  const location = value as Record<string, unknown>;

  return (
    typeof location.name === "string" &&
    typeof location.latitude === "number" &&
    Number.isFinite(location.latitude) &&
    typeof location.longitude === "number" &&
    Number.isFinite(location.longitude)
  );
}

export default function CaptionPost(props: PostRendererProps) {
  const { post } = props;
  const metadata = post.metadata;

  const emoji = typeof metadata?.emoji === "string" ? metadata.emoji : null;

  const links = Array.isArray(metadata?.links)
    ? metadata.links.filter(isCaptionLink)
    : [];

  const locations = Array.isArray(metadata?.locations)
    ? metadata.locations.filter(isCaptionLocation)
    : [];

  const openLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.warn("Unable to open caption link:", error);
      Alert.alert(
        "Unable to open link",
        "This link could not be opened right now.",
      );
    }
  };

  return (
    <PostCard
      {...props}
      headerAccessory={
        emoji ? (
          <View style={styles.headerEmojiContainer}>
            <Text style={styles.headerEmoji}>{emoji}</Text>
          </View>
        ) : undefined
      }>
      <View style={styles.cardContent}>
        <Text style={styles.captionText}>{post.caption || ""}</Text>

        {links.length > 0 && (
          <View style={styles.metadataSection}>
            {links.map((link, index) => (
              <Pressable
                key={`${link.url}-${index}`}
                onPress={() => void openLink(link.url)}
                accessibilityRole="link"
                accessibilityLabel={link.title || link.url}
                style={({ pressed }) => [
                  styles.linkCard,
                  pressed && styles.pressed,
                ]}>
                <Ionicons name="link-outline" size={15} color="#554638" />

                <View style={styles.linkTextContainer}>
                  <Text numberOfLines={1} style={styles.linkTitle}>
                    {link.title || link.url}
                  </Text>
                </View>

                <Ionicons name="arrow-up-right-box" size={16} color="#80756B" />
              </Pressable>
            ))}
          </View>
        )}

        {locations.length > 0 && (
          <View style={styles.locationsContainer}>
            {locations.map((location, index) => (
              <View
                key={`${location.latitude}-${location.longitude}-${index}`}
                style={styles.locationChip}>
                <Ionicons name="location-outline" size={14} color="#554638" />
                <Text numberOfLines={1} style={styles.locationChipText}>
                  {location.name.trim() || "Location"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </PostCard>
  );
}

type CaptionPostModalProps = {
  post: TextPost | null;
  onClose: () => void;
};

export function CaptionPostModal({ post, onClose }: CaptionPostModalProps) {
  return (
    <Modal
      visible={!!post}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <Pressable
          style={modalStyles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close text post"
        />

        {post && (
          <View style={modalStyles.modal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}>
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
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFCFA",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0EBE6",
    marginBottom: 14,
    overflow: "hidden",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },

  identityGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EDE9E4",
    borderWidth: 2,
    borderColor: "#FFFCFA",
  },

  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EDE7DF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFCFA",
  },

  initials: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6D5548",
  },

  headerAccessory: {
    marginRight: -8,
    zIndex: 2,
  },

  authorInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  author: {
    fontSize: 13,
    fontWeight: "700",
    color: "#292725",
  },

  time: {
    fontSize: 11,
    color: "#89827D",
  },

  postLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    minWidth: 0,
  },

  postLocationText: {
    fontSize: 10,
    color: "#77716D",
    flexShrink: 1,
  },

  openButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  headerEmojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 19,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFCFA",
  },

  headerEmoji: {
    fontSize: 30,
  },

  cardContent: {
    gap: 16,
  },

  captionText: {
    fontSize: 27,
    lineHeight: 36,
    fontWeight: "400",
    letterSpacing: -0.8,
    color: "#292725",
    fontFamily: "System",
  },

  metadataSection: {
    gap: 7,
  },

  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#F4EFE9",
    borderWidth: 1,
    borderColor: "#EBE2D8",
  },

  linkTextContainer: {
    flexShrink: 1,
    minWidth: 0,
  },

  linkTitle: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    color: "#302D29",
  },

  locationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "100%",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
    backgroundColor: "#F4EFE9",
    borderWidth: 1,
    borderColor: "#EBE2D8",
  },

  locationChipText: {
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    color: "#302D29",
  },

  pressed: {
    opacity: 0.7,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 20,
    backgroundColor: "rgba(27, 25, 23, 0.42)",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
  },

  modal: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "100%",
    flexShrink: 1,
  },
});
