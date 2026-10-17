import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import EmojiPicker, { type EmojiType } from "rn-emoji-keyboard";
import { ComposerLayout, Field } from "./ComposerUI";
import type { ComposerProps } from "./types";

export default function CaptionComposer({
  onSubmit,
  onCancel,
  submitting,
}: ComposerProps) {
  const [caption, setCaption] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const publish = async () => {
    if (!caption.trim()) {
      Alert.alert("Write something", "Your caption post cannot be empty.");
      return;
    }

    await onSubmit({
      type: "CAPTION",
      caption: caption.trim(),
      metadata: selectedEmoji ? { emoji: selectedEmoji } : undefined,
    });
  };

  return (
    <ComposerLayout
      title="Write a post"
      onCancel={onCancel}
      onSubmit={publish}
      submitting={submitting}>
      <Field
        label="Your thoughts"
        value={caption}
        onChangeText={setCaption}
        placeholder="What's on your mind?"
        multiline
        maxLength={2000}
      />

      <View style={styles.emojiSection}>
        <Text style={styles.emojiLabel}>Marker emoji</Text>

        <View style={styles.emojiActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setEmojiPickerOpen(true)}
            style={styles.emojiButton}>
            <Text style={styles.emojiButtonText}>
              {selectedEmoji ?? "😀"}{" "}
              {selectedEmoji ? "Change emoji" : "Choose emoji"}
            </Text>
          </Pressable>

          {selectedEmoji && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedEmoji(null)}
              style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          )}
        </View>

        <EmojiPicker
          open={emojiPickerOpen}
          onClose={() => setEmojiPickerOpen(false)}
          onEmojiSelected={(emoji: EmojiType) => {
            setSelectedEmoji(emoji.emoji);
            setEmojiPickerOpen(false);
          }}
        />
      </View>
    </ComposerLayout>
  );
}

const styles = StyleSheet.create({
  emojiSection: {
    marginTop: 18,
  },
  emojiLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#51463E",
  },
  emojiActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  emojiButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E7E0D9",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  emojiButtonText: {
    fontSize: 16,
    color: "#51463E",
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#927461",
  },
});
