import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
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
  const [composerVisible, setComposerVisible] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible || !postId) return;

    commentRepository
      .getCommentsByPostId(postId)
      .then(setComments)
      .catch(() => setComments([]));
  }, [visible, postId]);

  /*
   * Open the composer for a new comment.
   */
  const openComposer = () => {
    setReplyingTo(null);
    setCommentText("");
    setComposerVisible(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  /*
   * Close the composer and keyboard.
   */
  const closeComposer = () => {
    Keyboard.dismiss();
    setComposerVisible(false);
    setCommentText("");
    setReplyingTo(null);
  };

  /*
   * Create either a normal comment or a reply.
   */
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

      closeComposer();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  /*
   * Open the same composer in reply mode.
   */
  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setCommentText("");
    setComposerVisible(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  /*
   * Cancel reply but keep the composer open.
   */
  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
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
      <View style={styles.overlay}>
        {/* Main backdrop */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* =========================
            COMMENTS SHEET
        ========================== */}
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

          {/* Bottom comment trigger */}
          <View style={styles.inputTriggerContainer}>
            <Pressable style={styles.inputTrigger} onPress={openComposer}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color="rgba(255,255,255,0.45)"
              />

              <Text style={styles.inputTriggerText}>Add a comment...</Text>
            </Pressable>
          </View>
        </BlurView>

        {/* =========================
            FLOATING COMPOSER
            OUTSIDE THE SHEET
        ========================== */}
        {composerVisible && (
          <KeyboardAvoidingView
            style={styles.composerOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            {/* Composer backdrop */}
            <Pressable
              style={styles.composerBackdrop}
              onPress={closeComposer}
            />

            {/* Composer */}
            <View style={styles.composerContainer}>
              <View style={styles.composer}>
                {/* Composer header */}
                <View style={styles.composerHeader}>
                  <View style={styles.composerHeaderText}>
                    <Text style={styles.composerTitle}>
                      {replyingTo ? "Reply" : "Add a comment"}
                    </Text>

                    {replyingTo && (
                      <Text style={styles.replyingText}>
                        Replying to @{replyingToUser?.username ?? "unknown"}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    onPress={closeComposer}
                    hitSlop={10}
                    style={styles.composerClose}>
                    <Ionicons name="close" size={18} color="#fff" />
                  </Pressable>
                </View>

                {/* Input + Send */}
                <View style={styles.composerInputRow}>
                  <TextInput
                    ref={inputRef}
                    style={styles.composerInput}
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder={
                      replyingTo
                        ? `Reply to @${
                            replyingToUser?.username ?? "unknown"
                          }...`
                        : "Write something..."
                    }
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    multiline
                    maxLength={500}
                    textAlignVertical="top"
                    autoFocus
                  />

                  <Pressable
                    style={[
                      styles.sendButton,
                      !commentText.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={handleAddComment}
                    disabled={!commentText.trim()}>
                    <Ionicons name="arrow-up" size={19} color="#fff" />
                  </Pressable>
                </View>

                {/* Reply cancellation */}
                {replyingTo && (
                  <Pressable
                    onPress={handleCancelReply}
                    style={styles.cancelReplyButton}>
                    <Text style={styles.cancelReplyText}>Cancel reply</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /* =========================
     MAIN MODAL
  ========================== */

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
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
    paddingBottom: 20,
  },

  /* =========================
     COMMENTS
  ========================== */

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

  /* =========================
     COMMENT TRIGGER
  ========================== */

  inputTriggerContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  inputTrigger: {
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  inputTriggerText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },

  /* =========================
     FLOATING COMPOSER
  ========================== */

  composerOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    justifyContent: "flex-end",
  },

  composerBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.58)",
  },

  composerContainer: {
    width: "100%",
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === "ios" ? 16 : 12,
  },

  composer: {
    width: "100%",
    borderRadius: 24,
    padding: 16,
    backgroundColor: "rgba(25,25,29,0.98)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },

  composerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  composerHeaderText: {
    flex: 1,
  },

  composerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  replyingText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    marginTop: 3,
  },

  composerClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  composerInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },

  composerInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 14,
    textAlignVertical: "top",
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  sendButtonDisabled: {
    opacity: 0.35,
  },

  cancelReplyButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 4,
  },

  cancelReplyText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: "600",
  },
});
