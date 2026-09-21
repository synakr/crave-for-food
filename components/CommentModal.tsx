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
  TextInput,
  View,
} from "react-native";
import { getCurrentUserId } from "../constants/currentUser";

import { db } from "../data/mock/db";
import type { Comment } from "../data/models/Comment";
import { commentRepository } from "../data/repositories";

interface CommentModalProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
  onCommentAdded: () => void;
}

export default function CommentModal({
  visible,
  postId,
  onClose,
  onCommentAdded,
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  useEffect(() => {
    if (!visible || !postId) return;

    commentRepository
      .getCommentsByPostId(postId)
      .then(setComments)
      .catch(() => setComments([]));
  }, [visible, postId]);

  const handleAddComment = async () => {
    const content = commentText.trim();

    if (!content) return;

    const now = new Date().toISOString();

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      post_id: postId,
      user_id: getCurrentUserId(),
      parent_comment_id: replyingTo?.id ?? null,
      content,
      created_at: now,
      updated_at: now,
    };

    try {
      const createdComment = await commentRepository.createComment(newComment);

      setComments((previous) => [...previous, createdComment]);

      onCommentAdded();

      setCommentText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setCommentText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

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

            <Pressable onPress={() => handleReply(comment)} hitSlop={6}>
              <Text style={styles.reply}>Reply</Text>
            </Pressable>
          </View>
        </View>

        {replies.map((reply) => renderComment(reply, true))}
      </View>
    );
  };

  const replyingToUser = replyingTo
    ? db.users.find((user) => user.id === replyingTo.user_id)
    : null;

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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {comments
              .filter((comment) => !comment.parent_comment_id)
              .map((comment) => renderComment(comment))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              {/* Cancel Reply */}
              {replyingTo && (
                <View style={styles.replyingBar}>
                  <Text style={styles.replyingText}>
                    Replying to @{replyingToUser?.username ?? "unknown"}
                  </Text>

                  <Pressable onPress={handleCancelReply} hitSlop={8}>
                    <Ionicons
                      name="close-circle"
                      size={17}
                      color="rgba(255,255,255,0.5)"
                    />
                  </Pressable>
                </View>
              )}

              <TextInput
                style={styles.input}
                value={commentText}
                onChangeText={setCommentText}
                placeholder={
                  replyingTo
                    ? `Reply to @${replyingToUser?.username ?? "unknown"}...`
                    : "Add a comment..."
                }
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                maxLength={500}
              />
            </View>

            <Pressable
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!commentText.trim()}>
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
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  inputWrapper: {
    flex: 1,
  },

  replyingBar: {
    height: 30,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  replyingText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "500",
  },

  input: {
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#fff",
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

  sendButtonDisabled: {
    opacity: 0.4,
  },
});
