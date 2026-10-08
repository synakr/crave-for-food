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

const COLORS = {
  background: "#FAF8F6",
  black: "#111111",
  muted: "rgba(17,17,17,0.48)",
  lightMuted: "rgba(17,17,17,0.32)",

  purple: "#B58BEF",
  purpleLight: "#C29AF2",

  yellow: "#FFBE55",
  blue: "#8799EF",
  pink: "#F25BA8",

  white: "#FFFFFF",
};

export default function ChallengeScreen() {
  const challenges = useMemo(() => selectPersonalChallenges(5), []);

  const dailyChallenge = challenges[0];
  const remainingChallenges = challenges;

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

  const dates = getWeekDates();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces>
        {/* ============================================================ */}
        {/* HEADER                                                       */}
        {/* ============================================================ */}

        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingTitle}>Hello, You</Text>

            <Text style={styles.greetingDate}>
              Today {formatDate(new Date())}
            </Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* DAILY CHALLENGE                                              */}
        {/* ============================================================ */}

        <View style={styles.dailyCard}>
          <View style={styles.dailyContent}>
            <Text style={styles.dailyLabel}>DAILY</Text>

            <Text style={styles.dailyTitle}>Challenge</Text>

            <Text style={styles.dailySubtitle}>
              Do your plan before 08:00 AM
            </Text>
            <Text style={styles.dailySubtitle}>
              Complete a challenge by sharing a post
            </Text>

            {/* Participant bubbles */}
            <View style={styles.participants}>
              <AvatarBubble index={0} />
              <AvatarBubble index={1} />
              <AvatarBubble index={2} />

              <View style={styles.moreBubble}>
                <Text style={styles.moreText}>+4</Text>
              </View>
            </View>
          </View>

          {/* Decorative flower */}
          <Flower />
        </View>

        {/* ============================================================ */}
        {/* DATE SELECTOR                                                */}
        {/* ============================================================ */}

        <View style={styles.dateSection}>
          {dates.map((date, index) => {
            const selected = index === 2;

            return (
              <Pressable
                key={date.key}
                style={[styles.dateItem, selected && styles.dateItemSelected]}>
                <Text
                  style={[styles.dateDay, selected && styles.dateSelectedText]}>
                  {date.day}
                </Text>

                {date.star ? (
                  <Ionicons
                    name="star"
                    size={13}
                    color={selected ? "#FFF" : COLORS.black}
                    style={styles.star}
                  />
                ) : null}

                <Text
                  style={[
                    styles.dateNumber,
                    selected && styles.dateSelectedText,
                  ]}>
                  {date.number}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ============================================================ */}
        {/* CHALLENGE LIST — REFERENCE STYLE                             */}
        {/* ============================================================ */}

        <View style={styles.challengeSection}>
          <View style={styles.challengeCard}>
            {remainingChallenges.map((challenge, index) => {
              const icon = getChallengeIcon(challenge.category);
              const reward = getChallengeReward(index);

              return (
                <Pressable
                  key={challenge.id}
                  onPress={() => handleChallenge(challenge)}
                  style={({ pressed }) => [
                    styles.challengeItem,
                    index !== remainingChallenges.length - 1 &&
                      styles.challengeItemBorder,
                    pressed && styles.challengeItemPressed,
                  ]}>
                  {/* Icon */}
                  <View style={styles.challengeIconBadge}>
                    <Ionicons name={icon} size={25} color="#9B9B9B" />
                  </View>

                  {/* Content */}
                  <View style={styles.challengeInfo}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.challengeTitle}>
                      {challenge.title} · {challenge.category}
                    </Text>

                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.challengeSubtitle}>
                      {challenge.prompt}
                    </Text>

                    <View style={styles.challengeProgress}>
                      <View style={styles.challengeProgressFill} />

                      <Text style={styles.challengeProgressText}>0 / 1</Text>
                    </View>
                  </View>

                  {/* Reward */}
                  <View style={styles.challengeReward}>
                    <Text style={styles.challengeRewardText}>{reward}</Text>

                    <View style={styles.rewardCoin}>
                      <Text style={styles.rewardCoinText}>B</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ============================================================ */}
        {/* YOUR PLAN                                                    */}
        {/* ============================================================ */}

        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>Your Plan</Text>
        </View>

        <View style={styles.planGrid}>
          {/* Large yellow card */}
          <Pressable
            onPress={() => dailyChallenge && handleChallenge(dailyChallenge)}
            style={({ pressed }) => [
              styles.planCard,
              styles.yellowCard,
              pressed && styles.planPressed,
            ]}>
            <Text style={styles.planIntensity}>Medium</Text>

            <Text style={styles.planName}>Explore</Text>

            <Text style={styles.planDate}>Today</Text>

            <Text style={styles.planTime}>14:00–15:00</Text>

            <Text style={styles.planRoom}>A5 Room</Text>

            <View style={styles.planBottom}>
              <View style={styles.trainerAvatar}>
                <Ionicons name="person" size={17} color="#555" />
              </View>

              <View>
                <Text style={styles.trainerLabel}>challenge</Text>
                <Text style={styles.trainerName}>Crave Daily</Text>
              </View>
            </View>

            <View style={styles.planDecorationYellow}>
              <Ionicons
                name="sparkles"
                size={44}
                color="rgba(255,255,255,0.55)"
              />
            </View>

            <View style={styles.planCount}>
              <Text style={styles.planCountText}>1</Text>
            </View>
          </Pressable>

          {/* Blue card */}
          <View style={[styles.planCard, styles.blueCard]}>
            <Text style={styles.planIntensity}>Light</Text>

            <Text style={styles.planName}>Balance</Text>

            <Text style={styles.planDate}>Today</Text>

            <Text style={styles.planTime}>14:00–15:00</Text>

            <Text style={styles.planRoom}>A3 Room</Text>

            <View style={styles.blueDecoration}>
              <View style={styles.blueBlobOne} />
              <View style={styles.blueBlobTwo} />
              <View style={styles.blueBlobThree} />
            </View>
          </View>

          {/* Pink action card */}
          <View style={styles.pinkCard}>
            <View style={styles.smallPeople}>
              <View style={styles.smallCircle}>
                <Text style={styles.smallCircleText}>+4</Text>
              </View>

              <View style={styles.smallIconCircle}>
                <Ionicons name="bookmark" size={15} color="#111" />
              </View>

              <View style={styles.smallIconCircle}>
                <Ionicons name="options" size={16} color="#111" />
              </View>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* FOOTER                                                       */}
        {/* ============================================================ */}

        <View style={styles.footer}>
          <Ionicons
            name="camera-outline"
            size={17}
            color="rgba(17,17,17,0.35)"
          />

          <Text style={styles.footerText}>
            Complete a challenge by sharing a post.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================================================================== */
/* DECORATIVE COMPONENTS                                               */
/* ================================================================== */

function Flower() {
  const petals = [
    { rotate: "0deg", x: 0, y: -34 },
    { rotate: "45deg", x: 25, y: -17 },
    { rotate: "90deg", x: 34, y: 0 },
    { rotate: "135deg", x: 25, y: 17 },
    { rotate: "180deg", x: 0, y: 34 },
    { rotate: "225deg", x: -25, y: 17 },
    { rotate: "270deg", x: -34, y: 0 },
    { rotate: "315deg", x: -25, y: -17 },
  ];

  return (
    <View style={styles.flower}>
      {petals.map((petal, index) => (
        <View
          key={index}
          style={[
            styles.petal,
            {
              transform: [
                { translateX: petal.x },
                { translateY: petal.y },
                { rotate: petal.rotate },
              ],
            },
          ]}
        />
      ))}

      <View style={styles.flowerCenter} />
    </View>
  );
}

function AvatarBubble({ index }: { index: number }) {
  const colors = ["#D9A5C6", "#D0C7BB", "#776C85"];

  return (
    <View
      style={[
        styles.avatarBubble,
        {
          backgroundColor: colors[index % colors.length],
          marginLeft: index === 0 ? 0 : -7,
        },
      ]}>
      <Ionicons name="person" size={13} color="#FFF" />
    </View>
  );
}

/* ================================================================== */
/* CHALLENGE HELPERS                                                  */
/* ================================================================== */

function getChallengeIcon(category: string): keyof typeof Ionicons.glyphMap {
  const value = category.toLowerCase();

  if (
    value.includes("food") ||
    value.includes("meal") ||
    value.includes("eat")
  ) {
    return "restaurant-outline";
  }

  if (
    value.includes("calorie") ||
    value.includes("energy") ||
    value.includes("fitness")
  ) {
    return "flash";
  }

  if (
    value.includes("mind") ||
    value.includes("mental") ||
    value.includes("wellness")
  ) {
    return "cloud-outline";
  }

  if (
    value.includes("social") ||
    value.includes("people") ||
    value.includes("friend")
  ) {
    return "people-outline";
  }

  return "ribbon-outline";
}

function getChallengeReward(index: number) {
  const rewards = [15, 25, 35, 35, 45];

  return rewards[index % rewards.length];
}

/* ================================================================== */
/* HELPERS                                                            */
/* ================================================================== */

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function getWeekDates() {
  const today = new Date();

  // Start from Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeek);

    date.setDate(startOfWeek.getDate() + index);

    return {
      key: date.toISOString(),
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      number: date.getDate(),

      // Example: show stars on some days
      star: index === 1 || index === 3,
    };
  });
}

/* ================================================================== */
/* STYLES                                                             */
/* ================================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 45,
  },

  /* --------------------------------------------------------------- */
  /* HEADER                                                           */
  /* --------------------------------------------------------------- */

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  greeting: {
    flex: 1,
    marginLeft: 12,
    alignItems: "center",
  },

  greetingTitle: {
    fontSize: 17,
    lineHeight: 19,
    fontWeight: "800",
    color: COLORS.black,
    letterSpacing: -0.5,
  },

  greetingDate: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
  },

  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  /* --------------------------------------------------------------- */
  /* DAILY CHALLENGE                                                  */
  /* --------------------------------------------------------------- */

  dailyCard: {
    height: 154,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.purple,
    position: "relative",
    flexDirection: "row",
    marginBottom: 18,
  },

  dailyContent: {
    paddingLeft: 20,
    paddingTop: 17,
    zIndex: 2,
  },

  dailyLabel: {
    fontSize: 26,
    lineHeight: 25,
    fontWeight: "900",
    color: COLORS.black,
    letterSpacing: -1.3,
  },

  dailyTitle: {
    fontSize: 27,
    lineHeight: 27,
    fontWeight: "900",
    color: COLORS.black,
    letterSpacing: -1.5,
  },

  dailySubtitle: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(17,17,17,0.72)",
  },

  participants: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
  },

  avatarBubble: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },

  moreBubble: {
    width: 29,
    height: 29,
    marginLeft: -5,
    borderRadius: 15,
    backgroundColor: "#625879",
    alignItems: "center",
    justifyContent: "center",
  },

  moreText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFF",
  },

  /* Flower */

  flower: {
    position: "absolute",
    width: 105,
    height: 105,
    right: 3,
    top: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  petal: {
    position: "absolute",
    width: 31,
    height: 62,
    borderRadius: 30,
    backgroundColor: "#FFC344",
  },

  flowerCenter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFD46A",
  },

  /* --------------------------------------------------------------- */
  /* CHALLENGE LIST                                                   */
  /* --------------------------------------------------------------- */

  challengeSection: {
    marginBottom: 18,
  },

  challengeCard: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 4,

    borderWidth: 1,
    borderColor: "rgba(17,17,17,0.035)",

    overflow: "hidden",
  },

  challengeItem: {
    minHeight: 96,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 9,
  },

  challengeItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(17,17,17,0.08)",
  },

  challengeItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.985 }],
  },

  /* --------------------------------------------------------------- */
  /* ICON                                                            */
  /* --------------------------------------------------------------- */

  challengeIconBadge: {
    width: 62,
    height: 62,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F7F7F7",

    borderWidth: 4,
    borderColor: "#E1E1E1",

    flexShrink: 0,
  },

  /* --------------------------------------------------------------- */
  /* CONTENT                                                         */
  /* --------------------------------------------------------------- */

  challengeInfo: {
    flex: 1,

    minWidth: 0,

    marginLeft: 12,
    marginRight: 7,

    justifyContent: "center",
  },

  challengeTitle: {
    fontSize: 13,
    lineHeight: 16,

    fontWeight: "800",

    color: "#262626",

    letterSpacing: -0.2,
  },

  challengeSubtitle: {
    marginTop: 2,

    fontSize: 11,
    lineHeight: 14,

    fontWeight: "600",

    color: "#A6A6A6",

    letterSpacing: -0.1,
  },

  /* --------------------------------------------------------------- */
  /* PROGRESS                                                        */
  /* --------------------------------------------------------------- */

  challengeProgress: {
    height: 19,

    marginTop: 6,

    borderRadius: 10,

    backgroundColor: "#F0F0F0",

    alignItems: "center",
    justifyContent: "center",

    position: "relative",

    overflow: "hidden",
  },

  challengeProgressFill: {
    position: "absolute",

    left: 0,
    top: 0,
    bottom: 0,

    width: "0%",

    borderRadius: 10,

    backgroundColor: "#DADADA",
  },

  challengeProgressText: {
    fontSize: 10,

    fontWeight: "500",

    color: "#A3A3A3",
  },

  /* --------------------------------------------------------------- */
  /* REWARD                                                          */
  /* --------------------------------------------------------------- */

  challengeReward: {
    width: 34,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "flex-end",

    flexShrink: 0,
  },

  challengeRewardText: {
    fontSize: 12,

    fontWeight: "700",

    color: "#606060",

    marginRight: 3,
  },

  rewardCoin: {
    width: 17,
    height: 17,

    borderRadius: 9,

    backgroundColor: "#FFB92F",

    alignItems: "center",
    justifyContent: "center",

    transform: [{ rotate: "-10deg" }],
  },

  rewardCoinText: {
    fontSize: 9,

    fontWeight: "900",

    color: "#FFF",

    lineHeight: 10,
  },

  /* --------------------------------------------------------------- */
  /* DATES                                                            */
  /* --------------------------------------------------------------- */

  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 21,
  },

  dateItem: {
    width: 43,
    height: 65,
    borderRadius: 23,

    borderWidth: 1.4,
    borderColor: "rgba(17,17,17,0.6)",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.25)",
  },

  dateItemSelected: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },

  dateDay: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
  },

  dateNumber: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.black,
  },

  dateSelectedText: {
    color: "#FFF",
  },

  star: {
    marginTop: 3,
    marginBottom: -1,
  },

  /* --------------------------------------------------------------- */
  /* PLAN                                                             */
  /* --------------------------------------------------------------- */

  planHeader: {
    marginBottom: 7,
  },

  planTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: COLORS.black,
    letterSpacing: -0.7,
  },

  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  planCard: {
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },

  yellowCard: {
    width: "56%",
    height: 272,
    padding: 18,
    backgroundColor: COLORS.yellow,
  },

  blueCard: {
    width: "40%",
    height: 190,
    padding: 16,
    backgroundColor: COLORS.blue,
  },

  pinkCard: {
    width: "40%",
    height: 72,
    borderRadius: 15,
    backgroundColor: COLORS.pink,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  planIntensity: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(17,17,17,0.8)",
  },

  planName: {
    marginTop: 7,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "500",
    color: COLORS.black,
    letterSpacing: -0.7,
  },

  planDate: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(17,17,17,0.72)",
  },

  planTime: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.black,
  },

  planRoom: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.black,
  },

  planBottom: {
    position: "absolute",
    left: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  trainerAvatar: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "#C79BAA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  trainerLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: "rgba(17,17,17,0.65)",
  },

  trainerName: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.black,
  },

  planDecorationYellow: {
    position: "absolute",
    right: -5,
    bottom: 52,
    width: 65,
    height: 65,
    borderRadius: 28,
    backgroundColor: "rgba(163,126,235,0.65)",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-15deg" }],
  },

  planCount: {
    position: "absolute",
    right: 7,
    bottom: 81,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: "#8069A6",
    alignItems: "center",
    justifyContent: "center",
  },

  planCountText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFF",
  },

  blueDecoration: {
    position: "absolute",
    right: -17,
    bottom: 1,
    width: 78,
    height: 76,
  },

  blueBlobOne: {
    position: "absolute",
    width: 24,
    height: 72,
    borderRadius: 20,
    right: 20,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.4)",
    transform: [{ rotate: "22deg" }],
  },

  blueBlobTwo: {
    position: "absolute",
    width: 24,
    height: 58,
    borderRadius: 20,
    right: 38,
    bottom: 6,
    backgroundColor: "rgba(255,255,255,0.33)",
    transform: [{ rotate: "22deg" }],
  },

  blueBlobThree: {
    position: "absolute",
    width: 23,
    height: 52,
    borderRadius: 20,
    right: 3,
    bottom: 9,
    backgroundColor: "rgba(255,255,255,0.33)",
    transform: [{ rotate: "22deg" }],
  },

  smallPeople: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  smallCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },

  smallCircleText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.black,
  },

  smallIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },

  planPressed: {
    transform: [{ scale: 0.98 }],
  },

  /* --------------------------------------------------------------- */
  /* FOOTER                                                           */
  /* --------------------------------------------------------------- */

  footer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    marginLeft: 6,
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.lightMuted,
  },

  pressedSmall: {
    transform: [{ scale: 0.9 }],
  },
});
