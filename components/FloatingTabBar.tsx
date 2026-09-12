import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TAB_BAR_HEIGHT = 58;
const PLUS_SIZE = 58;
const HORIZONTAL_MARGIN = 20;
const PLUS_GAP = 12;

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const barWidth = SCREEN_WIDTH - HORIZONTAL_MARGIN * 2 - PLUS_SIZE - PLUS_GAP;

  const tabWidth = barWidth / state.routes.length;

  // Active tab sliding animation
  const indicatorX = useSharedValue(5);

  React.useEffect(() => {
    indicatorX.value = withSpring(state.index * tabWidth + 5, {
      damping: 30,
      stiffness: 110,
      mass: 0.9,
      reduceMotion: ReduceMotion.Never,
    });
  }, [state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  // Open image picker
  const handleUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    const image = result.assets[0];

    navigation.navigate("explore", {
      uploadedImage: image.uri,
      uploadId: Date.now().toString(),
    });
  };

  return (
    <View style={styles.wrapper}>
      {/* TAB BAR */}
      <View style={[styles.barContainer, { width: barWidth }]}>
        <BlurView
          intensity={Platform.OS === "ios" ? 55 : 40}
          tint="light"
          style={styles.tabBar}>
          {/* Active tab indicator */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeIndicator,
              {
                width: tabWidth - 10,
              },
              indicatorStyle,
            ]}
          />

          {/* Tabs */}
          {state.routes.map((route) => {
            const focused = state.index === state.routes.indexOf(route);

            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let icon: keyof typeof Ionicons.glyphMap = "ellipse-outline";

            switch (route.name) {
              case "explore":
                icon = focused ? "compass" : "compass-outline";
                break;

              case "saved":
                icon = focused ? "bookmark" : "bookmark-outline";
                break;

              case "activity":
                icon = focused ? "heart" : "heart-outline";
                break;

              case "profile":
                icon = focused ? "person" : "person-outline";
                break;
            }

            const label =
              options.title ??
              route.name.charAt(0).toUpperCase() + route.name.slice(1);

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}>
                <Ionicons
                  name={icon}
                  size={20}
                  color={focused ? "#111" : "rgba(17,17,17,0.5)"}
                />

                <Text style={[styles.label, focused && styles.activeLabel]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </BlurView>
      </View>

      {/* PLUS / UPLOAD BUTTON */}
      <Pressable
        onPress={handleUpload}
        style={({ pressed }) => [
          styles.plusButton,
          pressed && styles.plusPressed,
        ]}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ================================
     WRAPPER
  ================================= */

  wrapper: {
    position: "absolute",

    left: HORIZONTAL_MARGIN,
    right: HORIZONTAL_MARGIN,
    bottom: 16,

    height: TAB_BAR_HEIGHT,

    flexDirection: "row",
    alignItems: "center",

    gap: PLUS_GAP,
  },

  /* ================================
     TAB BAR
  ================================= */

  barContainer: {
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.72)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",

    ...(Platform.OS === "android" && {
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 5,
    }),
  },

  tabBar: {
    flex: 1,

    height: TAB_BAR_HEIGHT,

    flexDirection: "row",
    alignItems: "center",

    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.45)",
  },

  /* ================================
     ACTIVE TAB
  ================================= */

  activeIndicator: {
    position: "absolute",

    left: -1,
    top: 4,

    height: TAB_BAR_HEIGHT - 10,

    borderRadius: (TAB_BAR_HEIGHT - 10) / 2,

    backgroundColor: "rgba(235,235,238,0.75)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",

    // Only shadow in the component
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 2,
  },

  /* ================================
     TAB ITEM
  ================================= */

  tabItem: {
    flex: 1,

    height: TAB_BAR_HEIGHT,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 2,
  },

  label: {
    marginTop: 1,

    fontSize: 10,
    fontWeight: "500",

    color: "rgba(17,17,17,0.5)",
  },

  activeLabel: {
    color: "#111",

    fontWeight: "600",
  },

  /* ================================
   PLUS BUTTON
================================= */

  plusButton: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,

    borderRadius: PLUS_SIZE / 2,

    alignItems: "center",
    justifyContent: "center",

    // Dark circle
    backgroundColor: "#040404",

    // White border
    borderWidth: 2,
    borderColor: "#FFFFFF",

    // Shadow
    ...(Platform.OS === "android"
      ? {
          elevation: 5,
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.18,
          shadowRadius: 6,
        }),
  },

  plusPressed: {
    transform: [{ scale: 0.94 }],
  },
});
