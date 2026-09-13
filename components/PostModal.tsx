import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CommentModal from "./CommentModal";

import type { ExplorePost } from "../data/repositories/PostRepository";

interface Props {
  post: ExplorePost;
  onClose: () => void;
}

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?img=12";

const MAX_CAPTION_LENGTH = 140;

function formatTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(date).toLocaleDateString();
}

function PostModal({ post, onClose }: Props) {
  const [showCaption, setShowCaption] = useState(false);

  /* ================================
     MAIN MODAL ANIMATION
  ================================= */

  const scale = useRef(new Animated.Value(0.94)).current;

  const opacity = useRef(new Animated.Value(0)).current;

  /* ================================
     CAPTION MODAL ANIMATION
  ================================= */

  const captionScale = useRef(new Animated.Value(0.94)).current;

  const captionOpacity = useRef(new Animated.Value(0)).current;

  /* ================================
     DATA
  ================================= */

  const time = formatTime(post.created_at);

  const caption = post.description ?? "";

  const isLongCaption = caption.length > MAX_CAPTION_LENGTH;

  const visibleCaption = isLongCaption
    ? `${caption.slice(0, MAX_CAPTION_LENGTH)}...`
    : caption;

  /* ================================
     OPEN MAIN MODAL
  ================================= */

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  /* ================================
     OPEN CAPTION MODAL
  ================================= */

  const openCaption = () => {
    setShowCaption(true);

    captionScale.setValue(0.94);
    captionOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(captionOpacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(captionScale, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ================================
     CLOSE CAPTION MODAL
  ================================= */

  const closeCaption = () => {
    Animated.parallel([
      Animated.timing(captionOpacity, {
        toValue: 0,
        duration: 110,
        useNativeDriver: true,
      }),

      Animated.timing(captionScale, {
        toValue: 0.94,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowCaption(false);
      }
    });
  };

  /* ================================
     CLOSE MAIN MODAL
  ================================= */

  const handleClose = () => {
    // If caption modal is open,
    // only close the caption first.
    if (showCaption) {
      closeCaption();
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 0.94,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  };

  const [showComments, setShowComments] = useState(false);

  return (
    <View style={styles.overlay}>
      {/* =================================
          MAIN BACKDROP
      ================================== */}

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Close post">
        <BlurView intensity={85} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.backdropDim} />
      </Pressable>

      {/* =================================
          MAIN POST MODAL
      ================================== */}

      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}>
        {/* USER */}

        <View style={styles.topSection}>
          <Image
            source={{
              uri: post.user.avatar ?? FALLBACK_AVATAR,
            }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text style={styles.username} numberOfLines={1}>
              {post.user.name}
            </Text>

            <Text style={styles.time}>{time}</Text>
          </View>
        </View>

        {/* IMAGE */}

        <Image
          source={{
            uri: post.image,
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* POST INFORMATION */}

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            {/* TITLE + LOCATION */}

            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {post.title}
              </Text>

              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#A99A9A" />

                <Text style={styles.location} numberOfLines={1}>
                  {post.location}
                </Text>
              </View>
            </View>

            {/* ACTIONS */}

            <View style={styles.actions}>
              <Pressable
                style={styles.actionButton}
                accessibilityRole="button"
                accessibilityLabel={`${post.likes} likes`}>
                <Ionicons name="heart-outline" size={22} color="#FFFFFF" />

                <Text style={styles.actionCount}>{post.likes}</Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={() => setShowComments(true)}
                accessibilityRole="button"
                accessibilityLabel="Comments">
                <Ionicons name="chatbubble-outline" size={21} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* CAPTION */}

          {!!caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.caption}>{visibleCaption}</Text>

              {isLongCaption && (
                <Pressable
                  onPress={openCaption}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Read full caption">
                  <Text style={styles.more}>more</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Animated.View>

      <CommentModal
        visible={showComments}
        postId={post.id}
        onClose={() => setShowComments(false)}
      />

      {/* =================================
          CAPTION MODAL
      ================================== */}

      {showCaption && (
        <View style={styles.captionOverlay}>
          {/* CAPTION BACKDROP */}

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeCaption}
            accessibilityRole="button"
            accessibilityLabel="Close caption">
            <BlurView
              intensity={25}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.captionDim} />
          </Pressable>

          {/* CAPTION CARD */}

          <Animated.View
            style={[
              styles.captionModal,
              {
                opacity: captionOpacity,
                transform: [
                  {
                    scale: captionScale,
                  },
                ],
              },
            ]}>
            <Text style={styles.captionLabel}>CAPTION</Text>

            <Text style={styles.captionFull}>{caption}</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

export default memo(PostModal);

const styles = StyleSheet.create({
  /* ================================
     MAIN OVERLAY
  ================================= */

  overlay: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 1000,
  },

  backdropDim: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  /* ================================
     MAIN CARD
  ================================= */

  card: {
    width: "92%",
    maxWidth: 440,

    backgroundColor: "#171414",

    borderRadius: 24,

    overflow: "hidden",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 12,
    },

    shadowOpacity: 0.35,
    shadowRadius: 28,

    elevation: 30,
  },

  /* ================================
     USER
  ================================= */

  topSection: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  avatar: {
    width: 36,
    height: 36,

    borderRadius: 18,

    marginRight: 10,

    backgroundColor: "#292424",
  },

  userInfo: {
    flex: 1,

    minWidth: 0,
  },

  username: {
    fontSize: 14,

    fontWeight: "700",

    color: "#FFFFFF",
  },

  time: {
    marginTop: 2,

    fontSize: 11,

    color: "#9C8E8E",
  },

  /* ================================
     IMAGE
  ================================= */

  image: {
    width: "100%",

    height: 360,

    backgroundColor: "#242020",
  },

  /* ================================
     INFO
  ================================= */

  infoSection: {
    paddingHorizontal: 16,

    paddingTop: 14,

    paddingBottom: 16,
  },

  infoHeader: {
    flexDirection: "row",

    alignItems: "center",
  },

  titleContainer: {
    flex: 1,

    minWidth: 0,

    paddingRight: 12,
  },

  title: {
    fontSize: 19,

    lineHeight: 23,

    fontWeight: "700",

    color: "#FFFFFF",
  },

  locationRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 5,
  },

  location: {
    flex: 1,

    marginLeft: 4,

    fontSize: 12,

    color: "#A99A9A",
  },

  /* ================================
     ACTIONS
  ================================= */

  actions: {
    flexDirection: "row",

    alignItems: "center",

    gap: 14,
  },

  actionButton: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  actionCount: {
    fontSize: 12,

    fontWeight: "600",

    color: "#FFFFFF",
  },

  /* ================================
     CAPTION
  ================================= */

  captionContainer: {
    marginTop: 13,
  },

  caption: {
    fontSize: 13,

    lineHeight: 19,

    color: "#C8BBBB",
  },

  more: {
    marginTop: 3,

    fontSize: 13,

    fontWeight: "600",

    color: "#FFFFFF",
  },

  /* ================================
     CAPTION OVERLAY
  ================================= */

  captionOverlay: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 20,
  },

  captionDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  /* ================================
     CAPTION MODAL
  ================================= */

  captionModal: {
    width: "88%",

    maxWidth: 420,

    maxHeight: "70%",

    padding: 20,

    borderRadius: 22,

    backgroundColor: "#211D1D",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.4,
    shadowRadius: 24,

    elevation: 35,
  },

  captionLabel: {
    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 1.2,

    color: "#8F8080",

    marginBottom: 12,
  },

  captionFull: {
    fontSize: 15,

    lineHeight: 23,

    color: "#F5EEEE",
  },
});
