import type {
  GigPost as GigPostData,
  GigPostLink,
  GigPostLocation,
} from "@/data/mock/gigPostStore";
import { Ionicons } from "@expo/vector-icons";
import {
  Linking,
  Modal,
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

type UnknownRecord = Record<string, unknown>;

const textValue = (
  metadata: UnknownRecord | null | undefined,
  ...keys: string[]
): string => {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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
        typeof item.longitude === "number",
    )
    .map((item) => ({
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      ...(typeof item.address === "string" ? { address: item.address } : {}),
    }));
};

async function openExternalLink(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  } catch {
    // Keep the post usable if the device cannot open the URL.
  }
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
          style={styles.linkRow}>
          <Ionicons name="link-outline" size={17} color="#477B69" />
          <Text style={styles.linkText} numberOfLines={2}>
            {link.title || link.url}
          </Text>
          <Ionicons name="open-outline" size={15} color="#477B69" />
        </Pressable>
      ))}
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
          <Ionicons name="navigate-outline" size={16} color="#477B69" />
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

export default function GigPost(props: PostRendererProps) {
  const { post } = props;
  const metadata = post.metadata as UnknownRecord | null | undefined;
  const gigType = textValue(metadata, "gigType", "gig_type") || "Opportunity";
  const location =
    textValue(metadata, "location") || post.location || "Location flexible";
  const contact = textValue(metadata, "contact");
  const links = getLinks(metadata?.links);
  const locations = getLocations(metadata?.locations);

  return (
    <PostCard {...props}>
      <View style={rendererStyles.panel}>
        <View style={rendererStyles.badge}>
          <Text style={rendererStyles.badgeText}>{gigType.toUpperCase()}</Text>
        </View>
        <PostTitle>{post.title || "Gig opportunity"}</PostTitle>
        <PostBody>{post.caption || ""}</PostBody>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={17} color="#765F51" />
          <Text style={styles.detailText}>{location}</Text>
        </View>

        {contact ? (
          <View style={[styles.detailRow, styles.contactRow]}>
            <Ionicons name="mail-outline" size={17} color="#765F51" />
            <Text style={styles.detailText}>{contact}</Text>
          </View>
        ) : null}

        <LocationList locations={locations} />
        <LinkList links={links} />
      </View>
    </PostCard>
  );
}

type GigPostModalProps = {
  post: GigPostData | null;
  onClose: () => void;
};

export function GigPostModal({ post, onClose }: GigPostModalProps) {
  const links = post?.metadata?.links ?? [];
  const locations = post?.metadata?.locations ?? [];

  return (
    <Modal
      visible={!!post}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modal}>
          <View style={modalStyles.header}>
            <View style={modalStyles.typeLabel}>
              <Ionicons name="briefcase-outline" size={18} color="#477B69" />
              <Text style={modalStyles.typeText}>{post?.gigType ?? "Gig"}</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close gig details">
              <Ionicons name="close-circle" size={28} color="#477B69" />
            </Pressable>
          </View>

          {post ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={modalStyles.title}>{post.title}</Text>
              <Text style={modalStyles.description}>{post.description}</Text>

              <View style={modalStyles.detail}>
                <Ionicons name="location-outline" size={19} color="#477B69" />
                <Text style={modalStyles.detailText}>
                  {post.location || "Location flexible"}
                </Text>
              </View>

              {post.contact ? (
                <View style={modalStyles.detail}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={19}
                    color="#477B69"
                  />
                  <Text style={modalStyles.detailText}>{post.contact}</Text>
                </View>
              ) : null}

              {locations.length ? (
                <View style={modalStyles.section}>
                  <Text style={modalStyles.sectionTitle}>
                    Additional locations
                  </Text>
                  <LocationList locations={locations} />
                </View>
              ) : null}

              {links.length ? (
                <View style={modalStyles.section}>
                  <Text style={modalStyles.sectionTitle}>Useful links</Text>
                  <LinkList links={links} />
                </View>
              ) : null}

              <Text style={modalStyles.author}>Posted by You</Text>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  contactRow: { marginTop: 8 },
  detailText: { color: "#555555", flex: 1 },
  extraLocations: { marginTop: 8, gap: 8 },
  locationRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  locationCopy: { flex: 1 },
  locationName: { color: "#49413B", fontSize: 13, fontWeight: "600" },
  locationAddress: { color: "#77706A", fontSize: 12, marginTop: 2 },
  linksSection: { marginTop: 12, gap: 8 },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  linkText: {
    color: "#477B69",
    flex: 1,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modal: {
    maxHeight: "85%",
    padding: 20,
    paddingBottom: 32,
    backgroundColor: "#F8F6F3",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  typeText: { fontSize: 12, fontWeight: "700", color: "#477B69" },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    color: "#202020",
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#49413B",
    marginBottom: 22,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  detailText: { flex: 1, fontSize: 14, color: "#49413B" },
  section: { marginTop: 10 },
  sectionTitle: {
    color: "#202020",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  author: { marginTop: 16, fontSize: 12, color: "#968A80" },
});
