import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getCurrentUserId } from "../../constants/currentUser";
import { postRepository, savedRepository } from "../../data/repositories";
import type { ExplorePost } from "../../data/repositories/PostRepository";

interface SavedPost extends ExplorePost {}

export default function SavedScreen() {
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedPosts = useCallback(async () => {
    try {
      setLoading(true);

      const userId = getCurrentUserId();

      const savedItems = await savedRepository.getSavedPosts(userId);
      const allPosts = await postRepository.getExplorePosts();

      const savedPosts = savedItems
        .map(
          (saved) => allPosts.find((post) => post.id === saved.post_id) ?? null,
        )
        .filter((post): post is SavedPost => post !== null);

      setPosts(savedPosts);
    } catch (error) {
      console.error("Failed to load saved posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSavedPosts();
    }, [loadSavedPosts]),
  );

  const renderPost = ({ item }: { item: SavedPost }) => {
    return (
      <Pressable style={styles.card}>
        {/* Image */}
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Bottom gradient-like overlay */}
        <View style={styles.imageOverlay} />

        {/* Saved badge */}
        <View style={styles.savedBadge}>
          <Ionicons name="bookmark" size={13} color="#FFFFFF" />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location"
              size={12}
              color="rgba(255,255,255,0.72)"
            />

            <Text style={styles.location} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="bookmark" size={25} color="rgba(255,255,255,0.8)" />
        </View>

        <Text style={styles.emptyTitle}>Your saved places</Text>

        <Text style={styles.emptyText}>
          Save posts you want to revisit later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="bookmark" size={17} color="#FFFFFF" />
          </View>

          <View>
            <Text style={styles.headerTitle}>Saved</Text>
            <Text style={styles.headerSubtitle}>
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </Text>
          </View>
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onRefresh={loadSavedPosts}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0D0D",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F0D0D",
  },

  /* ───────────────── Header ───────────────── */

  header: {
    paddingHorizontal: 18,
    paddingTop: 70,
    paddingBottom: 14,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 23,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  headerSubtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.42)",
    fontSize: 11,
    fontWeight: "500",
  },

  /* ───────────────── Grid ───────────────── */

  content: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 120,
  },

  row: {
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  /* ───────────────── Card ───────────────── */

  card: {
    width: "48.5%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#191616",
  },

  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#242020",
  },

  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  cardContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 34,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.42)",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  location: {
    flex: 1,
    color: "rgba(255,255,255,0.68)",
    fontSize: 11,
    fontWeight: "500",
  },

  savedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,13,13,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  /* ───────────────── Empty ───────────────── */

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 45,
    paddingBottom: 80,
    backgroundColor: "#0F0D0D",
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  emptyText: {
    maxWidth: 260,
    marginTop: 7,
    color: "rgba(255,255,255,0.42)",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
