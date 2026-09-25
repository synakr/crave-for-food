import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
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

      // Get only references to saved posts.
      const savedItems = await savedRepository.getSavedPosts(userId);

      // Resolve each reference to the actual post.
      const savedPosts = await Promise.all(
        savedItems.map(async (saved) => {
          return postRepository
            .getExplorePosts()
            .then(
              (allPosts) =>
                allPosts.find((post) => post.id === saved.post_id) ?? null,
            );
        }),
      );

      setPosts(savedPosts.filter((post): post is SavedPost => post !== null));
    } catch (error) {
      console.error("Failed to load saved posts:", error);

      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedPosts();
  }, [loadSavedPosts]);

  const renderPost = ({ item }: { item: SavedPost }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color="rgba(255,255,255,0.55)"
            />

            <Text style={styles.location} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
      </View>
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
          <Ionicons
            name="bookmark-outline"
            size={28}
            color="rgba(255,255,255,0.65)"
          />
        </View>

        <Text style={styles.emptyTitle}>No saved posts</Text>

        <Text style={styles.emptyText}>Posts you save will appear here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>

        <Text style={styles.count}>{posts.length}</Text>
      </View>

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

  header: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  count: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    fontWeight: "600",
  },

  content: {
    padding: 12,
    paddingBottom: 120,
  },

  row: {
    gap: 10,
    marginBottom: 10,
  },

  card: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#191616",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#242020",
  },

  info: {
    padding: 11,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 3,
  },

  location: {
    flex: 1,
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: "#0F0D0D",
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  emptyText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
});
