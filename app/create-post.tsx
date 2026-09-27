import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PostContentType = "IMAGE" | "TEXT";

type PostMode = {
  type: PostContentType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const POST_MODES: PostMode[] = [
  {
    type: "IMAGE",
    label: "Photo",
    icon: "image-outline",
  },
  {
    type: "TEXT",
    label: "Text",
    icon: "text-outline",
  },
];

export default function CreatePostScreen() {
  const [mode, setMode] = useState<PostContentType>("IMAGE");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [text, setText] = useState("");

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to create a photo post.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.9,
    });

    if (result.canceled) return;

    const uri = result.assets[0]?.uri;

    if (!uri) return;

    setImageUri(uri);

    // Later:
    // 1. Upload image
    // 2. Create Post
    // 3. Create PostContent
    // 4. Select location
    //
    // For now we only keep the selected image locally.
  };

  const handleCreateTextPost = () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      Alert.alert("Empty post", "Write something before creating the post.");
      return;
    }

    // Later:
    // 1. Create Post
    // 2. Create PostContent with type = TEXT
    // 3. Select location

    console.log("Creating text post:", trimmedText);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Post</Text>
      </View>

      {/* Post type selector */}
      <View style={styles.modeSelector}>
        {POST_MODES.map((item) => {
          const active = mode === item.type;

          return (
            <Pressable
              key={item.type}
              style={[styles.modeButton, active && styles.modeButtonActive]}
              onPress={() => setMode(item.type)}>
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? "#FFFFFF" : "#777777"}
              />

              <Text style={[styles.modeText, active && styles.modeTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {mode === "IMAGE" ? (
          <>
            {!imageUri ? (
              <Pressable style={styles.imagePicker} onPress={handlePickImage}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={42}
                  color="#777777"
                />

                <Text style={styles.pickerTitle}>Choose a photo</Text>

                <Text style={styles.pickerSubtitle}>
                  Select an image from your device
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.previewContainer}
                onPress={handlePickImage}>
                <Image source={{ uri: imageUri }} style={styles.preview} />

                <View style={styles.changeImageOverlay}>
                  <Ionicons name="image-outline" size={20} color="#FFFFFF" />

                  <Text style={styles.changeImageText}>Change photo</Text>
                </View>
              </Pressable>
            )}
          </>
        ) : (
          <View style={styles.textContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="What's happening?"
              placeholderTextColor="#999999"
              multiline
              maxLength={1000}
              textAlignVertical="top"
              style={styles.textInput}
            />

            <Text style={styles.characterCount}>{text.length}/1000</Text>
          </View>
        )}
      </View>

      {/* Create button */}
      {mode === "TEXT" && (
        <Pressable
          style={[
            styles.createButton,
            !text.trim() && styles.createButtonDisabled,
          ]}
          onPress={handleCreateTextPost}
          disabled={!text.trim()}>
          <Text style={styles.createButtonText}>Create Post</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
  },

  modeSelector: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
  },

  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
  },

  modeButtonActive: {
    backgroundColor: "#111111",
  },

  modeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777777",
  },

  modeTextActive: {
    color: "#FFFFFF",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  imagePicker: {
    flex: 1,
    minHeight: 300,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CCCCCC",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },

  pickerTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "600",
    color: "#222222",
  },

  pickerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#888888",
  },

  previewContainer: {
    flex: 1,
    minHeight: 300,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F2F2F2",
  },

  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  changeImageOverlay: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  changeImageText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  textContainer: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#F7F7F7",
    padding: 16,
  },

  textInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 27,
    color: "#111111",
  },

  characterCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#999999",
  },

  createButton: {
    margin: 16,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#111111",
  },

  createButtonDisabled: {
    opacity: 0.35,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
