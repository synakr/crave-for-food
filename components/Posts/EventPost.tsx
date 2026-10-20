import type { CreatedEventPost } from "@/data/mock/eventPostStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PostActions from "./PostActions";
import type { PostRendererProps } from "./types";

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

const value = (
  metadata: Record<string, unknown> | null | undefined,
  key: string,
) => {
  const item = metadata?.[key];

  return typeof item === "string" || typeof item === "number"
    ? String(item)
    : "";
};

const noop = () => {};

const formatDate = (date: string) => {
  if (!date) return "Date to be announced";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    year: "numeric",
  });
};

// ---------------------------------------------------------
// EVENT PREVIEW CARD
// Existing preview behavior is preserved.
// ---------------------------------------------------------

export default function EventPost(props: PostRendererProps) {
  const { post, onLike, onComment, onSave, onPress } = props;

  const date = value(post.metadata, "date");
  const start =
    value(post.metadata, "start_time") || value(post.metadata, "startTime");
  const end =
    value(post.metadata, "end_time") || value(post.metadata, "endTime");

  const category = value(post.metadata, "category") || "Event";

  const additionalLocations = Array.isArray(post.metadata?.locations)
    ? (post.metadata.locations as Array<Record<string, unknown>>)
    : [];

  const firstLocation = additionalLocations[0];

  const location =
    value(post.metadata, "location") ||
    (typeof firstLocation?.name === "string" ? firstLocation.name : "") ||
    post.location ||
    "Location to be announced";

  const authorName = post.authorName || "You";

  const initials =
    authorName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "Y";

  return (
    <Pressable
      onPress={() => onPress?.(post)}
      style={previewStyles.card}
      accessibilityRole="button"
      accessibilityLabel={`View event ${post.title || "Community event"}`}>
      <View style={previewStyles.authorRow}>
        <View style={previewStyles.avatarFallback}>
          <Text style={previewStyles.avatarInitials}>{initials}</Text>
        </View>

        <View style={previewStyles.authorInfo}>
          <Text style={previewStyles.authorName} numberOfLines={1}>
            {authorName}
          </Text>

          <Text style={previewStyles.timestamp}>{post.createdAt || ""}</Text>
        </View>

        <Ionicons name="calendar-outline" size={20} color="#765F51" />
      </View>

      <View style={previewStyles.panel}>
        <Text style={previewStyles.category}>{category.toUpperCase()}</Text>

        <Text style={previewStyles.title}>
          {post.title || "Community event"}
        </Text>

        {!!post.caption && (
          <Text style={previewStyles.description}>{post.caption}</Text>
        )}

        <View style={previewStyles.details}>
          <PreviewInfoRow
            icon="calendar-outline"
            text={date || "Date to be announced"}
          />

          <PreviewInfoRow
            icon="time-outline"
            text={
              [start, end].filter(Boolean).join(" – ") || "Time to be announced"
            }
          />

          <PreviewInfoRow icon="location-outline" text={location} />
        </View>
      </View>

      <PostActions
        postId={post.id}
        onLike={onLike}
        onComment={onComment}
        onSave={onSave}
      />
    </Pressable>
  );
}

function PreviewInfoRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={previewStyles.infoRow}>
      <Ionicons name={icon} size={18} color="#765F51" />

      <Text style={previewStyles.infoText}>{text}</Text>
    </View>
  );
}

// ---------------------------------------------------------
// FULL-SCREEN EVENT DETAILS
// ---------------------------------------------------------

type EventPostModalProps = {
  post: CreatedEventPost | null;
  onClose: () => void;
};

export function CreatedEventPostModal({ post, onClose }: EventPostModalProps) {
  const animation = useRef(new Animated.Value(0)).current;

  const hasImage = Boolean(post?.imageUri);

  const date = post?.date || "";
  const formattedDate = formatDate(date);

  const startTime = post?.startTime || "";
  const endTime = post?.endTime || "";

  const timeLabel =
    [startTime, endTime].filter(Boolean).join(" - ") || "Time to be announced";

  const category = post?.category || "Event";

  useEffect(() => {
    if (!post) {
      animation.setValue(0);
      return;
    }

    animation.setValue(0);

    const entrance = Animated.spring(animation, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true,
    });

    entrance.start();

    return () => entrance.stop();
  }, [animation, post]);

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  return (
    <Modal
      visible={!!post}
      transparent={false}
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.screen}>
        {/* Full-screen event image; black is the default background. */}
        {hasImage && post?.imageUri ? (
          <Image
            source={{ uri: post.imageUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : null}

        {hasImage && (
          <>
            <View pointerEvents="none" style={styles.imageShade} />

            {/* Dark lower fade to blend the image into the content. */}
            <View pointerEvents="none" style={styles.bottomImageFade} />
          </>
        )}

        <Animated.View style={[styles.animatedContent, animatedStyle]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces
            alwaysBounceVertical={false}>
            {/* TOP NAVIGATION */}
            <View style={styles.navigation}>
              <Pressable
                onPress={onClose}
                style={styles.roundButton}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Go back">
                <Ionicons name="arrow-back" size={27} color="#FFFFFF" />
              </Pressable>

              <View style={styles.navigationRight}>
                <Pressable
                  onPress={noop}
                  style={styles.roundButton}
                  accessibilityRole="button"
                  accessibilityLabel="Share event">
                  <Ionicons
                    name="paper-plane-outline"
                    size={26}
                    color="#FFFFFF"
                  />
                </Pressable>

                <Pressable
                  onPress={noop}
                  style={styles.roundButton}
                  accessibilityRole="button"
                  accessibilityLabel="More event options">
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={27}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
            </View>

            {/* HERO */}
            <View style={styles.hero}>
              <View style={styles.categoryPill}>
                <Ionicons name="people-outline" size={22} color="#FFFFFF" />

                <Text style={styles.categoryText}>{category}</Text>
              </View>

              <Text style={styles.eventTitle}>
                {post?.title || "Community event"}
              </Text>

              {/* DATE AND TIME */}
              <View style={styles.dateTimeRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateMonth}>
                    {date
                      ? new Date(date).toString() !== "Invalid Date" &&
                        !Number.isNaN(new Date(date).getTime())
                        ? new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                          })
                        : ""
                      : ""}
                  </Text>

                  <Ionicons name="calendar-outline" size={30} color="#FFFFFF" />
                </View>

                <View style={styles.dateTimeInfo}>
                  <Text style={styles.fullDate}>{formattedDate}</Text>

                  <View style={styles.timeRow}>
                    <Ionicons
                      name="time-outline"
                      size={21}
                      color="rgba(255,255,255,0.85)"
                    />

                    <Text style={styles.timeText}>{timeLabel}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* LOCATION CARD */}
            <View style={styles.locationCard}>
              <View style={styles.mapPreview}>
                <Ionicons name="location" size={32} color="#FFFFFF" />
              </View>

              <View style={styles.locationDetails}>
                <Text style={styles.locationName} numberOfLines={2}>
                  {post?.location || "Location to be announced"}
                </Text>

                <Pressable
                  onPress={noop}
                  style={styles.directionButton}
                  accessibilityRole="button"
                  accessibilityLabel="Get directions">
                  <Ionicons name="navigate" size={15} color="#FFFFFF" />
                  <Text style={styles.directionText}>Get Direction</Text>
                </Pressable>
              </View>
            </View>

            {/* HOSTED BY */}
            <Pressable
              onPress={noop}
              style={styles.hostCard}
              accessibilityRole="button"
              accessibilityLabel="View event host">
              <Text style={styles.hostLabel}>Hosted By</Text>

              <View style={styles.hostRight}>
                <View style={styles.hostAvatar}>
                  <Ionicons name="person" size={22} color="#FFFFFF" />
                </View>

                <Text style={styles.hostName}>You</Text>

                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </View>
            </Pressable>

            {/* INTERESTED PEOPLE */}
            <Pressable
              onPress={noop}
              style={styles.interestedCard}
              accessibilityRole="button"
              accessibilityLabel="View interested people">
              <View style={styles.avatarStack}>
                <View style={styles.interestedAvatar}>
                  <Ionicons name="person" size={21} color="#FFFFFF" />
                </View>

                <View
                  style={[styles.interestedAvatar, styles.avatarStackOverlap]}>
                  <Ionicons name="person" size={21} color="#FFFFFF" />
                </View>

                <View
                  style={[styles.interestedAvatar, styles.avatarStackOverlap]}>
                  <Ionicons name="person" size={21} color="#FFFFFF" />
                </View>
              </View>

              <Text style={styles.interestedText}>
                {post?.interested ?? 0} people are interested
              </Text>

              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </Pressable>

            {/* ABOUT THE EVENT */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutHeading}>About The Event</Text>

              <View style={styles.descriptionSection}>
                <View style={styles.descriptionTitleRow}>
                  <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />

                  <Text style={styles.descriptionTitle}>{category}</Text>
                </View>

                <Text style={styles.descriptionText}>
                  {post?.description ||
                    post?.title ||
                    "More details about this event will be available soon."}
                </Text>
              </View>

              <View style={styles.descriptionDivider} />

              <View style={styles.descriptionSection}>
                <View style={styles.descriptionTitleRow}>
                  <Ionicons name="people-outline" size={20} color="#FFFFFF" />

                  <Text style={styles.descriptionTitle}>Event Details</Text>
                </View>

                <Text style={styles.descriptionText}>
                  {post?.audience || "Everyone is welcome to participate."}
                </Text>
              </View>
            </View>

            {/* Space reserved for the fixed bottom actions. */}
            <View style={styles.bottomContentSpace} />
          </ScrollView>

          {/* FIXED BOTTOM ACTIONS */}
          <View style={styles.bottomBar}>
            <Pressable
              onPress={noop}
              style={styles.joinButton}
              accessibilityRole="button"
              accessibilityLabel="Join the event">
              <Ionicons name="people" size={26} color="#FFFFFF" />

              <Text style={styles.joinButtonText}>Join the Event</Text>
            </Pressable>

            <Pressable
              onPress={noop}
              style={styles.bookmarkButton}
              accessibilityRole="button"
              accessibilityLabel="Save event">
              <Ionicons name="bookmark-outline" size={29} color="#FFFFFF" />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------
// PREVIEW STYLES
// ---------------------------------------------------------

const previewStyles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE7E2",
    overflow: "hidden",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#29231F",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    color: "#25211E",
    fontSize: 14,
    fontWeight: "700",
  },
  timestamp: {
    color: "#8B817A",
    fontSize: 11,
    marginTop: 3,
  },
  panel: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#F7F3EF",
  },
  category: {
    color: "#765F51",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    marginTop: 9,
    color: "#29231F",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
  },
  description: {
    color: "#61574F",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  details: {
    marginTop: 14,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoText: {
    color: "#37302B",
    flex: 1,
    fontSize: 13,
  },
});

// ---------------------------------------------------------
// EVENT DETAIL STYLES
// ---------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.37)",
  },
  bottomImageFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "65%",
    backgroundColor: "rgba(0,0,0,0.48)",
  },
  animatedContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 42,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },

  // Navigation
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navigationRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  roundButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
  },

  // Hero
  hero: {
    marginTop: 34,
  },
  categoryPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  eventTitle: {
    marginTop: 17,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 19,
    marginBottom: 19,
  },
  dateBadge: {
    width: 68,
    height: 74,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
  },
  dateMonth: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
  },
  dateDay: {
    marginTop: 1,
    color: "#FFFFFF",
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "700",
  },
  dateTimeInfo: {
    flex: 1,
    gap: 7,
  },
  fullDate: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  timeText: {
    color: "rgba(255,255,255,0.83)",
    fontSize: 13,
    flexShrink: 1,
  },

  // Location card
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 23,
    gap: 9,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.31)",
  },
  mapPreview: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  mapParkOne: {
    position: "absolute",
    width: 60,
    height: 45,
    top: -8,
    left: -8,
    borderRadius: 18,
    backgroundColor: "#C4E3B0",
  },
  mapParkTwo: {
    position: "absolute",
    width: 45,
    height: 40,
    bottom: -8,
    right: -8,
    borderRadius: 16,
    backgroundColor: "#CBE5B7",
  },
  mapRoad: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8D7CB",
  },
  mapRoadOne: {
    width: 160,
    height: 7,
    left: -32,
    top: 32,
    transform: [{ rotate: "-28deg" }],
  },
  mapRoadTwo: {
    width: 130,
    height: 6,
    left: -19,
    top: 61,
    transform: [{ rotate: "25deg" }],
  },
  mapRoadThree: {
    width: 6,
    height: 125,
    left: 34,
    top: -19,
    transform: [{ rotate: "24deg" }],
  },
  mapRoadFour: {
    width: 6,
    height: 125,
    right: 19,
    top: -19,
    transform: [{ rotate: "-17deg" }],
  },
  mapPin: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  locationDetails: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },
  locationName: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "500",
  },
  directionButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.33)",
    backgroundColor: "rgba(255,255,255,0.09)",
  },
  directionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  globeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },

  // Host
  hostCard: {
    minHeight: 62,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  hostLabel: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  hostRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#373737",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  hostName: {
    color: "#FFFFFF",
    fontSize: 13,
  },

  // Interested people
  interestedCard: {
    minHeight: 68,
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
    width: 79,
  },
  interestedAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#373737",
    borderWidth: 2,
    borderColor: "#D6D6D6",
  },
  avatarStackOverlap: {
    marginLeft: -12,
  },
  interestedText: {
    flex: 1,
    marginLeft: 7,
    color: "#FFFFFF",
    fontSize: 12,
  },

  // About
  aboutSection: {
    marginTop: 21,
  },
  aboutHeading: {
    color: "#FFFFFF",
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  descriptionSection: {
    paddingHorizontal: 3,
  },
  descriptionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 4,
  },
  descriptionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  descriptionText: {
    color: "rgba(255,255,255,0.91)",
    fontSize: 13,
    lineHeight: 19,
  },
  descriptionDivider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: "rgba(255,255,255,0.23)",
  },
  bottomContentSpace: {
    height: 88,
  },

  // Fixed bottom CTA
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
    // backgroundColor: "rgba(0,0,0,0.92)",
  },
  joinButton: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#2864F5",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  bookmarkButton: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.43)",
  },
});
