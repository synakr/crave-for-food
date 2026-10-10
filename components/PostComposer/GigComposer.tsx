import { useState } from "react";
import { Alert } from "react-native";
import { ComposerLayout, Field } from "./ComposerUI";
import type { ComposerProps } from "./types";

export default function GigComposer({
  onSubmit,
  onCancel,
  submitting,
}: ComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gigType, setGigType] = useState("Offer");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const publish = async () => {
    if (![title, description, location].every((v) => v.trim())) {
      Alert.alert("Missing details", "Add a title, description, and location.");
      return;
    }
    await onSubmit({
      type: "GIG",
      title: title.trim(),
      caption: description.trim(),
      metadata: {
        gigType,
        location: location.trim(),
        contact: contact.trim() || null,
      },
    });
  };
  return (
    <ComposerLayout
      title="Post a gig"
      onCancel={onCancel}
      onSubmit={publish}
      submitting={submitting}>
      <Field
        label="Gig title"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Looking for a guitarist"
        maxLength={100}
      />
      <Field
        label="Type"
        value={gigType}
        onChangeText={setGigType}
        placeholder="Offer, Request, Collaboration"
      />
      <Field
        label="Details"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the gig..."
        multiline
        maxLength={1500}
      />
      <Field
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="Remote or place name"
      />
      <Field
        label="Contact · Optional"
        value={contact}
        onChangeText={setContact}
        placeholder="How can people reach you?"
      />
    </ComposerLayout>
  );
}
