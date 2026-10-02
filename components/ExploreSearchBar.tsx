import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

import CategoryChips from "./CategoryChips";

interface ExploreSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onFilterPress: () => void;
  onMenuPress: () => void;
}

export default function ExploreSearchBar({
  value,
  onChangeText,
  onSearch,
  onFilterPress,
  onMenuPress,
}: ExploreSearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const [showCategories, setShowCategories] = useState(true);

  return (
    <View style={styles.topContainer}>
      {/* SEARCH ROW */}
      <View style={styles.searchContainer}>
        {/* MENU BUTTON */}
        <Pressable
          onPress={onMenuPress}
          style={({ pressed }) => [
            styles.circleButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open menu">
          <BlurView
            intensity={Platform.OS === "ios" ? 55 : 40}
            tint="light"
            style={styles.circleBlur}>
            <Ionicons name="menu" size={24} color="#111" />
          </BlurView>
        </Pressable>

        {/* SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <BlurView
            intensity={Platform.OS === "ios" ? 55 : 40}
            tint="light"
            style={styles.searchBar}>
            <Pressable
              style={styles.searchLeft}
              onPress={() => inputRef.current?.focus()}>
              <Ionicons name="search" size={18} color="rgba(17,17,17,0.55)" />

              <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSearch}
                placeholder="Search food or place"
                placeholderTextColor="rgba(17,17,17,0.45)"
                style={styles.searchInput}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Pressable>

            <View style={styles.divider} />

            {/* CATEGORY TOGGLE */}
            <Pressable
              onPress={() => {
                setShowCategories((prev) => !prev);
                onFilterPress();
              }}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showCategories ? "Hide categories" : "Show categories"
              }
              style={({ pressed }) => [
                styles.filterButton,
                pressed && styles.pressed,
              ]}>
              <Ionicons name="options-outline" size={21} color="#111" />
            </Pressable>
          </BlurView>
        </View>
      </View>

      {/* CATEGORIES */}
      {showCategories && (
        <View style={styles.categories}>
          <CategoryChips />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  /* ================================
     TOP CONTAINER
  ================================= */

  topContainer: {
    position: "absolute",

    top: 50,
    left: 0,
    right: 0,
  },

  /* ================================
     SEARCH ROW
  ================================= */

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* ================================
     MENU BUTTON
  ================================= */

  circleButton: {
    width: 56,
    height: 56,

    marginLeft: 12,

    borderRadius: 28,

    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.72)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",

    ...(Platform.OS === "android"
      ? {
          elevation: 2,
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 5,
        }),
  },

  circleBlur: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.45)",
  },

  /* ================================
     SEARCH BAR
  ================================= */

  searchBarContainer: {
    flex: 1,

    height: 56,

    marginHorizontal: 12,

    borderRadius: 28,

    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.72)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",

    ...(Platform.OS === "android"
      ? {
          elevation: 2,
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 5,
        }),
  },

  searchBar: {
    flex: 1,

    height: 56,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 18,

    backgroundColor: "rgba(255,255,255,0.45)",
  },

  searchLeft: {
    flexDirection: "row",
    alignItems: "center",

    flex: 1,
  },

  searchInput: {
    flex: 1,

    marginLeft: 10,

    paddingVertical: 0,

    fontSize: 15,
    fontWeight: "500",

    color: "#111",
  },

  divider: {
    width: 1,
    height: 24,

    marginHorizontal: 14,

    backgroundColor: "rgba(17,17,17,0.10)",
  },

  filterButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  /* ================================
     CATEGORIES
  ================================= */

  categories: {
    marginTop: 12,
  },

  /* ================================
     PRESS
  ================================= */

  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
