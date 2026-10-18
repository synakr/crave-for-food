import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { TextPost } from "@/data/mock/textPostStore";
import { PostBody, PostCard } from "./PostRendererShell";
import type { PostRendererProps } from "./types";

type CaptionLink = {
  url: string;
  title?: string;
};

type CaptionLocation = {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
};

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
    Number.isFinite(location.longitude) &&
    (location.address === undefined || typeof location.address === "string")
  );
}

export default function CaptionPost(props: PostRendererProps) {
  const metadata = props.post.metadata;

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
    <PostCard {...props}>
      {emoji ? (
        <Text style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</Text>
      ) : null}

      <PostBody>{props.post.caption || ""}</PostBody>

      {links.length > 0 && (
        <View style={{ marginTop: 10, gap: 8 }}>
          {links.map((link, index) => (
            <Pressable
              key={`${link.url}-${index}`}
              onPress={() => {
                void openLink(link.url);
              }}
              accessibilityRole="link"
              accessibilityLabel={link.title || link.url}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#F3F0ED",
              }}>
              <Text
                style={{
                  color: "#765640",
                  fontWeight: "600",
                }}>
                {link.title || link.url}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {locations.length > 0 && (
        <View style={{ marginTop: 10, gap: 8 }}>
          {locations.map((location, index) => (
            <View
              key={`${location.latitude}-${location.longitude}-${index}`}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#F3F0ED",
              }}>
              <Text
                style={{
                  color: "#302A26",
                  fontWeight: "600",
                }}>
                {location.name}
              </Text>

              {location.address ? (
                <Text
                  style={{
                    color: "#77706B",
                    marginTop: 3,
                  }}>
                  {location.address}
                </Text>
              ) : null}

              <Text
                style={{
                  color: "#77706B",
                  fontSize: 11,
                  marginTop: 3,
                }}>
                {location.latitude}, {location.longitude}
              </Text>
            </View>
          ))}
        </View>
      )}
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
      animationType="slide"
      onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modal}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Text post</Text>
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

const modalStyles = StyleSheet.create({
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
