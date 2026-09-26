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
import { getCurrentUserId } from "../constants/currentUser";
import {
  commentRepository,
  likeRepository,
  savedRepository,
} from "../data/repositories";

import type { ExplorePost } from "../data/repositories/PostRepository";

import CommentModal from "./CommentModal";
import LikesModal from "./LikesModal";

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
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const [commentCount, setCommentCount] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLikeUpdating, setIsLikeUpdating] = useState(false);

  // Main modal animation
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Caption modal animation
  const captionScale = useRef(new Animated.Value(0.94)).current;
  const captionOpacity = useRef(new Animated.Value(0)).current;

  const time = formatTime(post.created_at);
  const caption = post.description ?? "";

  const isLongCaption = caption.length > MAX_CAPTION_LENGTH;

  const visibleCaption = isLongCaption
    ? `${caption.slice(0, MAX_CAPTION_LENGTH)}...`
    : caption;

  // comment count
  useEffect(() => {
    let active = true;

    const loadCommentCount = async () => {
      const count = await commentRepository.getCommentCountByPostId(post.id);

      if (active) {
        setCommentCount(count);
      }
    };

    loadCommentCount();

    return () => {
      active = false;
    };
  }, [post.id]);

  // Open main modal
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

  // Load current user's like state
  useEffect(() => {
    let active = true;

    const loadLikeState = async () => {
      const userId = getCurrentUserId();
      const like = await likeRepository.getLike(post.id, userId);

      if (!active) return;

      setIsLiked(!!like);
      setLikeCount(post.likes);
    };

    loadLikeState();

    return () => {
      active = false;
    };
  }, [post.id, post.likes]);

  const handleLike = async () => {
    if (isLikeUpdating) return;

    const userId = getCurrentUserId();

    try {
      setIsLikeUpdating(true);

      if (isLiked) {
        await likeRepository.deleteLike(post.id, userId);

        setIsLiked(false);
        setLikeCount((count) => Math.max(0, count - 1));
      } else {
        await likeRepository.createLike({
          post_id: post.id,
          user_id: userId,
          created_at: new Date().toISOString(),
        });

        setIsLiked(true);
        setLikeCount((count) => count + 1);
      }
    } finally {
      setIsLikeUpdating(false);
    }
  };

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

  const handleClose = () => {
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

  // Bookmark or saved code here-------
  const [isSaved, setIsSaved] = useState(false);
  const [isSaveUpdating, setIsSaveUpdating] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSavedState = async () => {
      const saved = await savedRepository.getSavedPost(
        post.id,
        getCurrentUserId(),
      );

      if (active) {
        setIsSaved(saved !== null);
      }
    };

    loadSavedState();

    return () => {
      active = false;
    };
  }, [post.id]);

  const handleSave = async () => {
    if (isSaveUpdating) return;

    const userId = getCurrentUserId();

    try {
      setIsSaveUpdating(true);

      if (isSaved) {
        await savedRepository.deleteSaved(post.id, userId);

        setIsSaved(false);
      } else {
        await savedRepository.createSaved({
          post_id: post.id,
          user_id: userId,
          created_at: new Date().toISOString(),
        });

        setIsSaved(true);
      }
    } finally {
      setIsSaveUpdating(false);
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Main backdrop */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Close post">
        <BlurView intensity={85} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.backdropDim} />
      </Pressable>

      {/* Post card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}>
        {/* User */}
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

        {/* Image */}
        <Image
          source={{ uri: post.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Post information */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
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

            {/* Actions */}
            <View style={styles.actions}>
              {/* Like button */}
              <View style={styles.likeAction}>
                <Pressable
                  style={styles.iconButton}
                  onPress={handleLike}
                  disabled={isLikeUpdating}
                  accessibilityRole="button"
                  accessibilityLabel={isLiked ? "Unlike post" : "Like post"}>
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={22}
                    color={isLiked ? "#FF4D67" : "#FFFFFF"}
                  />
                </Pressable>

                {/* Like count opens likes list */}
                <Pressable
                  onPress={() => setShowLikes(true)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={`${likeCount} likes`}>
                  <Text style={styles.actionCount}>{likeCount}</Text>
                </Pressable>
              </View>

              {/* Comments */}
              <Pressable
                style={styles.actionButton}
                onPress={() => setShowComments(true)}
                accessibilityRole="button"
                accessibilityLabel={`${commentCount} comments`}>
                <Ionicons name="chatbubble-outline" size={21} color="#FFFFFF" />

                <Text style={styles.actionCount}>{commentCount}</Text>
              </Pressable>

              {/* Saved Button */}
              <Pressable onPress={handleSave}>
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={22}
                  color="#fff"
                />
              </Pressable>
            </View>
          </View>

          {/* Caption */}
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

      {/* Likes */}
      <LikesModal
        visible={showLikes}
        postId={post.id}
        onClose={() => setShowLikes(false)}
      />

      {/* Comments */}
      <CommentModal
        visible={showComments}
        postId={post.id}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setCommentCount((count) => count + 1)}
      />

      {/* Full caption */}
      {showCaption && (
        <View style={styles.captionOverlay}>
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

          <Animated.View
            style={[
              styles.captionModal,
              {
                opacity: captionOpacity,
                transform: [{ scale: captionScale }],
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

  image: {
    width: "100%",
    height: 360,
    backgroundColor: "#242020",
  },

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

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  likeAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  iconButton: {
    alignItems: "center",
    justifyContent: "center",
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
