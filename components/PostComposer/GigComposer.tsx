import { useState } from "react";
import { Alert } from "react-native";
import { ComposerLayout, Field } from "./ComposerUI";
import type { ComposerProps } from "./types";

type GigLink = { url: string; title: string };

function parseLinks(value: string): GigLink[] | null {
  const entries = value
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const links: GigLink[] = [];
  for (const entry of entries) {
    let url: URL;
    try {
      url = new URL(entry);
    } catch {
      return null;
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    links.push({
      url: url.toString(),
      title: url.hostname.replace(/^www\./, ""),
    });
  }

  return links;
}

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
  const [linksText, setLinksText] = useState("");

  const publish = async () => {
    if (![title, description, location].every((value) => value.trim())) {
      Alert.alert("Missing details", "Add a title, description, and location.");
      return;
    }

    const links = parseLinks(linksText);
    if (links === null) {
      Alert.alert(
        "Invalid link",
        "Enter valid http:// or https:// URLs, one per line.",
      );
      return;
    }

    await onSubmit({
      type: "GIG",
      title: title.trim(),
      caption: description.trim(),
      metadata: {
        gigType: gigType.trim() || "Offer",
        location: location.trim(),
        contact: contact.trim() || null,
        ...(links.length ? { links } : {}),
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
      <Field
        label="Useful links · Optional"
        value={linksText}
        onChangeText={setLinksText}
        placeholder="https://example.com/apply\nhttps://example.com/portfolio"
        multiline
      />
    </ComposerLayout>
  );
}
