import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { CreatedEventPost } from "@/data/mock/createdPostStore";

type Props = {
  post: CreatedEventPost;
  onClose: () => void;
};

export default function CreatedEventPostModal({ post, onClose }: Props) {
  const animation = useRef(new Animated.Value(0)).current;

  const hasImage = Boolean(post.imageUri);

  useEffect(() => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const cardStyle = {
    opacity: animation,

    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [35, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.card,
          hasImage ? styles.imageCard : styles.textCard,
          cardStyle,
        ]}>
        {hasImage && (
          <Image
            source={{
              uri: post.imageUri!,
            }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        )}

        {hasImage && <View style={styles.imageShade} />}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Header */}

          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>Y</Text>
            </View>

            <View style={styles.headerInfo}>
              <Text style={[styles.username, !hasImage && styles.textDark]}>
                You
              </Text>

              <Text style={[styles.meta, !hasImage && styles.textMuted]}>
                Just now · NIT Agartala
              </Text>
            </View>

            <Pressable style={styles.moreButton} onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={hasImage ? "#FFFFFF" : "#111111"}
              />
            </Pressable>
          </View>

          {/* Category */}

          <View
            style={[
              styles.category,
              hasImage ? styles.categoryImage : styles.categoryText,
            ]}>
            <Ionicons
              name="people-outline"
              size={19}
              color={hasImage ? "#FFFFFF" : "#111111"}
            />

            <Text style={[styles.categoryLabel, !hasImage && styles.textDark]}>
              {post.category}
            </Text>
          </View>

          {/* Title */}

          <Text style={[styles.title, !hasImage && styles.textDark]}>
            {post.title}
          </Text>

          {/* Description */}

          <Text style={[styles.description, !hasImage && styles.textDark]}>
            {post.description}
          </Text>

          <View style={[styles.divider, !hasImage && styles.dividerDark]} />

          {/* Date */}

          <InfoRow
            icon="calendar-outline"
            text={post.date}
            hasImage={hasImage}
          />

          {/* Time */}

          <InfoRow
            icon="time-outline"
            text={`${post.startTime} – ${post.endTime}`}
            hasImage={hasImage}
          />

          {/* Location */}

          <InfoRow
            icon="location-outline"
            text={post.location}
            hasImage={hasImage}
          />

          {/* Audience */}

          <InfoRow
            icon="people-outline"
            text={post.audience}
            hasImage={hasImage}
          />

          {/* Interested */}

          <View
            style={[
              styles.interestedCard,
              hasImage ? styles.glass : styles.lightCard,
            ]}>
            <View style={styles.interestedAvatars}>
              <View
                style={[
                  styles.smallAvatar,
                  hasImage && styles.smallAvatarGlass,
                ]}>
                <Text
                  style={[
                    styles.smallAvatarText,
                    !hasImage && styles.textDark,
                  ]}>
                  Y
                </Text>
              </View>

              <View
                style={[
                  styles.smallAvatar,
                  hasImage && styles.smallAvatarGlass,
                  styles.avatarOverlap,
                ]}>
                <Ionicons
                  name="person"
                  size={17}
                  color={hasImage ? "#FFFFFF" : "#555555"}
                />
              </View>
            </View>

            <Text style={[styles.interestedText, !hasImage && styles.textDark]}>
              {post.interested} people are interested
            </Text>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={hasImage ? "#FFFFFF" : "#111111"}
            />
          </View>

          {/* Main actions */}

          <View style={styles.mainActions}>
            <Pressable style={styles.interestedButton}>
              <Ionicons name="people" size={22} color="#111111" />

              <Text style={styles.interestedButtonText}>I'm Interested</Text>
            </Pressable>

            <Pressable
              style={[styles.saveButton, hasImage && styles.saveButtonGlass]}>
              <Ionicons
                name="bookmark-outline"
                size={23}
                color={hasImage ? "#FFFFFF" : "#111111"}
              />

              <Text style={[styles.saveText, !hasImage && styles.textDark]}>
                Save
              </Text>
            </Pressable>
          </View>

          {/* Bottom actions */}

          <View
            style={[styles.bottomDivider, !hasImage && styles.dividerDark]}
          />

          <View style={styles.socialActions}>
            <Action
              icon="heart-outline"
              value={post.likes}
              hasImage={hasImage}
            />

            <Action
              icon="chatbubble-outline"
              value={post.comments}
              hasImage={hasImage}
            />

            <Ionicons
              name="paper-plane-outline"
              size={28}
              color={hasImage ? "#FFFFFF" : "#111111"}
            />

            <View style={styles.actionSpacer} />

            <Ionicons
              name="ellipsis-horizontal"
              size={27}
              color={hasImage ? "#FFFFFF" : "#111111"}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Info row                                                                    */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon,
  text,
  hasImage,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  hasImage: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={23}
        color={hasImage ? "#FFFFFF" : "#111111"}
      />

      <Text style={[styles.infoText, !hasImage && styles.textDark]}>
        {text}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Action                                                                      */
/* -------------------------------------------------------------------------- */

function Action({
  icon,
  value,
  hasImage,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  hasImage: boolean;
}) {
  return (
    <View style={styles.action}>
      <Ionicons
        name={icon}
        size={29}
        color={hasImage ? "#FFFFFF" : "#111111"}
      />

      <Text style={[styles.actionValue, !hasImage && styles.textDark]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 500,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.58)",
  },

  card: {
    width: "92%",
    maxHeight: "88%",
    borderRadius: 30,
    overflow: "hidden",
  },

  imageCard: {
    backgroundColor: "#24201E",
  },

  textCard: {
    backgroundColor: "#F4F1ED",
  },

  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.48)",
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  username: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  meta: {
    marginTop: 3,
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
  },

  moreButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  category: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },

  categoryImage: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  categoryText: {
    backgroundColor: "#E7E2DC",
  },

  categoryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  title: {
    marginTop: 25,
    fontSize: 36,
    lineHeight: 41,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#FFFFFF",
  },

  description: {
    marginTop: 18,
    fontSize: 17,
    lineHeight: 26,
    color: "#FFFFFF",
  },

  divider: {
    height: 1,
    marginVertical: 22,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  dividerDark: {
    backgroundColor: "#D6D0CA",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 17,
  },

  infoText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },

  interestedCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 18,
    marginTop: 7,
  },

  glass: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  lightCard: {
    backgroundColor: "#E8E3DD",
  },

  interestedAvatars: {
    flexDirection: "row",
    width: 66,
  },

  smallAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  smallAvatarGlass: {
    backgroundColor: "#444444",
  },

  avatarOverlap: {
    marginLeft: -14,
  },

  smallAvatarText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  interestedText: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
    marginLeft: 8,
  },

  mainActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  interestedButton: {
    flex: 1,
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  interestedButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111111",
  },

  saveButton: {
    width: 110,
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },

  saveButtonGlass: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  saveText: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  bottomDivider: {
    height: 1,
    marginTop: 25,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  socialActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  actionValue: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  actionSpacer: {
    flex: 1,
  },

  textDark: {
    color: "#111111",
  },

  textMuted: {
    color: "#777777",
  },
});
