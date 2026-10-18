import type { CreatedEventPost } from "@/data/mock/eventPostStore";
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
import {
  PostBody,
  PostCard,
  PostTitle,
  rendererStyles,
} from "./PostRendererShell";
import type { PostRendererProps } from "./types";
const value = (
  metadata: Record<string, unknown> | null | undefined,
  key: string,
) => {
  const item = metadata?.[key];
  return typeof item === "string" || typeof item === "number"
    ? String(item)
    : "";
};
export default function EventPost(props: PostRendererProps) {
  const { post } = props;
  const date = value(post.metadata, "date");
  const start = value(post.metadata, "start_time");
  const end = value(post.metadata, "end_time");
  const category = value(post.metadata, "category") || "Event";
  const additionalLocations = Array.isArray(post.metadata?.locations)
    ? (post.metadata.locations as Array<Record<string, unknown>>)
    : [];
  const firstLocation = additionalLocations[0];
  const metadataLocation =
    typeof firstLocation?.name === "string" ? firstLocation.name : "";
  const location =
    value(post.metadata, "location") ||
    metadataLocation ||
    post.location ||
    "Location to be announced";
  return (
    <PostCard {...props}>
      <View style={rendererStyles.panel}>
        <Text style={rendererStyles.badgeText}>{category.toUpperCase()}</Text>
        <PostTitle>{post.title || "Community event"}</PostTitle>
        {post.caption ? <PostBody>{post.caption}</PostBody> : null}
        <View style={{ marginTop: 14, gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={18} color="#765F51" />
            <Text style={{ color: "#37302B", flex: 1 }}>
              {date || "Date to be announced"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Ionicons name="time-outline" size={18} color="#765F51" />
            <Text style={{ color: "#37302B", flex: 1 }}>
              {[start, end].filter(Boolean).join(" – ") ||
                "Time to be announced"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Ionicons name="location-outline" size={18} color="#765F51" />
            <Text style={{ color: "#37302B", flex: 1 }}>{location}</Text>
          </View>
        </View>
      </View>
    </PostCard>
  );
}

type EventPostModalProps = {
  post: CreatedEventPost;
  onClose: () => void;
};

export function CreatedEventPostModal({ post, onClose }: EventPostModalProps) {
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
    <View style={modalStyles.overlay}>
      <Pressable style={modalStyles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          modalStyles.card,
          hasImage ? modalStyles.imageCard : modalStyles.textCard,
          cardStyle,
        ]}>
        {hasImage && (
          <Image
            source={{ uri: post.imageUri! }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        )}
        {hasImage && <View style={modalStyles.imageShade} />}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={modalStyles.scrollContent}>
          <View style={modalStyles.header}>
            <View style={modalStyles.avatar}>
              <Text style={modalStyles.avatarText}>Y</Text>
            </View>

            <View style={modalStyles.headerInfo}>
              <Text
                style={[
                  modalStyles.username,
                  !hasImage && modalStyles.textDark,
                ]}>
                You
              </Text>
              <Text
                style={[modalStyles.meta, !hasImage && modalStyles.textMuted]}>
                Just now · NIT Agartala
              </Text>
            </View>

            <Pressable style={modalStyles.moreButton} onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={hasImage ? "#FFFFFF" : "#111111"}
              />
            </Pressable>
          </View>

          <View
            style={[
              modalStyles.category,
              hasImage ? modalStyles.categoryImage : modalStyles.categoryText,
            ]}>
            <Ionicons
              name="people-outline"
              size={19}
              color={hasImage ? "#FFFFFF" : "#111111"}
            />
            <Text
              style={[
                modalStyles.categoryLabel,
                !hasImage && modalStyles.textDark,
              ]}>
              {post.category}
            </Text>
          </View>

          <Text style={[modalStyles.title, !hasImage && modalStyles.textDark]}>
            {post.title}
          </Text>
          <Text
            style={[
              modalStyles.description,
              !hasImage && modalStyles.textDark,
            ]}>
            {post.description}
          </Text>

          <View
            style={[modalStyles.divider, !hasImage && modalStyles.dividerDark]}
          />

          <InfoRow
            icon="calendar-outline"
            text={post.date}
            hasImage={hasImage}
          />
          <InfoRow
            icon="time-outline"
            text={`${post.startTime} – ${post.endTime}`}
            hasImage={hasImage}
          />
          <InfoRow
            icon="location-outline"
            text={post.location}
            hasImage={hasImage}
          />
          <InfoRow
            icon="people-outline"
            text={post.audience}
            hasImage={hasImage}
          />

          <View
            style={[
              modalStyles.interestedCard,
              hasImage ? modalStyles.glass : modalStyles.lightCard,
            ]}>
            <View style={modalStyles.interestedAvatars}>
              <View
                style={[
                  modalStyles.smallAvatar,
                  hasImage && modalStyles.smallAvatarGlass,
                ]}>
                <Text
                  style={[
                    modalStyles.smallAvatarText,
                    !hasImage && modalStyles.textDark,
                  ]}>
                  Y
                </Text>
              </View>
              <View
                style={[
                  modalStyles.smallAvatar,
                  hasImage && modalStyles.smallAvatarGlass,
                  modalStyles.avatarOverlap,
                ]}>
                <Ionicons
                  name="person"
                  size={17}
                  color={hasImage ? "#FFFFFF" : "#555555"}
                />
              </View>
            </View>

            <Text
              style={[
                modalStyles.interestedText,
                !hasImage && modalStyles.textDark,
              ]}>
              {post.interested} people are interested
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={hasImage ? "#FFFFFF" : "#111111"}
            />
          </View>

          <View style={modalStyles.mainActions}>
            <Pressable style={modalStyles.interestedButton}>
              <Ionicons name="people" size={22} color="#111111" />
              <Text style={modalStyles.interestedButtonText}>
                I'm Interested
              </Text>
            </Pressable>
            <Pressable
              style={[
                modalStyles.saveButton,
                hasImage && modalStyles.saveButtonGlass,
              ]}>
              <Ionicons
                name="bookmark-outline"
                size={23}
                color={hasImage ? "#FFFFFF" : "#111111"}
              />
              <Text
                style={[
                  modalStyles.saveText,
                  !hasImage && modalStyles.textDark,
                ]}>
                Save
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              modalStyles.bottomDivider,
              !hasImage && modalStyles.dividerDark,
            ]}
          />
          <View style={modalStyles.socialActions}>
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
            <View style={modalStyles.actionSpacer} />
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
    <View style={modalStyles.infoRow}>
      <Ionicons
        name={icon}
        size={23}
        color={hasImage ? "#FFFFFF" : "#111111"}
      />
      <Text style={[modalStyles.infoText, !hasImage && modalStyles.textDark]}>
        {text}
      </Text>
    </View>
  );
}

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
    <View style={modalStyles.action}>
      <Ionicons
        name={icon}
        size={29}
        color={hasImage ? "#FFFFFF" : "#111111"}
      />
      <Text
        style={[modalStyles.actionValue, !hasImage && modalStyles.textDark]}>
        {value}
      </Text>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.58)" },
  card: {
    width: "92%",
    maxHeight: "88%",
    borderRadius: 30,
    overflow: "hidden",
  },
  imageCard: { backgroundColor: "#24201E" },
  textCard: { backgroundColor: "#F4F1ED" },
  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.48)",
  },
  scrollContent: { padding: 24, paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center" },
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
  avatarText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  headerInfo: { flex: 1, marginLeft: 12 },
  username: { fontSize: 19, fontWeight: "700", color: "#FFFFFF" },
  meta: { marginTop: 3, fontSize: 13, color: "rgba(255,255,255,0.72)" },
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
  categoryImage: { backgroundColor: "rgba(255,255,255,0.18)" },
  categoryText: { backgroundColor: "#E7E2DC" },
  categoryLabel: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
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
  dividerDark: { backgroundColor: "#D6D0CA" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 17,
  },
  infoText: { flex: 1, fontSize: 16, color: "#FFFFFF" },
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
  lightCard: { backgroundColor: "#E8E3DD" },
  interestedAvatars: { flexDirection: "row", width: 66 },
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
  smallAvatarGlass: { backgroundColor: "#444444" },
  avatarOverlap: { marginLeft: -14 },
  smallAvatarText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  interestedText: { flex: 1, fontSize: 15, color: "#FFFFFF", marginLeft: 8 },
  mainActions: { flexDirection: "row", gap: 12, marginTop: 14 },
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
  interestedButtonText: { fontSize: 16, fontWeight: "800", color: "#111111" },
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
  saveButtonGlass: { backgroundColor: "rgba(255,255,255,0.08)" },
  saveText: { fontSize: 15, color: "#FFFFFF" },
  bottomDivider: {
    height: 1,
    marginTop: 25,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  socialActions: { flexDirection: "row", alignItems: "center", gap: 28 },
  action: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionValue: { fontSize: 15, color: "#FFFFFF" },
  actionSpacer: { flex: 1 },
  textDark: { color: "#111111" },
  textMuted: { color: "#777777" },
});
