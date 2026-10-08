import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface NavigationDrawerProps {
  visible: boolean;
  onClose: () => void;
  onChallengePress?: () => void;
}

export default function NavigationDrawer({
  visible,
  onClose,
  onChallengePress,
}: NavigationDrawerProps) {
  const [mounted, setMounted] = useState(visible);

  const drawerX = useRef(new Animated.Value(-340)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Mount first so the opening animation can run
      setMounted(true);

      // Stop any previous animation before starting a new one
      drawerX.stopAnimation();
      backdropOpacity.stopAnimation();

      Animated.parallel([
        Animated.timing(drawerX, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Stop any previous animation before closing
      drawerX.stopAnimation();
      backdropOpacity.stopAnimation();

      Animated.parallel([
        Animated.timing(drawerX, {
          toValue: -340,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [visible, drawerX, backdropOpacity]);

  // Only unmount AFTER the closing animation finishes
  if (!mounted) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.backdropContainer,
          {
            opacity: backdropOpacity,
          },
        ]}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: drawerX }],
          },
        ]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>CRAVE</Text>

            <Text style={styles.subtitle}>Discover something today.</Text>
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Close menu">
            <Ionicons name="close" size={22} color="#111" />
          </Pressable>
        </View>

        {/* Challenge */}
        <Pressable
          onPress={() => {
            onClose();
            router.push("/challenge");
          }}
          style={({ pressed }) => [
            styles.challengeCard,
            pressed && styles.cardPressed,
          ]}>
          <View style={styles.challengeIcon}>
            <Ionicons name="sparkles" size={22} color="#111" />
          </View>

          <View style={styles.challengeContent}>
            <Text style={styles.challengeLabel}>DAILY CHALLENGE</Text>

            <Text style={styles.challengeTitle}>Something fun awaits.</Text>

            <Text style={styles.challengeAction}>Take the challenge →</Text>
          </View>
        </Pressable>

        {/* Explore */}
        <Text style={styles.sectionTitle}>EXPLORE</Text>

        <View style={styles.menuGroup}>
          <MenuItem icon="compass-outline" label="Explore" active />

          <MenuItem icon="bookmark-outline" label="Saved" />

          <MenuItem icon="heart-outline" label="Activity" />

          <MenuItem
            icon="podium-outline"
            label="Leaderboard"
            onPress={() => {
              onClose();
              router.push("/leaderboard");
            }}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Other */}
        <View style={styles.menuGroup}>
          <MenuItem icon="settings-outline" label="Settings" />

          <MenuItem icon="help-circle-outline" label="Help & Feedback" />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>CRAVE</Text>

          <Text style={styles.versionNumber}>v1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        active && styles.menuItemActive,
        pressed && styles.menuItemPressed,
      ]}>
      <Ionicons
        name={icon}
        size={21}
        color={active ? "#111" : "rgba(17,17,17,0.65)"}
      />

      <Text style={[styles.menuItemText, active && styles.menuItemTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },

  backdropContainer: {
    ...StyleSheet.absoluteFill,
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.22)",
  },

  drawer: {
    position: "absolute",

    top: 50,
    bottom: 16,
    left: 0,

    width: 322,

    paddingTop: Platform.OS === "ios" ? 46 : 32,
    paddingHorizontal: 20,
    paddingBottom: 24,

    // borderRadius: 28,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,

    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,

    backgroundColor: "rgba(255,255,255,0.96)",

    elevation: 24,

    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: {
      width: 8,
      height: 0,
    },
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  logo: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#111",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(17,17,17,0.48)",
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(235,235,238,0.8)",
  },

  challengeCard: {
    flexDirection: "row",

    padding: 16,

    borderRadius: 22,

    backgroundColor: "rgba(235,235,238,0.72)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",

    marginBottom: 30,
  },

  challengeIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.75)",
  },

  challengeContent: {
    flex: 1,
    marginLeft: 13,
  },

  challengeLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: "rgba(17,17,17,0.48)",
  },

  challengeTitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  challengeAction: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(17,17,17,0.58)",
  },

  cardPressed: {
    transform: [{ scale: 0.98 }],
  },

  sectionTitle: {
    marginBottom: 8,

    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,

    color: "rgba(17,17,17,0.38)",
  },

  menuGroup: {
    gap: 4,
  },

  menuItem: {
    height: 52,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,

    borderRadius: 15,

    gap: 14,
  },

  menuItemActive: {
    backgroundColor: "rgba(235,235,238,0.72)",
  },

  menuItemPressed: {
    transform: [{ scale: 0.98 }],
  },

  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(17,17,17,0.68)",
  },

  menuItemTextActive: {
    fontWeight: "700",
    color: "#111",
  },

  divider: {
    height: 1,

    marginVertical: 20,

    backgroundColor: "rgba(17,17,17,0.07)",
  },

  footer: {
    position: "absolute",

    left: 20,
    right: 20,
    bottom: 32,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  version: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "rgba(17,17,17,0.3)",
  },

  versionNumber: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(17,17,17,0.3)",
  },

  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
