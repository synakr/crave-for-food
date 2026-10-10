import { useState } from "react";
import { Alert } from "react-native";
import { ComposerLayout, Field } from "./ComposerUI";
import type { ComposerProps } from "./types";

export default function ArticleComposer({
  onSubmit,
  onCancel,
  submitting,
}: ComposerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [articleType, setArticleType] = useState("Article");
  const publish = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert(
        "Missing content",
        "Add a title and write your article or poem.",
      );
      return;
    }
    await onSubmit({
      type: "ARTICLE",
      title: title.trim(),
      body: body.trim(),
      metadata: { articleType },
    });
  };
  return (
    <ComposerLayout
      title="Write long-form"
      onCancel={onCancel}
      onSubmit={publish}
      submitting={submitting}>
      <Field
        label="Format"
        value={articleType}
        onChangeText={setArticleType}
        placeholder="Article or Poem"
      />
      <Field
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Give it a title"
        maxLength={150}
      />
      <Field
        label="Body"
        value={body}
        onChangeText={setBody}
        placeholder="Start writing..."
        multiline
        maxLength={12000}
      />
    </ComposerLayout>
  );
}
