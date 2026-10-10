import { useState } from "react";
import { Alert } from "react-native";
import { ComposerLayout, Field } from "./ComposerUI";
import type { ComposerProps } from "./types";

export default function CaptionComposer({
  onSubmit,
  onCancel,
  submitting,
}: ComposerProps) {
  const [caption, setCaption] = useState("");
  const publish = async () => {
    if (!caption.trim()) {
      Alert.alert("Write something", "Your caption post cannot be empty.");
      return;
    }
    await onSubmit({ type: "CAPTION", caption: caption.trim() });
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
    </ComposerLayout>
  );
}
