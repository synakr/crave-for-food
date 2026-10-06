import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import Badge from "@/components/Badge";
import { getCurrentUserId } from "../../constants/currentUser";
import { db } from "../../data/mock/db";

const { width } = Dimensions.get("window");

const GRID_GAP = 10;
const GRID_SIZE = (width - 40 - GRID_GAP) / 2;

// All badges
const BADGES = [
  {
    id: 1,
    level: 4,
    color: "#E8B28F",
    title: "Consistency Pro",
    description:
      "Has completed 90% of weekly activity goals over the past month.",
  },
  {
    id: 2,
    level: 3,
    color: "#BBD9EA",
    title: "Consistency Master",
    description:
      "Has maintained a consistent activity streak for three consecutive weeks.",
  },
  {
    id: 3,
    level: 2,
    color: "#BBEAC1",
    title: "Active Explorer",
    description: "Has consistently participated in weekly activities.",
  },
  {
    id: 4,
    level: 1,
    color: "#E1EABB",
    title: "Getting Started",
    description: "Has started building a consistent activity routine.",
  },
];

function LeafBranch({
  width = 64,
  height = 78,
  flip = false,
}: {
  width?: number;
  height?: number;
  flip?: boolean;
}) {
  const leafColor = "rgba(220,215,198,0.58)";
  const stemColor = "rgba(220,215,198,0.48)";

  return (
    <View
      style={[
        styles.leafBranch,
        {
          width,
          height,
          transform: [{ scaleX: flip ? -1 : 1 }],
        },
      ]}>
      <Svg width={width} height={height} viewBox="0 0 64 78" fill="none">
        {/* ============================================================ */}
        {/* STEM                                                         */}
        {/* ============================================================ */}

        <Path
          d="M8 75 C8 57 12 38 23 23 C29 15 36 9 44 4"
          stroke={stemColor}
          strokeWidth={1.35}
          strokeLinecap="round"
        />

        {/* ============================================================ */}
        {/* LEAVES                                                       */}
        {/* ============================================================ */}

        {/* Bottom outer */}
        <Path
          d="M11 63
             C4 61 2 56 3 52
             C9 53 13 56 14 61
             C14 62 13 63 11 63Z"
          fill={leafColor}
        />

        {/* Bottom inner */}
        <Path
          d="M13 68
             C14 61 18 57 23 56
             C24 62 21 67 15 70
             C14 70 13 69 13 68Z"
          fill={leafColor}
        />

        {/* Lower outer */}
        <Path
          d="M14 50
             C7 48 5 43 6 39
             C12 40 16 43 18 48
             C18 49 16 50 14 50Z"
          fill={leafColor}
        />

        {/* Lower inner */}
        <Path
          d="M18 54
             C18 47 22 42 27 40
             C28 47 25 52 20 55
             C19 55 18 55 18 54Z"
          fill={leafColor}
        />

        {/* Middle outer */}
        <Path
          d="M20 38
             C14 36 12 32 13 28
             C19 29 23 32 24 36
             C24 38 22 39 20 38Z"
          fill={leafColor}
        />

        {/* Middle inner */}
        <Path
          d="M24 42
             C24 35 28 30 33 28
             C34 35 31 40 26 43
             C25 43 24 43 24 42Z"
          fill={leafColor}
        />

        {/* Upper outer */}
        <Path
          d="M28 27
             C23 25 21 21 22 18
             C27 18 31 21 32 25
             C32 26 30 28 28 27Z"
          fill={leafColor}
        />

        {/* Upper inner */}
        <Path
          d="M32 31
             C32 24 36 19 41 17
             C42 23 39 29 34 32
             C33 32 32 32 32 31Z"
          fill={leafColor}
        />

        {/* Top outer */}
        <Path
          d="M38 17
             C34 14 34 10 36 7
             C41 9 43 12 42 16
             C41 17 40 18 38 17Z"
          fill={leafColor}
        />

        {/* Top inner */}
        <Path
          d="M42 20
             C43 14 47 9 52 8
             C52 14 49 19 44 21
             C43 21 42 21 42 20Z"
          fill={leafColor}
        />

        {/* ============================================================ */}
        {/* SUBTLE CENTRAL VEIN                                         */}
        {/* ============================================================ */}

        <Path
          d="M10 60 C18 46 27 31 43 10"
          stroke="rgba(220,215,198,0.20)"
          strokeWidth={0.65}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Fallback Content                                                           */
/* -------------------------------------------------------------------------- */

const FALLBACK_POSTS = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=85",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=85",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=85",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=85",
];

const FALLBACK_VIEWS = [
  "3,095",
  "1,832",
  "1,628",
  "982",
  "764",
  "621",
  "513",
  "402",
];

/* -------------------------------------------------------------------------- */
/* Profile Screen                                                             */
/* -------------------------------------------------------------------------- */

export default function ProfileScreen() {
  const [selectedBadge, setSelectedBadge] = useState(0);
  const currentUserId = getCurrentUserId();

  const currentUser = useMemo(
    () => db.users.find((user) => user.id === currentUserId),
    [currentUserId],
  );

  const userPosts = useMemo(
    () => db.posts.filter((post) => post.author_id === currentUserId),
    [currentUserId],
  );

  const followersCount = useMemo(
    () =>
      db.follows.filter((follow) => follow.following_id === currentUserId)
        .length,
    [currentUserId],
  );

  const followingCount = useMemo(
    () =>
      db.follows.filter((follow) => follow.follower_id === currentUserId)
        .length,
    [currentUserId],
  );

  const profileImage = useMemo(
    () => currentUser?.avatar_url ?? "https://i.pravatar.cc/600?img=12",
    [currentUser?.avatar_url],
  );

  /*
   * Hero image.
   *
   * Replace this with a dedicated cover image from your
   * database later if you add one.
   */
  const heroImage = useMemo(
    () => (userPosts.length > 0 ? FALLBACK_POSTS[0] : profileImage),
    [profileImage, userPosts.length],
  );

  /*
   * Keep the UI populated during development when the
   * current user has no posts in the mock database.
   */
  const displayPosts = useMemo(
    () =>
      userPosts.length > 0
        ? userPosts.map(
            (_, index) => FALLBACK_POSTS[index % FALLBACK_POSTS.length],
          )
        : FALLBACK_POSTS,
    [userPosts.length],
  );

  const selectedBadgeData = BADGES[selectedBadge] ?? BADGES[0];

  /* ---------------------------------------------------------------------- */
  /* Scroll Animation                                                       */
  /* ---------------------------------------------------------------------- */

  const scrollY = useRef(new Animated.Value(0)).current;

  /*
   * Image gradually becomes blurred as the content
   * moves over it.
   */
  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 80, 180, 300],
    outputRange: [0, 0.15, 0.55, 1],
    extrapolate: "clamp",
  });

  /*
   * Dark glass tint becomes stronger while scrolling.
   */
  const glassOpacity = scrollY.interpolate({
    inputRange: [0, 100, 250],
    outputRange: [0, 0.55, 0.82],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* ================================================================== */}
      {/* FIXED HERO BACKGROUND                                              */}
      {/* ================================================================== */}

      <View pointerEvents="none" style={styles.fixedHero}>
        <Image
          source={{ uri: heroImage }}
          style={styles.fixedHeroImage}
          resizeMode="cover"
        />

        {/* Initial dark treatment */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.12)",
            "rgba(0,0,0,0.02)",
            "rgba(7,10,16,0.15)",
            "rgba(7,10,16,0.72)",
            "#090C12",
          ]}
          locations={[0, 0.28, 0.5, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* ================================================================ */}
        {/* ANIMATED BLUR                                                    */}
        {/* ================================================================ */}

        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: blurOpacity,
            },
          ]}>
          <BlurView
            intensity={85}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* ================================================================ */}
        {/* ANIMATED GLASS TINT                                              */}
        {/* ================================================================ */}

        <Animated.View
          style={[
            styles.fixedGlass,
            {
              opacity: glassOpacity,
            },
          ]}
        />

        {/* ================================================================ */}
        {/* HERO BOTTOM FADE                                                 */}
        {/* ================================================================ */}

        <LinearGradient
          colors={[
            "transparent",
            "rgba(9,12,18,0.25)",
            "rgba(9,12,18,0.85)",
            "#090C12",
          ]}
          locations={[0.35, 0.55, 0.78, 1]}
          style={styles.heroBottomFade}
        />
      </View>

      {/* ================================================================== */}
      {/* SCROLLABLE CONTENT                                                 */}
      {/* ================================================================== */}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}>
        {/* ================================================================ */}
        {/* HERO SPACER                                                      */}
        {/* ================================================================ */}

        <View style={styles.heroSpacer}>
          {/* Profile identity */}
          <View style={styles.identity}>
            <View style={styles.nameRow}>
              {/* Left leaf branch */}
              <LeafBranch width={58} height={72} flip={false} />

              <View style={styles.nameContent}>
                <Text style={styles.name}>
                  {currentUser?.name ?? "Olivia Beits"}
                </Text>

                <MaterialCommunityIcons
                  name="check-decagram"
                  size={23}
                  color="#4DA3FF"
                  style={styles.verifiedIcon}
                />
              </View>

              {/* Right leaf branch */}
              <LeafBranch width={58} height={72} flip />
            </View>

            {/* <Text style={styles.username}>
              @{currentUser?.username ?? "oliviia_be"}
            </Text> */}
          </View>
        </View>

        {/* ================================================================ */}
        {/* GLASS CONTENT SURFACE                                            */}
        {/* ================================================================ */}

        {/* ============================================================ */}
        {/* STATS                                                         */}
        {/* ============================================================ */}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{followingCount || 252}</Text>

            <Text style={styles.statLabel}>Following</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {followersCount ? formatNumber(followersCount) : "24K"}
            </Text>

            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userPosts.length || 732}</Text>

            <Text style={styles.statLabel}>Creations</Text>
          </View>
        </View>

        <View style={styles.contentSurface}>
          {/* ============================================================ */}
          {/* ACTIONS                                                       */}
          {/* ============================================================ */}

          <View style={styles.actions}>
            {/* Share */}
            <Pressable style={styles.iconButton}>
              <Ionicons name="share-outline" size={21} color="#fff" />
            </Pressable>

            {/* Follow */}
            <Pressable style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </Pressable>

            {/* Message */}
            <Pressable style={styles.iconButton}>
              <Ionicons name="chatbubble-outline" size={21} color="#fff" />
            </Pressable>
          </View>

          {/* ============================================================ */}
          {/* ACHIEVEMENT CARD                                             */}
          {/* ============================================================ */}

          {/* ============================================================ */}
          {/* BADGES                                                       */}
          {/* ============================================================ */}

          <View style={styles.badgeCard}>
            {/* Badge area — fixed height */}
            <View style={styles.badgeArea}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgesScroll}>
                {BADGES.map((badge, index) => (
                  <Pressable
                    key={badge.id}
                    onPress={() => setSelectedBadge(index)}
                    style={[
                      styles.badgeItem,
                      selectedBadge === index && styles.selectedBadge,
                    ]}>
                    <Badge shape="hexagon" color={badge.color} size={82}>
                      {badge.level}
                    </Badge>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Description area — fixed height */}
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeTitle}>{selectedBadgeData.title}</Text>

              <Text style={styles.badgeDescription} numberOfLines={3}>
                {selectedBadgeData.description}
              </Text>
            </View>
          </View>

          {/* ============================================================ */}
          {/* BIO                                                           */}
          {/* ============================================================ */}

          <View style={styles.bioCard}>
            <Text style={styles.bioText}>
              {currentUser?.bio ??
                "Curious mind, creative soul. Exploring places, building things, and collecting moments worth remembering."}
            </Text>
          </View>

          {/* ============================================================ */}
          {/* CREATIONS HEADER                                              */}
          {/* ============================================================ */}

          <View style={styles.creationsHeader}>
            <Text style={styles.creationsTitle}>Creations</Text>

            <Pressable>
              <Ionicons name="grid-outline" size={22} color="#9CA3B3" />
            </Pressable>
          </View>

          {/* ============================================================ */}
          {/* CREATIONS GRID                                                */}
          {/* ============================================================ */}

          <View style={styles.grid}>
            {displayPosts.map((image, index) => (
              <Pressable key={`${image}-${index}`} style={styles.gridItem}>
                <Image
                  source={{ uri: image }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />

                {/* Bottom gradient */}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.60)"]}
                  style={styles.gridGradient}
                />

                {/* Views */}
                <View style={styles.views}>
                  <Ionicons
                    name={index % 3 === 0 ? "play" : "eye-outline"}
                    size={14}
                    color="#fff"
                  />

                  <Text style={styles.viewsText}>
                    {FALLBACK_VIEWS[index % FALLBACK_VIEWS.length]}
                  </Text>
                </View>

                {/* Multiple media */}
                {index % 4 === 0 && (
                  <View style={styles.multipleIcon}>
                    <Ionicons name="copy-outline" size={17} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* ================================================================== */}
      {/* FIXED TOP HEADER                                                   */}
      {/* ================================================================== */}

      <View style={styles.fixedHeader}>
        {/* Username */}
        <Pressable style={styles.usernameButton}>
          <Text style={styles.fixedUsername}>
            {currentUser?.username ?? "unknown"}
          </Text>
        </Pressable>

        {/* Menu */}
        <Pressable style={styles.circleButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatNumber(value: number) {
  if (value >= 1000) {
    const formatted = value / 1000;

    return `${formatted.toFixed(formatted % 1 === 0 ? 0 : 1)}K`;
  }

  return value.toString();
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* ======================================================================== */
  /* Container                                                                */
  /* ======================================================================== */

  container: {
    flex: 1,
    backgroundColor: "#090C12",
  },

  /* ======================================================================== */
  /* Fixed Hero                                                               */
  /* ======================================================================== */

  fixedHero: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,

    height: width * 1.16,

    zIndex: 0,

    overflow: "hidden",
  },

  fixedHeroImage: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    width: "100%",
    height: "100%",
  },

  fixedGlass: {
    ...StyleSheet.absoluteFill,

    backgroundColor: "rgba(15,18,26,0.48)",
  },

  heroBottomFade: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: "65%",
  },

  /* ======================================================================== */
  /* Scroll                                                                    */
  /* ======================================================================== */

  scrollContent: {
    paddingBottom: 120,
  },

  heroSpacer: {
    height: width * 1.16,

    position: "relative",
  },

  /* ======================================================================== */
  /* Identity                                                                 */
  /* ======================================================================== */

  identity: {
    position: "absolute",

    left: 28,
    right: 28,
    bottom: 28,

    alignItems: "center",
  },

  name: {
    color: "#fff",

    fontSize: 31,
    fontWeight: "800",

    letterSpacing: -0.8,

    textAlign: "center",
  },

  username: {
    marginTop: 5,

    color: "rgba(255,255,255,0.72)",

    fontSize: 17,
    fontWeight: "500",
  },

  /* ======================================================================== */
  /* Content Surface                                                          */
  /* ======================================================================== */

  contentSurface: {
    position: "relative",

    marginTop: -1,

    // backgroundColor: "rgba(9,12,18,0.86)",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    borderTopWidth: 0,

    // borderTopColor: "rgba(255,255,255,0.10)",

    paddingTop: 22,

    overflow: "hidden",
  },

  /* ======================================================================== */
  /* Actions                                                                  */
  /* ======================================================================== */

  actions: {
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  followButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  followText: {
    color: "#101216",
    fontSize: 16,
    fontWeight: "700",
  },

  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#3A3F4B",
    backgroundColor: "rgba(23,26,33,0.82)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ======================================================================== */
  /* Stats                                                                    */
  /* ======================================================================== */

  stats: {
    paddingHorizontal: 36,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  statLabel: {
    marginTop: 2,
    color: "#AEB2BC",
    fontSize: 13,
    fontWeight: "500",
  },

  /* ======================================================================== */
  /* Bio                                                                      */
  /* ======================================================================== */

  bioCard: {
    marginTop: 26,
    marginHorizontal: 28,

    paddingHorizontal: 17,
    paddingVertical: 16,

    borderRadius: 18,

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.13)",

    backgroundColor: "rgba(255,255,255,0.055)",
  },

  bioText: {
    color: "#E7E8EC",

    fontSize: 16,
    lineHeight: 21,

    fontWeight: "400",
  },

  /* ======================================================================== */
  /* Creations Header                                                         */
  /* ======================================================================== */

  creationsHeader: {
    marginTop: 30,
    marginBottom: 14,

    paddingHorizontal: 28,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  creationsTitle: {
    color: "#fff",

    fontSize: 21,
    fontWeight: "700",
  },

  /* ======================================================================== */
  /* Grid                                                                     */
  /* ======================================================================== */

  grid: {
    paddingHorizontal: 20,

    flexDirection: "row",
    flexWrap: "wrap",

    gap: GRID_GAP,
  },

  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE * 1.12,

    borderRadius: 17,

    overflow: "hidden",

    position: "relative",

    backgroundColor: "#171A21",
  },

  gridImage: {
    width: "100%",
    height: "100%",
  },

  gridGradient: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: "45%",
  },

  /* ======================================================================== */
  /* Views                                                                    */
  /* ======================================================================== */

  views: {
    position: "absolute",

    left: 12,
    bottom: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  viewsText: {
    color: "#fff",

    fontSize: 13,
    fontWeight: "600",
  },

  /* ======================================================================== */
  /* Multiple Media                                                           */
  /* ======================================================================== */

  multipleIcon: {
    position: "absolute",

    top: 10,
    right: 10,
  },

  /* ======================================================================== */
  /* Fixed Header                                                             */
  /* ======================================================================== */

  fixedHeader: {
    position: "absolute",

    top: 20,
    left: 20,
    right: 20,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    zIndex: 100,
    elevation: 100,
  },

  usernameButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  fixedUsername: {
    color: "#fff",

    fontSize: 20,
    fontWeight: "700",

    letterSpacing: -0.3,

    textShadowColor: "rgba(0,0,0,0.4)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 4,
  },

  circleButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "rgba(110,115,125,0.55)",

    alignItems: "center",
    justifyContent: "center",
  },

  // verificaiton tick

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  nameContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },

  leafBranch: {
    alignItems: "center",
    justifyContent: "center",
  },

  verifiedIcon: {
    marginLeft: 7,
  },

  // achievements/ streak
  badgeCard: {
    marginHorizontal: 28,
    marginTop: 20,
    paddingTop: 10,
    height: 218,
    borderRadius: 24,
    backgroundColor: "#171B20",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.035)",
    overflow: "hidden",
  },

  // Fixed vertical space for badges
  badgeArea: {
    height: 105,
    justifyContent: "center",
  },

  badgesScroll: {
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 12,
  },

  badgeItem: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  selectedBadge: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  // Fixed vertical space for title + description
  badgeInfo: {
    height: 108,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 4,
  },

  badgeTitle: {
    height: 24,
    color: "#DDAF92",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  badgeDescription: {
    height: 52,
    marginTop: 6,
    color: "#777C83",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "500",
  },

  hexBadge: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "#BBD9EA",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "30deg" }],
  },

  badgeOrange: {
    backgroundColor: "#E8B28F",
  },

  badgeNumber: {
    color: "#4D5962",
    fontSize: 30,
    fontWeight: "700",
    transform: [{ rotate: "-30deg" }],
  },

  lockedHex: {
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "30deg" }],
  },

  lockedHexInner: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
});
