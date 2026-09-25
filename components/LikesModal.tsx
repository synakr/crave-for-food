import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { db } from "../data/mock/db";
import { likeRepository } from "../data/repositories";

interface Props {
  visible: boolean;
  postId: string;
  onClose: () => void;
}

interface LikedUser {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
}

export default function LikesModal({ visible, postId, onClose }: Props) {
  const [users, setUsers] = useState<LikedUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const loadLikes = async () => {
      setLoading(true);

      const likes = await likeRepository.getLikesByPostId(postId);

      const likedUsers = likes
        .map((like) => {
          const user = db.users.find((user) => user.id === like.user_id);

          if (!user) return null;

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar_url,
          };
        })
        .filter((user): user is LikedUser => user !== null);

      setUsers(likedUsers);
      setLoading(false);
    };

    loadLikes();
  }, [visible, postId]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Central Modal */}
        <BlurView intensity={80} tint="dark" style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Liked by</Text>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : users.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No likes yet</Text>
            </View>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  {item.avatar ? (
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.userInfo}>
                    <Text style={styles.name}>{item.name}</Text>

                    <Text style={styles.username}>@{item.username}</Text>
                  </View>
                </View>
              )}
            />
          )}
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  modal: {
    width: "100%",
    maxWidth: 380,
    maxHeight: "65%",
    minHeight: 260,

    borderRadius: 24,
    overflow: "hidden",

    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  closeText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  userInfo: {
    marginLeft: 12,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  username: {
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: 13,
    marginTop: 2,
  },

  center: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
});
