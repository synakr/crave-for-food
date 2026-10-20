import type { ArticlePost as StoredArticlePost } from "@/data/mock/articlePostStore";
import {
  getArticlePosts,
  subscribeToArticlePosts,
} from "@/data/mock/articlePostStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import type { PostRendererProps } from "./types";

type ArticleLink = { url: string; title?: string };

type ArticleLocation = {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
};

function isArticleLink(value: unknown): value is ArticleLink {
  if (!value || typeof value !== "object") return false;

  const link = value as Record<string, unknown>;

  return (
    typeof link.url === "string" &&
    (link.title === undefined || typeof link.title === "string")
  );
}

function isArticleLocation(value: unknown): value is ArticleLocation {
  if (!value || typeof value !== "object") return false;

  const location = value as Record<string, unknown>;

  return (
    typeof location.name === "string" &&
    typeof location.latitude === "number" &&
    Number.isFinite(location.latitude) &&
    typeof location.longitude === "number" &&
    Number.isFinite(location.longitude) &&
    (location.address === undefined || typeof location.address === "string")
  );
}

function getArticleLinks(metadata: unknown): ArticleLink[] {
  if (!metadata || typeof metadata !== "object") return [];

  const links = (metadata as Record<string, unknown>).links;

  return Array.isArray(links) ? links.filter(isArticleLink) : [];
}

function getArticleLocations(metadata: unknown): ArticleLocation[] {
  if (!metadata || typeof metadata !== "object") return [];

  const locations = (metadata as Record<string, unknown>).locations;

  return Array.isArray(locations) ? locations.filter(isArticleLocation) : [];
}

async function openArticleLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open link", "Please try again.");
  }
}

// ---------------------------------------------------------
// DYNAMIC AMBIENT BACKGROUND
// ---------------------------------------------------------

type AmbientPalette = {
  background: string;
  glowA: string;
  glowB: string;
  glowC: string;
  glowD: string;
};

const AMBIENT_PALETTES: AmbientPalette[] = [
  {
    background: "#172C35",
    glowA: "#22D3EE",
    glowB: "#A855F7",
    glowC: "#F472B6",
    glowD: "#3B82F6",
  },
  {
    background: "#30251F",
    glowA: "#FB923C",
    glowB: "#F43F5E",
    glowC: "#FACC15",
    glowD: "#A855F7",
  },
  {
    background: "#1F3028",
    glowA: "#4ADE80",
    glowB: "#14B8A6",
    glowC: "#A3E635",
    glowD: "#60A5FA",
  },
  {
    background: "#29233A",
    glowA: "#C084FC",
    glowB: "#818CF8",
    glowC: "#F0ABFC",
    glowD: "#38BDF8",
  },
  {
    background: "#34252D",
    glowA: "#FB7185",
    glowB: "#F97316",
    glowC: "#E879F9",
    glowD: "#FBBF24",
  },
  {
    background: "#1D2C3B",
    glowA: "#38BDF8",
    glowB: "#6366F1",
    glowC: "#2DD4BF",
    glowD: "#F472B6",
  },
];

function getAmbientPalette(seed: string): AmbientPalette {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }

  const paletteIndex =
    ((hash % AMBIENT_PALETTES.length) + AMBIENT_PALETTES.length) %
    AMBIENT_PALETTES.length;

  return AMBIENT_PALETTES[paletteIndex];
}

function ColorfulRadialBackground({ palette }: { palette: AmbientPalette }) {
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.radialBackground]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="ambientGlowA" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={palette.glowA} stopOpacity="0.58" />
            <Stop offset="100%" stopColor={palette.glowA} stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="ambientGlowB" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={palette.glowB} stopOpacity="0.52" />
            <Stop offset="100%" stopColor={palette.glowB} stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="ambientGlowC" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={palette.glowC} stopOpacity="0.42" />
            <Stop offset="100%" stopColor={palette.glowC} stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="ambientGlowD" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={palette.glowD} stopOpacity="0.48" />
            <Stop offset="100%" stopColor={palette.glowD} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect
          x="-30%"
          y="5%"
          width="115%"
          height="58%"
          fill="url(#ambientGlowA)"
        />

        <Rect
          x="20%"
          y="18%"
          width="115%"
          height="58%"
          fill="url(#ambientGlowB)"
        />

        <Rect
          x="-30%"
          y="48%"
          width="115%"
          height="58%"
          fill="url(#ambientGlowC)"
        />

        <Rect
          x="20%"
          y="60%"
          width="115%"
          height="58%"
          fill="url(#ambientGlowD)"
        />
      </Svg>
    </View>
  );
}

// ---------------------------------------------------------
// ARTICLE PREVIEW CARD
// Existing behavior preserved
// ---------------------------------------------------------

export default function ArticlePost(props: PostRendererProps) {
  const { post } = props;
  const metadata = post.metadata;

  const articleType =
    typeof metadata?.article_type === "string"
      ? metadata.article_type
      : typeof metadata?.articleType === "string"
        ? metadata.articleType
        : "Article";

  const title =
    post.title ||
    (typeof metadata?.title === "string" ? metadata.title : "Untitled");

  const body =
    post.body ||
    post.caption ||
    (typeof metadata?.body === "string" ? metadata.body : "");

  const locations = getArticleLocations(metadata);

  return (
    <ImageBackground
      source={post.mediaUri ? { uri: post.mediaUri } : undefined}
      style={styles.card}
      imageStyle={styles.cardImage}
      resizeMode="cover">
      <View style={styles.cardBackdrop} />

      <View style={styles.cardTopRow}>
        <View style={styles.typePill}>
          <Ionicons name="book-outline" size={12} color="#FFFFFF" />
          <Text style={styles.typePillText}>{articleType.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardTextArea}>
        <Text style={styles.cardTitle} numberOfLines={3}>
          {title}
        </Text>

        {!!body && (
          <Text style={styles.cardBody} numberOfLines={3}>
            {body}
          </Text>
        )}

        <View style={styles.cardInfoRow}>
          <Ionicons
            name="book-outline"
            size={13}
            color="rgba(255,255,255,0.92)"
          />

          <Text style={styles.cardInfoText}>{articleType}</Text>

          {locations.length > 0 && (
            <>
              <Text style={styles.cardDot}>·</Text>

              <Ionicons
                name="location-outline"
                size={13}
                color="rgba(255,255,255,0.92)"
              />

              <Text style={styles.cardInfoText} numberOfLines={1}>
                {locations[0].name}
              </Text>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

// ---------------------------------------------------------
// ARTICLE DETAIL MODAL
// Scrollable hero + ambient background + glass cards
// ---------------------------------------------------------

type ArticlePostModalProps = {
  post: StoredArticlePost | null;
  onClose: () => void;
};

/** Article modal reads its complete article data directly from articlePostStore. */
export function ArticlePostModal({ post, onClose }: ArticlePostModalProps) {
  const title = post?.title.trim() ? post.title : "Untitled";
  const body = post?.body ?? "";
  const articleType = post?.articleType.trim() || "Article";

  const links = getArticleLinks(post?.metadata);
  const locations = getArticleLocations(post?.metadata);

  const heroImageUri = post?.mediaUris?.[0];

  const ambientPalette = getAmbientPalette(`${heroImageUri ?? ""}:${title}`);

  return (
    <Modal
      visible={!!post}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close article"
        />

        <View
          style={[
            modalStyles.screen,
            { backgroundColor: ambientPalette.background },
          ]}>
          {/* Background remains behind the entire scrollable page */}
          <ColorfulRadialBackground palette={ambientPalette} />

          <ScrollView
            style={modalStyles.scrollView}
            contentContainerStyle={modalStyles.content}
            showsVerticalScrollIndicator={false}
            bounces
            alwaysBounceVertical={false}>
            {/* Hero image scrolls together with the article */}
            <View style={modalStyles.heroImageContainer}>
              {heroImageUri ? (
                <View style={modalStyles.heroImage}>
                  <ImageBackground
                    source={{ uri: heroImageUri }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />

                  {/* Color bleed at the bottom of the image */}
                  <View
                    pointerEvents="none"
                    style={modalStyles.heroAmbientGlow}>
                    <Svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 400 260"
                      preserveAspectRatio="xMidYMax slice">
                      <Defs>
                        <RadialGradient
                          id="heroGlowA"
                          cx="50%"
                          cy="100%"
                          rx="65%"
                          ry="75%">
                          <Stop
                            offset="0%"
                            stopColor={ambientPalette.glowA}
                            stopOpacity="0.62"
                          />
                          <Stop
                            offset="100%"
                            stopColor={ambientPalette.glowA}
                            stopOpacity="0"
                          />
                        </RadialGradient>
                        <RadialGradient
                          id="heroGlowB"
                          cx="100%"
                          cy="85%"
                          rx="65%"
                          ry="70%">
                          <Stop
                            offset="0%"
                            stopColor={ambientPalette.glowB}
                            stopOpacity="0.48"
                          />
                          <Stop
                            offset="100%"
                            stopColor={ambientPalette.glowB}
                            stopOpacity="0"
                          />
                        </RadialGradient>
                        <RadialGradient
                          id="heroGlowC"
                          cx="0%"
                          cy="85%"
                          rx="65%"
                          ry="70%">
                          <Stop
                            offset="0%"
                            stopColor={ambientPalette.glowC}
                            stopOpacity="0.46"
                          />
                          <Stop
                            offset="100%"
                            stopColor={ambientPalette.glowC}
                            stopOpacity="0"
                          />
                        </RadialGradient>
                      </Defs>
                      <Rect width="400" height="260" fill="url(#heroGlowA)" />
                      <Rect width="400" height="260" fill="url(#heroGlowB)" />
                      <Rect width="400" height="260" fill="url(#heroGlowC)" />
                    </Svg>
                  </View>

                  <LinearGradient
                    colors={["transparent", "rgba(185, 0, 0, 0)"]}
                    style={modalStyles.heroBottomFade}
                    pointerEvents="none"
                  />
                </View>
              ) : (
                <View
                  style={[
                    modalStyles.heroImage,
                    { backgroundColor: ambientPalette.background },
                  ]}
                />
              )}

              {/* Close button scrolls with the hero */}
              <View style={modalStyles.topControls}>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  style={modalStyles.circleControl}
                  accessibilityRole="button"
                  accessibilityLabel="Close article">
                  <Ionicons name="close" size={22} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* Article title over the lower portion of the image */}
              <View style={modalStyles.heroCopy}>
                <View style={modalStyles.typePill}>
                  <Ionicons name="book-outline" size={12} color="#FFFFFF" />
                  <Text style={modalStyles.typePillText}>
                    {articleType.toUpperCase()}
                  </Text>
                </View>

                <Text style={modalStyles.title}>{title}</Text>

                <View style={modalStyles.heroInfo}>
                  <Text style={modalStyles.heroInfoText}>{articleType}</Text>

                  {locations.length > 0 && (
                    <>
                      <Text style={modalStyles.dot}>·</Text>

                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#FFFFFF"
                      />

                      <Text style={modalStyles.heroInfoText}>
                        {locations[0].name}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Article body */}
            <View style={modalStyles.responseCard}>
              <View style={modalStyles.authorAvatar}>
                <Ionicons name="person" size={16} color="#FFFFFF" />
              </View>

              <View style={modalStyles.responseCopy}>
                <Text style={modalStyles.responseHeading}>
                  About this article
                </Text>

                <Text style={modalStyles.body}>
                  {body || "No article content."}
                </Text>
              </View>
            </View>

            {/* Related links */}
            {links.length > 0 && (
              <View style={modalStyles.responseCard}>
                <Text style={modalStyles.responseHeading}>Related links</Text>

                {links.map((link, index) => (
                  <Pressable
                    key={`${link.url}-${index}`}
                    style={modalStyles.detailRow}
                    onPress={() => void openArticleLink(link.url)}
                    accessibilityRole="link"
                    accessibilityLabel={link.title || link.url}>
                    <View style={modalStyles.detailIcon}>
                      <Ionicons name="link-outline" size={17} color="#FFFFFF" />
                    </View>

                    <Text style={modalStyles.detailText} numberOfLines={2}>
                      {link.title || link.url}
                    </Text>

                    <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                  </Pressable>
                ))}
              </View>
            )}

            {/* Places mentioned */}
            {locations.length > 0 && (
              <View style={modalStyles.responseCard}>
                <Text style={modalStyles.responseHeading}>
                  Places mentioned
                </Text>

                {locations.map((location, index) => (
                  <View
                    key={`${location.latitude}-${location.longitude}-${index}`}
                    style={modalStyles.detailRow}>
                    <View style={modalStyles.locationIcon}>
                      <Ionicons
                        name="location-outline"
                        size={17}
                        color="#FFFFFF"
                      />
                    </View>

                    <View style={modalStyles.locationCopy}>
                      <Text style={modalStyles.detailText}>
                        {location.name}
                      </Text>

                      {!!location.address && (
                        <Text style={modalStyles.locationAddress}>
                          {location.address}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Text style={modalStyles.author}>Published by You</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------
// ARTICLE STORE SUBSCRIPTION
// Existing behavior preserved
// ---------------------------------------------------------

export function useStoredArticlePosts(): StoredArticlePost[] {
  const [articles, setArticles] =
    useState<StoredArticlePost[]>(getArticlePosts);

  useEffect(() => {
    const unsubscribe = subscribeToArticlePosts(() =>
      setArticles(getArticlePosts()),
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return articles;
}

// ---------------------------------------------------------
// ARTICLE PREVIEW STYLES
// ---------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    minHeight: 300,
    borderRadius: 28,
    overflow: "hidden",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#314D55",
  },
  cardImage: {
    borderRadius: 28,
  },
  cardBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(10, 27, 34, 0.20)",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  typePillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  cardTextArea: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 4,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  cardBody: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    textAlign: "center",
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 14,
  },
  cardInfoText: {
    color: "rgba(255,255,255,0.94)",
    fontSize: 11,
    fontWeight: "600",
    maxWidth: 150,
  },
  cardDot: {
    color: "#FFFFFF",
    marginHorizontal: 2,
  },
  radialBackground: {
    zIndex: 0,
  },
});

// ---------------------------------------------------------
// ARTICLE MODAL STYLES
// ---------------------------------------------------------

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  screen: {
    width: "100%",
    height: "100%",
    maxWidth: 520,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#203B43",
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 28,
    gap: 14,
  },
  heroImageContainer: {
    height: 480,
    marginHorizontal: -16,
    marginBottom: 0,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  heroAmbientGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
  },
  topControls: {
    position: "absolute",
    zIndex: 2,
    top: 52,
    right: 20,
    alignItems: "center",
  },
  heroCopy: {
    minHeight: 300,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingBottom: 28,
    gap: 12,
  },
  circleControl: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.32)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.30)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  typePillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.22)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  heroInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 2,
  },
  heroInfoText: {
    color: "rgba(255,255,255,0.94)",
    fontSize: 12,
    fontWeight: "600",
  },
  dot: {
    color: "#FFFFFF",
    marginHorizontal: 2,
  },
  responseCard: {
    borderRadius: 24,
    padding: 17,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    marginBottom: 10,
  },
  responseCopy: {
    gap: 8,
  },
  responseHeading: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255,255,255,0.92)",
  },
  author: {
    marginTop: 4,
    fontSize: 11,
    textAlign: "center",
    color: "rgba(255,255,255,0.65)",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.14)",
  },
  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  detailText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  locationCopy: {
    flex: 1,
  },
  locationAddress: {
    color: "rgba(255,255,255,0.68)",
    marginTop: 3,
    fontSize: 12,
  },
  heroBottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
});
