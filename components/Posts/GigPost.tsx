import type {
  GigPost as GigPostData,
  GigPostLink,
  GigPostLocation,
} from "@/data/mock/gigPostStore";
import { Ionicons } from "@expo/vector-icons";
import { useState, type ComponentProps, type ReactNode } from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { PostRendererProps } from "./types";

type UnknownRecord = Record<string, unknown>;
type IconName = ComponentProps<typeof Ionicons>["name"];

const COLORS = {
  background: "#F8F7F1",
  surface: "#FFFEFA",
  card: "#F2F0E7",
  lime: "#B9F263",
  limeLight: "#EEF8D9",
  dark: "#142117",
  green: "#183D20",
  text: "#171C18",
  secondary: "#686963",
  muted: "#8B8C83",
  border: "#E8E6DD",
  black: "#090D0A",
  white: "#FFFFFF",
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const textValue = (
  metadata: UnknownRecord | null | undefined,
  ...keys: string[]
): string => {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const getLinks = (value: unknown): GigPostLink[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is GigPostLink =>
        isRecord(item) &&
        typeof item.url === "string" &&
        /^https?:\/\//i.test(item.url),
    )
    .map((item) => ({
      url: item.url,
      ...(typeof item.title === "string" ? { title: item.title } : {}),
    }));
};

const getLocations = (value: unknown): GigPostLocation[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is GigPostLocation =>
        isRecord(item) &&
        typeof item.name === "string" &&
        typeof item.latitude === "number" &&
        Number.isFinite(item.latitude) &&
        typeof item.longitude === "number" &&
        Number.isFinite(item.longitude),
    )
    .map((item) => ({
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      ...(typeof item.address === "string" ? { address: item.address } : {}),
    }));
};

const getImageUrls = (metadata: UnknownRecord | null | undefined): string[] => {
  if (!metadata) return [];

  const candidates = [
    metadata.images,
    metadata.imageUrls,
    metadata.image_urls,
    metadata.mediaUrls,
    metadata.media_urls,
    metadata.gallery,
    metadata.imageUrl,
    metadata.image_url,
    metadata.coverImage,
    metadata.cover_image,
    metadata.image,
  ];

  const urls: string[] = [];

  for (const candidate of candidates) {
    const values = Array.isArray(candidate) ? candidate : [candidate];

    for (const value of values) {
      let url: string | undefined;

      if (typeof value === "string") {
        url = value;
      } else if (isRecord(value)) {
        if (typeof value.url === "string") {
          url = value.url;
        } else if (typeof value.uri === "string") {
          url = value.uri;
        }
      }

      if (url && /^https?:\/\//i.test(url) && !urls.includes(url)) {
        urls.push(url);
      }
    }
  }

  return urls;
};

async function openExternalLink(url: string) {
  try {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  } catch {
    // Keep the post usable if the device cannot open the URL.
  }
}

async function shareText(message: string) {
  if (!message.trim()) return;

  try {
    await Share.share({ message });
  } catch {
    // Sharing is optional.
  }
}

function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 22,
  background = COLORS.card,
}: {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  background?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: background },
        pressed && styles.pressed,
      ]}>
      <Ionicons name={icon} size={size} color={COLORS.text} />
    </Pressable>
  );
}

function TypeBadge({ label }: { label: string }) {
  return (
    <View style={styles.typeBadge}>
      <Ionicons name="briefcase-outline" size={21} color={COLORS.green} />
      <Text style={styles.typeBadgeText}>{label}</Text>
    </View>
  );
}

function HeroGallery({
  images,
  height,
  onBack,
  onMore,
}: {
  images: string[];
  height: number;
  onBack?: () => void;
  onMore?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const visibleImages = images.filter((url) => !failedImages.includes(url));
  const currentIndex = Math.min(
    activeIndex,
    Math.max(visibleImages.length - 1, 0),
  );

  return (
    <View style={[styles.hero, { height }]}>
      {visibleImages.length > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={StyleSheet.absoluteFill}
          onMomentumScrollEnd={(event) => {
            const width = Math.max(
              event.nativeEvent.layoutMeasurement.width,
              1,
            );
            setActiveIndex(
              Math.round(event.nativeEvent.contentOffset.x / width),
            );
          }}>
          {visibleImages.map((uri, index) => (
            <View
              key={`${uri}-${index}`}
              style={[styles.heroSlide, { height }]}>
              <Image
                source={{ uri }}
                resizeMode="cover"
                style={styles.heroImage}
                onError={() => {
                  setFailedImages((previous) =>
                    previous.includes(uri) ? previous : [...previous, uri],
                  );
                }}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.heroPlaceholder, { height }]}>
          <Ionicons name="briefcase-outline" size={60} color="#B6C6A4" />
          <Text style={styles.placeholderText}>GIG OPPORTUNITY</Text>
        </View>
      )}

      <View style={styles.heroTop}>
        {onBack ? (
          <IconButton
            icon="chevron-back"
            onPress={onBack}
            accessibilityLabel="Go back"
            size={27}
            background="rgba(255,254,250,0.94)"
          />
        ) : (
          <View />
        )}

        {onMore ? (
          <IconButton
            icon="ellipsis-horizontal"
            onPress={onMore}
            accessibilityLabel="More gig options"
            size={24}
            background="rgba(255,254,250,0.94)"
          />
        ) : null}
      </View>

      <View style={styles.pagination}>
        <Text style={styles.paginationText}>
          {visibleImages.length > 0
            ? `${currentIndex + 1} / ${visibleImages.length}`
            : "1 / 1"}
        </Text>
      </View>
    </View>
  );
}

function DetailCard({
  icon,
  label,
  value,
  subtitle,
  fullWidth = false,
  trailing,
}: {
  icon: IconName;
  label: string;
  value: string;
  subtitle?: string;
  fullWidth?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <View style={[styles.detailCard, fullWidth && styles.detailCardFull]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={27} color={COLORS.green} />
      </View>

      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
        {subtitle ? (
          <Text style={styles.detailSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {trailing}
    </View>
  );
}

function LocationList({ locations }: { locations: GigPostLocation[] }) {
  if (!locations.length) return null;

  return (
    <View style={styles.extraLocations}>
      {locations.map((item, index) => (
        <View
          key={`${item.name}-${item.latitude}-${item.longitude}-${index}`}
          style={styles.locationRow}>
          <Ionicons name="location-outline" size={19} color={COLORS.green} />
          <View style={styles.locationCopy}>
            <Text style={styles.locationName}>{item.name}</Text>
            {item.address ? (
              <Text style={styles.locationAddress}>{item.address}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

function LinkList({ links }: { links: GigPostLink[] }) {
  if (!links.length) return null;

  return (
    <View style={styles.linksSection}>
      {links.map((link, index) => (
        <Pressable
          key={`${link.url}-${index}`}
          onPress={() => void openExternalLink(link.url)}
          accessibilityRole="link"
          accessibilityLabel={link.title || link.url}
          style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}>
          <View style={styles.linkIcon}>
            <Ionicons name="link-outline" size={27} color={COLORS.green} />
          </View>

          <View style={styles.linkCopy}>
            <Text style={styles.linkTitle} numberOfLines={1}>
              {link.title || "Open link"}
            </Text>
            <Text style={styles.linkUrl} numberOfLines={1}>
              {link.url}
            </Text>
          </View>

          <Ionicons name="open-outline" size={24} color={COLORS.text} />
        </Pressable>
      ))}
    </View>
  );
}

function ApplyButton({
  link,
  disabled = false,
}: {
  link?: GigPostLink;
  disabled?: boolean;
}) {
  const label = link?.title || "Apply :)";
  const isDisabled = disabled || !link?.url;

  return (
    <Pressable
      onPress={() => {
        if (link?.url && !isDisabled) {
          void openExternalLink(link.url);
        }
      }}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.applyButton,
        (pressed || isDisabled) && styles.applyButtonPressed,
      ]}>
      <Ionicons name="open-outline" size={27} color={COLORS.black} />
      <Text style={styles.applyButtonText}>{label}</Text>
    </Pressable>
  );
}

function GigDetailsContent({
  title,
  description,
  gigType,
  location,
  contact,
  locations,
  links,
  timestamp,
  onShare,
  onShareContact,
  isBookmarked,
  onToggleBookmark,
}: {
  title: string;
  description: string;
  gigType: string;
  location: string;
  contact: string;
  locations: GigPostLocation[];
  links: GigPostLink[];
  timestamp: string;
  onShare: () => void;
  onShareContact?: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const parts = location.split(",").map((part) => part.trim());
  const locationTitle = parts[0] || "Location flexible";
  const locationSubtitle =
    parts.length > 1 ? parts.slice(1).join(", ") : undefined;

  return (
    <View style={styles.detailsContent}>
      <View style={styles.detailsHeader}>
        <TypeBadge label={gigType} />

        <View style={styles.headerActions}>
          <IconButton
            icon="share-outline"
            onPress={onShare}
            accessibilityLabel="Share gig"
          />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      <View style={styles.detailsGrid}>
        <View style={styles.detailsColumn}>
          <DetailCard
            icon="location-outline"
            label="Location"
            value={locationTitle}
            subtitle={locationSubtitle}
          />
        </View>
      </View>

      <DetailCard
        icon="mail-outline"
        label="Contact"
        value={contact || "Contact details unavailable"}
        fullWidth
        trailing={
          <Pressable
            onPress={onShareContact}
            disabled={!contact || !onShareContact}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Share contact"
            style={({ pressed }) => [
              styles.copyButton,
              pressed && styles.pressed,
            ]}>
            <Ionicons
              name="share-outline"
              size={23}
              color={contact && onShareContact ? COLORS.text : COLORS.muted}
            />
          </Pressable>
        }
      />

      <LocationList locations={locations} />

      {links.length > 0 ? (
        <View style={styles.linkSection}>
          <Text style={styles.sectionTitle}>Links</Text>
          <LinkList links={links} />
        </View>
      ) : null}
    </View>
  );
}

function GigOptionsMenu({
  visible,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onClose,
}: {
  visible: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        <View style={styles.menuCard}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              onToggleBookmark();
              onClose();
            }}>
            <Ionicons
              name={isBookmarked ? "bookmark-outline" : "bookmark"}
              size={21}
              color={COLORS.text}
            />
            <Text style={styles.menuText}>
              {isBookmarked ? "Remove bookmark" : "Save gig"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              onClose();
              onShare();
            }}>
            <Ionicons name="share-outline" size={21} color={COLORS.text} />
            <Text style={styles.menuText}>Share gig</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function GigPost(props: PostRendererProps) {
  const { post } = props;
  const metadata = post.metadata as UnknownRecord | null | undefined;

  const gigType = textValue(metadata, "gigType", "gig_type") || "Gig";
  const location =
    textValue(metadata, "location") || post.location || "Location flexible";
  const contact = textValue(metadata, "contact");
  const links = getLinks(metadata?.links);
  const locations = getLocations(metadata?.locations);
  const images = getImageUrls(metadata);
  const primaryLink = links[0];

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleShare = () =>
    void shareText(
      [
        post.title || "Gig opportunity",
        post.caption || "",
        primaryLink?.url || "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    );

  const handleShareContact = () => {
    if (contact) void shareText(contact);
  };

  return (
    <View style={styles.postPanel}>
      <View style={styles.feedCard}>
        <HeroGallery images={images} height={200} />

        <View style={styles.feedSheet}>
          <GigDetailsContent
            title={post.title || "Gig opportunity"}
            description={post.caption || ""}
            gigType={gigType}
            location={location}
            contact={contact}
            locations={locations}
            links={links}
            timestamp={post.createdAt || "2h ago"}
            onShare={handleShare}
            onShareContact={handleShareContact}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => setIsBookmarked((previous) => !previous)}
          />

          <View style={styles.feedFooter}>
            <ApplyButton link={primaryLink} disabled={!primaryLink} />
          </View>
        </View>
      </View>

      <GigOptionsMenu
        visible={menuVisible}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => setIsBookmarked((previous) => !previous)}
        onShare={handleShare}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}

type GigPostModalProps = {
  post: GigPostData | null;
  onClose: () => void;
};

export function GigPostModal({ post, onClose }: GigPostModalProps) {
  const { height: windowHeight } = useWindowDimensions();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const metadata = post?.metadata as UnknownRecord | null | undefined;
  const links = getLinks(metadata?.links);
  const locations = getLocations(metadata?.locations);
  const images = getImageUrls(metadata);
  const primaryLink = links[0];

  const location =
    textValue(metadata, "location") || post?.location || "Location flexible";
  const contact = textValue(metadata, "contact") || post?.contact || "";

  const handleShare = () => {
    if (!post) return;

    void shareText(
      [
        post.title || "Gig opportunity",
        post.description || "",
        primaryLink?.url || "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
  };

  const handleShareContact = () => {
    if (contact) void shareText(contact);
  };

  return (
    <Modal
      visible={!!post}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.modal, { maxHeight: windowHeight * 0.96 }]}>
          <HeroGallery
            images={images}
            height={Math.min(windowHeight * 0.37, 390)}
            onBack={onClose}
            onMore={() => setMenuVisible(true)}
          />

          <View style={modalStyles.sheet}>
            {post ? (
              <ScrollView
                style={modalStyles.content}
                contentContainerStyle={modalStyles.contentContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled>
                <GigDetailsContent
                  title={post.title || "Gig opportunity"}
                  description={post.description || ""}
                  gigType={post.gigType || "Gig"}
                  location={location}
                  contact={contact}
                  locations={locations}
                  links={links}
                  timestamp={post.createdAt || "2h ago"}
                  onShare={handleShare}
                  onShareContact={contact ? handleShareContact : undefined}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={() =>
                    setIsBookmarked((previous) => !previous)
                  }
                />
              </ScrollView>
            ) : null}

            <View style={styles.feedFooter}>
              <View style={styles.bottomBar}>
                {/* Primary apply action */}
                <View style={styles.applyButtonWrapper}>
                  <ApplyButton link={primaryLink} disabled={!primaryLink} />
                </View>

                {/* Save / bookmark action */}
                <Pressable
                  onPress={() => setIsBookmarked((prev) => !prev)}
                  style={[
                    styles.bookmarkButton,
                    isBookmarked && styles.bookmarkButtonActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={isBookmarked ? "Unsave gig" : "Save gig"}
                  accessibilityState={{ selected: isBookmarked }}>
                  <Ionicons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={isBookmarked ? COLORS.dark : COLORS.white}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <GigOptionsMenu
            visible={menuVisible}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => setIsBookmarked((previous) => !previous)}
            onShare={handleShare}
            onClose={() => setMenuVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Author information — retained if used by another component.
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEEEEE",
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEE8E2",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6D5548",
  },
  headerAccessory: {
    marginLeft: -6,
    zIndex: 2,
  },
  authorInfo: {
    flex: 1,
    minWidth: 0,
  },
  author: {
    fontSize: 12,
    fontWeight: "700",
    color: "#222222",
  },
  authorTime: {
    fontSize: 10,
    color: "#888888",
    marginTop: 1,
  },
  authorLocation: {
    maxWidth: 120,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  authorLocationText: {
    fontSize: 10,
    color: COLORS.secondary,
    flexShrink: 1,
  },

  // Feed wrapper — compact outer spacing.
  postPanel: {
    width: "100%",
    minWidth: 0,
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#F8F6F3",
  },

  // Main feed card.
  feedCard: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 18,
    overflow: "hidden",
  },

  // Hero image gallery.
  hero: {
    width: "100%",
    backgroundColor: "#E7E6DC",
    overflow: "hidden",
  },
  heroSlide: {
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E7E8D8",
    overflow: "hidden",
  },
  placeholderOrbOne: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -95,
    left: -75,
    backgroundColor: "#D5E8B2",
  },
  placeholderOrbTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -80,
    backgroundColor: "#CFD8BD",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    color: COLORS.green,
  },

  // Floating controls displayed over the hero image.
  heroTop: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    position: "absolute",
    right: 10,
    bottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(15,18,15,0.78)",
  },
  paginationText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
  },

  // Feed content and footer.
  feedSheet: {
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  feedFooter: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  detailsContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 8,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },

  // Gig type badge.
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: COLORS.limeLight,
  },
  typeBadgeText: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: "600",
  },

  // Gig title and description.
  title: {
    color: COLORS.dark,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  timestamp: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: -4,
  },
  description: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 0,
    marginBottom: 0,
  },

  // Location, date, and other gig information.
  detailsGrid: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 6,
  },
  detailsColumn: {
    flex: 1,
    minWidth: 0,
  },
  detailCard: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  detailCardFull: {
    width: "100%",
  },
  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F0F8DE",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  detailCopy: {
    flex: 1,
    minWidth: 0,
  },
  detailLabel: {
    color: COLORS.secondary,
    fontSize: 10,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  detailSubtitle: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 1,
  },

  // Copyable contact details and additional locations.
  copyButton: {
    width: 28,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  extraLocations: {
    gap: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  locationCopy: {
    flex: 1,
    minWidth: 0,
  },
  locationName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  locationAddress: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 2,
  },

  // External links section.
  linkSection: {
    gap: 7,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 2,
  },
  linksSection: {
    gap: 6,
  },
  linkCard: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.background,
  },
  linkIcon: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  linkCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  linkTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  linkUrl: {
    color: COLORS.secondary,
    fontSize: 10,
    flexShrink: 1,
  },

  // Header action buttons.
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  // Primary application button.
  applyButton: {
    width: "100%",
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.lime,
  },
  applyButtonText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "800",
    flexShrink: 1,
  },
  applyButtonPressed: {
    opacity: 0.55,
  },

  // Shared pressed-state feedback.
  pressed: {
    opacity: 0.7,
  },

  // Options menu overlay and menu items.
  menuOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuCard: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 11,
    paddingVertical: 12,
  },
  menuText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  // Footer containing the apply and save actions.
  bottomBar: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },

  // Let ApplyButton occupy the remaining width.
  applyButtonWrapper: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  // Compact square save button beside Apply.
  bookmarkButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.dark,
  },

  // Highlight the button when the gig is saved.
  bookmarkButtonActive: {
    backgroundColor: COLORS.lime,
  },
});

// Full-screen gig details modal — no dimmed feed or rounded sheet edges.
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    backgroundColor: COLORS.background,
  },
  modal: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 0,
    overflow: "hidden",
  },

  // Main modal content area.
  sheet: {
    flex: 1,
    minHeight: 0,
    paddingTop: 20,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  contentContainer: {
    paddingBottom: 20,
  },

  // Fixed bottom action area.
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 9,
    backgroundColor: COLORS.background,
  },
});
