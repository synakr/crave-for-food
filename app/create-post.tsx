import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ArticleComposer,
  CaptionComposer,
  EventComposer,
  GigComposer,
} from "@/components/PostComposer";
import type {
  ComposerPostType,
  PostDraft,
} from "@/components/PostComposer/types";
import { addArticlePost } from "@/data/mock/articlePostStore";
import { addCreatedPost } from "@/data/mock/eventPostStore";
import { addGigPost } from "@/data/mock/gigPostStore";
import { addTextPost } from "@/data/mock/textPostStore";
import type { Post } from "@/data/models/Post";
import type { PostContent } from "@/data/models/PostContent";
import { postRepository } from "@/data/repositories";
import { getRandomLocation } from "@/utils/randomLocation";
import { SafeAreaView } from "react-native-safe-area-context";

const POST_TYPES: {
  type: ComposerPostType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    type: "CAPTION",
    title: "Text",
    icon: "chatbubble-ellipses-outline",
  },
  {
    type: "EVENT",
    title: "Event",
    icon: "calendar-outline",
  },
  {
    type: "GIG",
    title: "Gig",
    icon: "briefcase-outline",
  },
  {
    type: "ARTICLE",
    title: "Article",
    icon: "book-outline",
  },
];

function createId() {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function CreatePostScreen() {
  const [selectedType, setSelectedType] = useState<ComposerPostType>("CAPTION");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (draft: PostDraft) => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const now = new Date().toISOString();
      const postId = createId();

      // Generate the main map-marker location for this post.
      const postLocation =
        draft.type === "CAPTION"
          ? getRandomLocation(23.8328, 91.274)
          : getRandomLocation();

      const post: Post = {
        id: postId,
        author_id: "user-1",
        latitude: postLocation.latitude,
        longitude: postLocation.longitude,
        post_type: draft.type,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        expires_at: null,
        created_at: now,
        updated_at: now,
        metadata: null,
      };

      const metadata: Record<string, unknown> = {
        ...(draft.metadata ?? {}),
      };

      if (draft.title) {
        metadata.title = draft.title;
      }

      if (draft.body) {
        metadata.body = draft.body;
      }
      post.metadata = Object.keys(metadata).length > 0 ? metadata : null;

      const contents: PostContent[] = [];

      if (draft.mediaUri) {
        contents.push({
          id: `${postId}-media`,
          post_id: postId,
          type: draft.mediaKind ?? "IMAGE",
          storage_key: draft.mediaUri,
          text_content: null,
          metadata: null,
          content_order: 0,
          created_at: now,
        });
      }

      const textContent =
        draft.type === "ARTICLE" ? draft.body : (draft.caption ?? null);

      if (
        textContent ||
        draft.type !== "MEDIA" ||
        Object.keys(metadata).length > 0
      ) {
        contents.push({
          id: `${postId}-text`,
          post_id: postId,
          type: "TEXT",
          storage_key: null,
          text_content: textContent ?? null,
          metadata:
            draft.type === "CAPTION"
              ? null
              : Object.keys(metadata).length > 0
                ? metadata
                : null,
          content_order: contents.length,
          created_at: now,
        });
      }

      await postRepository.createPostWithContents({
        post,
        contents,
      });

      // Caption-based post

      if (draft.type === "CAPTION" && draft.caption?.trim()) {
        addTextPost({
          id: postId,
          text: draft.caption.trim(),
          emoji:
            typeof draft.metadata?.emoji === "string"
              ? draft.metadata.emoji
              : null,
          ...postLocation,
          metadata: {
            ...(draft.metadata?.emoji
              ? { emoji: draft.metadata.emoji as string }
              : {}),
            ...(Array.isArray(draft.metadata?.links)
              ? { links: draft.metadata.links }
              : {}),
            ...(Array.isArray(draft.metadata?.locations)
              ? { locations: draft.metadata.locations }
              : {}),
          },
        });
      }

      // hardcoded location for now for article based post
      if (
        draft.type === "ARTICLE" &&
        draft.title?.trim() &&
        draft.body?.trim()
      ) {
        addArticlePost({
          id: postId,
          title: draft.title.trim(),
          body: draft.body.trim(),
          articleType: String(draft.metadata?.articleType ?? "Article"),
          ...getRandomLocation(23.84251, 91.42521),
        });
      }

      // event based post
      if (draft.type === "EVENT") {
        const metadata = draft.metadata ?? {};

        addCreatedPost({
          title: draft.title?.trim() ?? "Untitled Event",
          description: draft.caption?.trim() ?? "",
          category: String(metadata.category ?? "Meetup"),
          date: String(metadata.date ?? ""),
          startTime: String(metadata.startTime ?? ""),
          endTime: String(metadata.endTime ?? ""),
          location: String(metadata.location ?? ""),
          audience: "Everyone",
          imageUri: draft.mediaUri ?? null,
        });
      }

      // hardcoded gig post
      if (draft.type === "GIG") {
        const metadata = draft.metadata ?? {};

        addGigPost({
          title: draft.title?.trim() ?? "Untitled Gig",
          description: draft.caption?.trim() ?? "",
          gigType: String(metadata.gigType ?? "Offer"),
          location: String(metadata.location ?? ""),
          contact: metadata.contact ? String(metadata.contact) : null,
        });
      }

      Alert.alert("Post created", "Your post has been saved.");
      router.back();
    } catch (error) {
      console.error("Failed to create post:", error);
      Alert.alert("Couldn't create post", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const composerProps = {
    onSubmit: handleSubmit,
    onCancel: () => router.back(),
    submitting,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Category chips */}
      <View style={styles.categorySection}>
        <Text style={styles.categoryLabel}>CREATE SOMETHING</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          keyboardShouldPersistTaps="handled">
          {POST_TYPES.map((item) => {
            const selected = selectedType === item.type;

            return (
              <Pressable
                key={item.type}
                onPress={() => setSelectedType(item.type)}
                accessibilityRole="button"
                accessibilityLabel={`Create ${item.title} post`}
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.categoryChip,
                  selected && styles.categoryChipSelected,
                  pressed && styles.categoryChipPressed,
                ]}>
                <Ionicons
                  name={item.icon}
                  size={17}
                  color={selected ? "#FFFFFF" : "#74675D"}
                />

                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextSelected,
                  ]}>
                  {item.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Selected composer */}
      <View style={styles.composerContainer}>
        {selectedType === "CAPTION" && <CaptionComposer {...composerProps} />}

        {selectedType === "EVENT" && <EventComposer {...composerProps} />}

        {selectedType === "GIG" && <GigComposer {...composerProps} />}

        {selectedType === "ARTICLE" && <ArticleComposer {...composerProps} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F3",
  },

  categorySection: {
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECE8E4",
  },

  categoryLabel: {
    marginHorizontal: 16,
    marginBottom: 11,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#968A80",
  },

  categoryList: {
    paddingHorizontal: 16,
    gap: 9,
  },

  categoryChip: {
    minHeight: 40,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E7E0D9",
    backgroundColor: "#FFFFFF",
  },

  categoryChipSelected: {
    backgroundColor: "#725B4D",
    borderColor: "#725B4D",
  },

  categoryChipPressed: {
    opacity: 0.75,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#74675D",
  },

  categoryTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  composerContainer: {
    flex: 1,
    minHeight: 0,
  },
});
