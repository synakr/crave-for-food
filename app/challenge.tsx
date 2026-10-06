import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { selectPersonalChallenges } from "@/data/challenges/personalChallengeSelector";
import type { PersonalChallenge } from "@/data/challenges/types";

export default function ChallengeScreen() {
  const challenges = useMemo(() => selectPersonalChallenges(5), []);

  const handleChallenge = async (challenge: PersonalChallenge) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera permission required",
        "Allow camera access to complete this challenge.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const imageUri = result.assets[0].uri;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newPost = {
        id: `challenge_${Date.now()}`,
        author_id: "local-user",
        place_id: null,
        caption: challenge.prompt,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),

        // ExplorePost fields
        image: imageUri,
        title: challenge.prompt,
        description: challenge.prompt,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,

        user: {
          name: "You",
          avatar: null,
        },

        location: "Current location",
        likes: 0,
      };

      console.log("LOCAL CHALLENGE POST:", newPost);

      router.back();
    } catch (error) {
      console.error("Failed to create challenge post:", error);

      Alert.alert(
        "Location unavailable",
        "Couldn't get your current location.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}>
            <Ionicons name="arrow-back" size={21} color="#111" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>TODAY</Text>

            <Text style={styles.title}>Daily Challenges</Text>

            <Text style={styles.subtitle}>
              A little reason to explore your day.
            </Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="sparkles" size={25} color="#111" />
          </View>

          <Text style={styles.heroTitle}>What will you discover?</Text>

          <Text style={styles.heroText}>
            Pick a challenge, capture the moment, and share it with Crave.
          </Text>
        </View>

        {/* Challenge list */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>YOUR CHALLENGES</Text>

          <Text style={styles.count}>{challenges.length}</Text>
        </View>

        <View style={styles.challengeList}>
          {challenges.map((challenge, index) => (
            <Pressable
              key={challenge.id}
              onPress={() => handleChallenge(challenge)}
              style={({ pressed }) => [
                styles.challengeCard,
                pressed && styles.challengePressed,
              ]}>
              <View style={styles.number}>
                <Text style={styles.numberText}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </View>

              <View style={styles.challengeContent}>
                <Text style={styles.category}>
                  {challenge.category.toUpperCase()}
                </Text>

                <Text style={styles.prompt}>{challenge.prompt}</Text>
              </View>

              <View style={styles.arrow}>
                <Ionicons name="chevron-forward" size={19} color="#111" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons
            name="camera-outline"
            size={18}
            color="rgba(17,17,17,0.4)"
          />

          <Text style={styles.footerText}>
            Complete a challenge by sharing a post.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4F2",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.82)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 3,
  },

  headerText: {
    flex: 1,
    marginLeft: 14,
    paddingTop: 2,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "rgba(17,17,17,0.4)",
  },

  title: {
    marginTop: 3,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: "#111",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: "rgba(17,17,17,0.5)",
  },

  hero: {
    padding: 22,
    borderRadius: 26,

    backgroundColor: "rgba(255,255,255,0.82)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",

    marginBottom: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,

    elevation: 3,
  },

  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(235,235,238,0.8)",

    marginBottom: 18,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    color: "#111",
  },

  heroText: {
    marginTop: 7,
    maxWidth: 300,

    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",

    color: "rgba(17,17,17,0.5)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 10,
    paddingHorizontal: 3,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "rgba(17,17,17,0.38)",
  },

  count: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(17,17,17,0.35)",
  },

  challengeList: {
    gap: 10,
  },

  challengeCard: {
    minHeight: 96,

    flexDirection: "row",
    alignItems: "center",

    padding: 14,

    borderRadius: 22,

    backgroundColor: "rgba(255,255,255,0.78)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.035,
    shadowRadius: 14,

    elevation: 2,
  },

  challengePressed: {
    transform: [{ scale: 0.985 }],
    backgroundColor: "rgba(235,235,238,0.8)",
  },

  number: {
    width: 42,
    height: 42,
    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(235,235,238,0.75)",
  },

  numberText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "rgba(17,17,17,0.45)",
  },

  challengeContent: {
    flex: 1,
    marginLeft: 13,
    paddingRight: 8,
  },

  category: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,

    color: "rgba(17,17,17,0.35)",
  },

  prompt: {
    marginTop: 4,

    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",

    color: "#111",
  },

  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(235,235,238,0.7)",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 28,
    paddingHorizontal: 15,
  },

  footerText: {
    marginLeft: 7,

    fontSize: 11,
    fontWeight: "500",

    color: "rgba(17,17,17,0.4)",
  },

  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
