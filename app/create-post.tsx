import { addCreatedPost } from "@/data/mock/createdPostStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type EventCategory = "Meetup" | "Sports" | "Community" | "Other";

const CATEGORIES: {
  type: EventCategory;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    type: "Meetup",
    icon: "people-outline",
  },
  {
    type: "Sports",
    icon: "football-outline",
  },
  {
    type: "Community",
    icon: "leaf-outline",
  },
  {
    type: "Other",
    icon: "ellipsis-horizontal",
  },
];

const AUDIENCES = ["Open to everyone", "Friends only"];

export default function CreateTaskScreen() {
  const [category, setCategory] = useState<EventCategory>("Meetup");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [location, setLocation] = useState("");

  const [audience, setAudience] = useState("Open to everyone");

  const [imageUri, setImageUri] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Image                                                                      */
  /* -------------------------------------------------------------------------- */

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to add an image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0]?.uri;

    if (uri) {
      setImageUri(uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  /* -------------------------------------------------------------------------- */
  /* Create                                                                     */
  /* -------------------------------------------------------------------------- */

  const handleCreate = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();

    if (!trimmedTitle) {
      Alert.alert("Missing title", "Give your event a title.");
      return;
    }

    if (!trimmedDescription) {
      Alert.alert("Missing description", "Add some details about the event.");
      return;
    }

    if (!date) {
      Alert.alert("Missing date", "Add a date for the event.");
      return;
    }

    if (!startTime || !endTime) {
      Alert.alert("Missing time", "Add a start and end time.");
      return;
    }

    if (!trimmedLocation) {
      Alert.alert("Missing location", "Add a location.");
      return;
    }

    addCreatedPost({
      category,
      title: trimmedTitle,
      description: trimmedDescription,
      date,
      startTime,
      endTime,
      location: trimmedLocation,
      audience,
      imageUri,
    });

    router.back();
  };

  const canCreate =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    date.trim().length > 0 &&
    startTime.trim().length > 0 &&
    endTime.trim().length > 0 &&
    location.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#111111" />
          </Pressable>

          <Text style={styles.headerTitle}>Create Meetup</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* ---------------------------------------------------------------- */}
          {/* Category                                                         */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>Category</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}>
            {CATEGORIES.map((item) => {
              const active = category === item.type;

              return (
                <Pressable
                  key={item.type}
                  style={[
                    styles.categoryButton,
                    active && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(item.type)}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={active ? "#FFFFFF" : "#666666"}
                  />

                  <Text
                    style={[
                      styles.categoryText,
                      active && styles.categoryTextActive,
                    ]}>
                    {item.type}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ---------------------------------------------------------------- */}
          {/* Optional Image                                                  */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>
            Cover photo
            <Text style={styles.optional}> · Optional</Text>
          </Text>

          {!imageUri ? (
            <Pressable style={styles.imagePicker} onPress={handlePickImage}>
              <View style={styles.imagePickerIcon}>
                <Ionicons name="image-outline" size={25} color="#555555" />
              </View>

              <View style={styles.imagePickerText}>
                <Text style={styles.imagePickerTitle}>Add a photo</Text>

                <Text style={styles.imagePickerSubtitle}>
                  Make your event stand out
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={19} color="#999999" />
            </Pressable>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />

              <View style={styles.imagePreviewOverlay}>
                <Pressable style={styles.imageAction} onPress={handlePickImage}>
                  <Ionicons name="image-outline" size={18} color="#FFFFFF" />

                  <Text style={styles.imageActionText}>Change</Text>
                </Pressable>

                <Pressable style={styles.imageAction} onPress={removeImage}>
                  <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Title                                                            */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>Title</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Let's play cricket!"
            placeholderTextColor="#999999"
            style={styles.titleInput}
            maxLength={100}
          />

          <Text style={styles.characterCount}>{title.length}/100</Text>

          {/* ---------------------------------------------------------------- */}
          {/* Description                                                      */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>Description</Text>

          <View style={styles.descriptionContainer}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tell people what this is about..."
              placeholderTextColor="#999999"
              multiline
              textAlignVertical="top"
              maxLength={1000}
              style={styles.descriptionInput}
            />

            <Text style={styles.descriptionCharacterCount}>
              {description.length}/1000
            </Text>
          </View>

          {/* ---------------------------------------------------------------- */}
          {/* Date                                                             */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>Date</Text>

          <View style={styles.inputWithIcon}>
            <Ionicons name="calendar-outline" size={20} color="#666666" />

            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="e.g. Sat, 12 Oct 2026"
              placeholderTextColor="#999999"
              style={styles.iconInput}
            />
          </View>

          {/* ---------------------------------------------------------------- */}
          {/* Time                                                             */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>Time</Text>

          <View style={styles.timeRow}>
            <View style={[styles.inputWithIcon, styles.timeInput]}>
              <Ionicons name="time-outline" size={20} color="#666666" />

              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="4:00 PM"
                placeholderTextColor="#999999"
                style={styles.iconInput}
              />
            </View>

            <Text style={styles.timeSeparator}>—</Text>

            <View style={[styles.inputWithIcon, styles.timeInput]}>
              <Ionicons name="time-outline" size={20} color="#666666" />

              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                placeholder="7:00 PM"
                placeholderTextColor="#999999"
                style={styles.iconInput}
              />
            </View>
          </View>

          {/* ---------------------------------------------------------------- */}
          {/* Location                                                         */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>Location</Text>

          <View style={styles.inputWithIcon}>
            <Ionicons name="location-outline" size={20} color="#666666" />

            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Fateh Sagar Ground, Udaipur"
              placeholderTextColor="#999999"
              style={styles.iconInput}
            />
          </View>

          {/* ---------------------------------------------------------------- */}
          {/* Audience                                                         */}
          {/* ---------------------------------------------------------------- */}

          <Text style={styles.sectionLabel}>Who can join?</Text>

          <View style={styles.audienceRow}>
            {AUDIENCES.map((item) => {
              const active = audience === item;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.audienceButton,
                    active && styles.audienceButtonActive,
                  ]}
                  onPress={() => setAudience(item)}>
                  <Ionicons
                    name={
                      item === "Open to everyone"
                        ? "people-outline"
                        : "people-circle-outline"
                    }
                    size={19}
                    color={active ? "#FFFFFF" : "#555555"}
                  />

                  <Text
                    style={[
                      styles.audienceText,
                      active && styles.audienceTextActive,
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* ------------------------------------------------------------------ */}
        {/* Create                                                             */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.createButton,
              !canCreate && styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={!canCreate}>
            <Ionicons name="sparkles-outline" size={20} color="#FFFFFF" />

            <Text style={styles.createButtonText}>Create Meetup</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ========================================================================== */
/* Styles                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  header: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F3F3",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },

  headerSpacer: {
    width: 40,
  },

  scrollContent: {
    padding: 16,
  },

  sectionLabel: {
    marginTop: 20,
    marginBottom: 9,
    fontSize: 14,
    fontWeight: "700",
    color: "#222222",
  },

  optional: {
    fontWeight: "400",
    color: "#999999",
  },

  categoryRow: {
    gap: 9,
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E4",
  },

  categoryButtonActive: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  imagePicker: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  imagePickerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F1F1",
  },

  imagePickerText: {
    flex: 1,
    marginLeft: 12,
  },

  imagePickerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },

  imagePickerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#999999",
  },

  imagePreviewContainer: {
    height: 210,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#E5E5E5",
  },

  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imagePreviewOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  imageAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  imageActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  titleInput: {
    minHeight: 52,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E4",
    fontSize: 17,
    fontWeight: "600",
    color: "#111111",
  },

  characterCount: {
    alignSelf: "flex-end",
    marginTop: 5,
    fontSize: 11,
    color: "#999999",
  },

  descriptionContainer: {
    minHeight: 145,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E4",
  },

  descriptionInput: {
    flex: 1,
    minHeight: 105,
    fontSize: 15,
    lineHeight: 23,
    color: "#111111",
  },

  descriptionCharacterCount: {
    alignSelf: "flex-end",
    fontSize: 11,
    color: "#999999",
  },

  inputWithIcon: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E4",
  },

  iconInput: {
    flex: 1,
    fontSize: 15,
    color: "#111111",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  timeInput: {
    flex: 1,
  },

  timeSeparator: {
    fontSize: 18,
    color: "#888888",
  },

  audienceRow: {
    gap: 9,
  },

  audienceButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E4",
  },

  audienceButtonActive: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },

  audienceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
  },

  audienceTextActive: {
    color: "#FFFFFF",
  },

  bottomSpace: {
    height: 20,
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  createButton: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
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
