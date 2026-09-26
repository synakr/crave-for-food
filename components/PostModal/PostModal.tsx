import { BlurView } from "expo-blur";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { getCurrentUserId } from "../../constants/currentUser";
import {
  commentRepository,
  likeRepository,
  savedRepository,
} from "../../data/repositories";
import type { ExplorePost } from "../../data/repositories/PostRepository";

import CommentModal from "../CommentModal";
import LikesModal from "../LikesModal";
import FullCaptionModal from "./FullCaptionModal";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";
import PostHeader from "./PostHeader";
import PostLocation from "./PostLocation";

interface Props {
  post: ExplorePost;
  onClose: () => void;
}

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

  const [isSaved, setIsSaved] = useState(false);
  const [isSaveUpdating, setIsSaveUpdating] = useState(false);

  // Main modal animation
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const time = formatTime(post.created_at);

  // Load comment count
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
  };

  const closeCaption = () => {
    setShowCaption(false);
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

  // Load saved state
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
        <PostHeader
          avatar={post.user.avatar}
          name={post.user.name}
          time={time}
        />

        <Image
          source={{ uri: post.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <PostLocation title={post.title} location={post.location} />

            <PostActions
              isLiked={isLiked}
              likeCount={likeCount}
              commentCount={commentCount}
              isSaved={isSaved}
              isLikeUpdating={isLikeUpdating}
              onLike={handleLike}
              onComments={() => setShowComments(true)}
              onLikes={() => setShowLikes(true)}
              onSave={handleSave}
            />
          </View>

          <PostCaption caption={post.description ?? ""} onMore={openCaption} />
        </View>
      </Animated.View>

      <LikesModal
        visible={showLikes}
        postId={post.id}
        onClose={() => setShowLikes(false)}
      />

      <CommentModal
        visible={showComments}
        postId={post.id}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setCommentCount((count) => count + 1)}
      />

      <FullCaptionModal
        visible={showCaption}
        caption={post.description ?? ""}
        onClose={closeCaption}
      />
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
});
