import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import EmojiPicker, { type EmojiType } from "rn-emoji-keyboard";
import { ComposerLayout, Field } from "./ComposerUI";
import type { CaptionLink, CaptionLocation, ComposerProps } from "./types";

export default function CaptionComposer({
  onSubmit,
  onCancel,
  submitting,
}: ComposerProps) {
  const [caption, setCaption] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [links, setLinks] = useState<CaptionLink[]>([]);

  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationLatitude, setLocationLatitude] = useState("");
  const [locationLongitude, setLocationLongitude] = useState("");
  const [locations, setLocations] = useState<CaptionLocation[]>([]);

  const addLink = () => {
    const url = linkUrl.trim();

    if (!/^https?:\/\/\S+$/i.test(url)) {
      Alert.alert(
        "Invalid link",
        "Enter a valid URL starting with https:// or http://.",
      );
      return;
    }

    setLinks((current) => [
      ...current,
      {
        url,
        ...(linkTitle.trim() ? { title: linkTitle.trim() } : {}),
      },
    ]);

    setLinkUrl("");
    setLinkTitle("");
  };

  const addLocation = () => {
    const name = locationName.trim();
    const latitude = Number(locationLatitude.trim());
    const longitude = Number(locationLongitude.trim());

    if (!name) {
      Alert.alert("Location name required", "Enter a name for this location.");
      return;
    }

    if (
      !locationLatitude.trim() ||
      !locationLongitude.trim() ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      Alert.alert(
        "Invalid coordinates",
        "Enter a valid latitude (-90 to 90) and longitude (-180 to 180).",
      );
      return;
    }

    setLocations((current) => [
      ...current,
      {
        name,
        ...(locationAddress.trim() ? { address: locationAddress.trim() } : {}),
        latitude,
        longitude,
      },
    ]);

    setLocationName("");
    setLocationAddress("");
    setLocationLatitude("");
    setLocationLongitude("");
  };

  const publish = async () => {
    if (!caption.trim()) {
      Alert.alert("Write something", "Your caption post cannot be empty.");
      return;
    }

    const metadata = {
      ...(selectedEmoji ? { emoji: selectedEmoji } : {}),
      ...(links.length ? { links } : {}),
      ...(locations.length ? { locations } : {}),
    };

    await onSubmit({
      type: "CAPTION",
      caption: caption.trim(),
      metadata: Object.keys(metadata).length ? metadata : undefined,
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marker emoji</Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setEmojiPickerOpen(true)}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {selectedEmoji ?? "😀"}{" "}
              {selectedEmoji ? "Change emoji" : "Choose emoji"}
            </Text>
          </Pressable>

          {selectedEmoji && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedEmoji(null)}
              style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attach links</Text>

        <Field
          label="URL"
          value={linkUrl}
          onChangeText={setLinkUrl}
          placeholder="https://example.com"
        />
        <Field
          label="Link title (optional)"
          value={linkTitle}
          onChangeText={setLinkTitle}
          placeholder="What is this link about?"
        />

        <Pressable
          accessibilityRole="button"
          onPress={addLink}
          style={styles.button}>
          <Text style={styles.buttonText}>+ Add link</Text>
        </Pressable>

        {links.map((link, index) => (
          <View key={`${link.url}-${index}`} style={styles.attachment}>
            <View style={styles.attachmentContent}>
              <Text style={styles.attachmentTitle}>
                {link.title || link.url}
              </Text>
              {link.title ? (
                <Text style={styles.attachmentDetail}>{link.url}</Text>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setLinks((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attach locations</Text>

        <Field
          label="Location name"
          value={locationName}
          onChangeText={setLocationName}
          placeholder="e.g. Neermahal"
        />
        <Field
          label="Address (optional)"
          value={locationAddress}
          onChangeText={setLocationAddress}
          placeholder="City, state"
        />
        <Field
          label="Latitude"
          value={locationLatitude}
          onChangeText={setLocationLatitude}
          placeholder="e.g. 23.4912"
        />
        <Field
          label="Longitude"
          value={locationLongitude}
          onChangeText={setLocationLongitude}
          placeholder="e.g. 91.3153"
        />

        <Pressable
          accessibilityRole="button"
          onPress={addLocation}
          style={styles.button}>
          <Text style={styles.buttonText}>+ Add location</Text>
        </Pressable>

        {locations.map((location, index) => (
          <View key={`${location.name}-${index}`} style={styles.attachment}>
            <View style={styles.attachmentContent}>
              <Text style={styles.attachmentTitle}>{location.name}</Text>
              {location.address ? (
                <Text style={styles.attachmentDetail}>{location.address}</Text>
              ) : null}
              <Text style={styles.attachmentDetail}>
                {location.latitude}, {location.longitude}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setLocations((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ComposerLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#51463E",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E7E0D9",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 15,
    color: "#51463E",
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#927461",
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E0D9",
  },
  attachmentContent: {
    flex: 1,
    gap: 4,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#51463E",
  },
  attachmentDetail: {
    fontSize: 12,
    color: "#927461",
  },
});
