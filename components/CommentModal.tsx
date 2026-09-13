import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { db } from "../data/mock/db";
import type { Comment } from "../data/models/Comment";
import { commentRepository } from "../data/repositories";

interface CommentModalProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
}

export default function CommentModal({
  visible,
  postId,
  onClose,
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!visible || !postId) return;

    commentRepository
      .getCommentsByPostId(postId)
      .then(setComments)
      .catch(() => setComments([]));
  }, [visible, postId]);

  const renderComment = (
    comment: Comment,
    isReply = false,
  ): React.ReactNode => {
    const user = db.users.find((user) => user.id === comment.user_id);

    const replies = comments.filter(
      (reply) => reply.parent_comment_id === comment.id,
    );

    return (
      <View key={comment.id}>
        <View style={[styles.comment, isReply && styles.replyComment]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>

          <View style={styles.commentBody}>
            <Text style={styles.username}>@{user?.username ?? "unknown"}</Text>

            <Text style={styles.commentText}>{comment.content}</Text>

            <Pressable>
              <Text style={styles.reply}>Reply</Text>
            </Pressable>
          </View>
        </View>

        {replies.map((reply) => renderComment(reply, true))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <BlurView intensity={45} tint="dark" style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>

            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* Comments */}
          <ScrollView
            style={styles.comments}
            contentContainerStyle={styles.commentsContent}
            showsVerticalScrollIndicator={false}>
            {comments
              .filter((comment) => !comment.parent_comment_id)
              .map((comment) => renderComment(comment))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Text style={styles.placeholder}>Add a comment...</Text>
            </View>

            <Pressable style={styles.sendButton}>
              <Ionicons name="arrow-up" size={18} color="#fff" />
            </Pressable>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    height: "70%",
    overflow: "hidden",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(15,15,18,0.88)",
  },

  handle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 8,
  },

  header: {
    height: 52,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  comments: {
    flex: 1,
  },

  commentsContent: {
    padding: 18,
    paddingBottom: 12,
  },

  comment: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  replyComment: {
    marginLeft: 48,
    marginBottom: 16,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  commentBody: {
    flex: 1,
  },

  username: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },

  commentText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
  },

  reply: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  placeholder: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
});
