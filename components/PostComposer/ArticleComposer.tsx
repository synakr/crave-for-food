import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ComposerLayout, Field } from "./ComposerUI";
import type { ComposerProps } from "./types";

// Approximate geographic bounds of Tripura.
function getRandomLocation() {
  const MIN_LATITUDE = 22.95;
  const MAX_LATITUDE = 24.53;
  const MIN_LONGITUDE = 91.15;
  const MAX_LONGITUDE = 92.33;

  return {
    latitude: MIN_LATITUDE + Math.random() * (MAX_LATITUDE - MIN_LATITUDE),
    longitude: MIN_LONGITUDE + Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE),
  };
}

export default function ArticleComposer({
  onSubmit,
  onCancel,
  submitting,
}: ComposerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [articleType, setArticleType] = useState("Article");
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationLatitude, setLocationLatitude] = useState("");
  const [locationLongitude, setLocationLongitude] = useState("");

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Allow photo library access to attach images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImageUris(result.assets.map((asset) => asset.uri));
    }
  };

  const publish = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert(
        "Missing content",
        "Add a title and write your article or poem.",
      );
      return;
    }

    // Marker location: temporarily generated randomly within Tripura.
    // This is independent of the optional metadata location below.
    const markerLocation = getRandomLocation();

    const metadata: Record<string, unknown> = { articleType };

    if (linkUrl.trim()) {
      metadata.links = [
        {
          url: linkUrl.trim(),
          ...(linkTitle.trim() ? { title: linkTitle.trim() } : {}),
        },
      ];
    }

    // Metadata location: coordinates explicitly entered by the user.
    const latitude = Number(locationLatitude);
    const longitude = Number(locationLongitude);

    if (
      locationName.trim() &&
      locationLatitude.trim() !== "" &&
      locationLongitude.trim() !== "" &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      metadata.locations = [
        {
          name: locationName.trim(),
          ...(locationAddress.trim()
            ? { address: locationAddress.trim() }
            : {}),
          latitude,
          longitude,
        },
      ];
    }

    try {
      await onSubmit({
        type: "ARTICLE",
        title: title.trim(),
        body: body.trim(),
        mediaUris: imageUris,
        metadata,

        // Top-level coordinates determine the map marker.
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude,
      });
    } catch {
      Alert.alert("Publish failed", "Your article could not be published.");
    }
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

      <Pressable onPress={pickImages} style={styles.imagePicker}>
        <Ionicons name="images-outline" size={22} color="#725B4D" />
        <Text style={styles.imagePickerText}>
          {imageUris.length
            ? `${imageUris.length} image${imageUris.length === 1 ? "" : "s"} selected`
            : "Add optional images"}
        </Text>
      </Pressable>

      {imageUris.length > 0 && (
        <View style={styles.previewRow}>
          {imageUris.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.preview} />
          ))}
        </View>
      )}

      <Field
        label="Link URL · Optional"
        value={linkUrl}
        onChangeText={setLinkUrl}
        placeholder="https://example.com/story"
      />

      <Field
        label="Link title · Optional"
        value={linkTitle}
        onChangeText={setLinkTitle}
        placeholder="Read the full story"
      />

      <Field
        label="Additional place · Optional"
        value={locationName}
        onChangeText={setLocationName}
        placeholder="Place name"
      />

      <Field
        label="Place address · Optional"
        value={locationAddress}
        onChangeText={setLocationAddress}
        placeholder="Address"
      />

      <View style={styles.coordinateRow}>
        <View style={styles.coordinateField}>
          <Field
            label="Latitude"
            value={locationLatitude}
            onChangeText={setLocationLatitude}
            placeholder="23.8315"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.coordinateField}>
          <Field
            label="Longitude"
            value={locationLongitude}
            onChangeText={setLocationLongitude}
            placeholder="91.2868"
            keyboardType="numeric"
          />
        </View>
      </View>
    </ComposerLayout>
  );
}

const styles = StyleSheet.create({
  imagePicker: {
    minHeight: 64,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D9CCC3",
    borderRadius: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 14,
  },
  imagePickerText: {
    color: "#725B4D",
    fontSize: 13,
    fontWeight: "700",
  },
  previewRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  preview: {
    width: 66,
    height: 66,
    borderRadius: 10,
    backgroundColor: "#EEE",
  },
  coordinateRow: {
    flexDirection: "row",
    gap: 10,
  },
  coordinateField: {
    flex: 1,
  },
});
