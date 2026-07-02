import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

interface FoodPost {
  id: number;
  image: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;

  user?: {
    name: string;
    avatar: string;
  };

  location?: string;
  time?: string;
  likes?: number;
  tags?: string[];
}

interface Props {
  post: FoodPost;
  onClose: () => void;
}

export default function FoodPostModal({
  post,
  onClose,
}: Props) {
  return (
    <View style={styles.overlay}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      >
        <BlurView
          intensity={40}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.dim} />
      </Pressable>

      <View style={styles.card}>
        <View style={styles.handle} />

        <View style={styles.row}>
          <Image
            source={{ uri: post.image }}
            style={styles.image}
          />

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.userRow}>
                <Image
                  source={{
                    uri:
                      post.user?.avatar ??
                      "https://i.pravatar.cc/150?img=12",
                  }}
                  style={styles.avatar}
                />

                <View>
                  <Text style={styles.username}>
                    {post.user?.name ?? "Anonymous"}
                  </Text>

                  <Text style={styles.time}>
                    {post.time ?? "Just now"}
                  </Text>
                </View>
              </View>

              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color="#8B7474"
              />
            </View>

            <Text style={styles.title}>
              {post.title}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location"
                size={14}
                color="#F06B6B"
              />

              <Text style={styles.location}>
                {post.location ?? "Unknown"}
              </Text>
            </View>

            <Text
              style={styles.description}
              numberOfLines={3}
            >
              {post.description}
            </Text>

            <View style={styles.tagsRow}>
              {(post.tags ?? []).map((tag) => (
                <View
                  key={tag}
                  style={styles.tag}
                >
                  <Text style={styles.tagText}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Pressable style={styles.likeButton}>
          <Ionicons
            name="heart"
            size={22}
            color="#fff"
          />

          <Text style={styles.likeText}>
            {post.likes ?? 0}
          </Text>
        </Pressable>

        <Pressable
          style={styles.close}
          onPress={onClose}
        >
          <Text style={styles.closeText}>
            Close
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 1000,
  },

  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
  },

  card: {
    backgroundColor: "#FFF8F6",

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    paddingHorizontal: 18,
    paddingTop: 14,

    paddingBottom: 95,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 18,

    elevation: 25,
  },

  handle: {
    width: 48,
    height: 5,

    borderRadius: 99,

    backgroundColor: "#E4D5D5",

    alignSelf: "center",

    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
  },

  image: {
    width: 110,
    height: 145,

    borderRadius: 18,
  },

  content: {
    flex: 1,

    marginLeft: 14,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  userRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  avatar: {
    width: 36,
    height: 36,

    borderRadius: 18,

    marginRight: 8,
  },

  username: {
    fontSize: 15,

    fontWeight: "600",

    color: "#453636",
  },

  time: {
    fontSize: 12,

    color: "#A48D8D",
  },

  title: {
    fontSize: 22,

    fontWeight: "700",

    color: "#302222",

    marginTop: 10,
  },

  locationRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 6,
  },

  location: {
    marginLeft: 4,

    fontSize: 13,

    color: "#8A7676",
  },

  description: {
    marginTop: 10,

    fontSize: 14,

    lineHeight: 20,

    color: "#6D5A5A",
  },

  tagsRow: {
    flexDirection: "row",

    flexWrap: "wrap",

    marginTop: 12,
  },

  tag: {
    backgroundColor: "#FFF0EC",

    borderRadius: 999,

    paddingHorizontal: 10,
    paddingVertical: 5,

    marginRight: 6,
    marginBottom: 6,
  },

  tagText: {
    fontSize: 12,

    color: "#F06B6B",

    fontWeight: "600",
  },

  likeButton: {
    position: "absolute",

    right: 18,
    bottom: 140,

    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: "#F06B6B",

    justifyContent: "center",
    alignItems: "center",

    elevation: 10,
  },

  likeText: {
    color: "#fff",

    fontSize: 12,

    fontWeight: "700",

    marginTop: 2,
  },

  close: {
    marginTop: 18,

    backgroundColor: "#C89B9B",

    borderRadius: 14,

    paddingVertical: 13,

    alignItems: "center",
  },

  closeText: {
    color: "#fff",

    fontSize: 15,

    fontWeight: "700",
  },
});