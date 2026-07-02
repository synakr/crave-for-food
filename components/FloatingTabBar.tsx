import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={95} tint="light" style={styles.container}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

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

          let icon: keyof typeof Ionicons.glyphMap = "ellipse";

          switch (route.name) {
            case "explore":
              icon = focused ? "compass" : "compass-outline";
              break;

            case "saved":
              icon = focused ? "bookmark" : "bookmark-outline";
              break;

            case "profile":
              icon = focused ? "person" : "person-outline";
              break;
          }

          const label =
            options.title ??
            (typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : route.name.charAt(0).toUpperCase() + route.name.slice(1));

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.item, focused && styles.activeItem]}
            >
              <Ionicons
                name={icon}
                size={22}
                color={focused ? "#F06B6B" : "#907D7D"}
              />

              <Text
                style={[
                  styles.label,
                  focused && styles.activeLabel,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
  },

  container: {
    height: 72,

    borderRadius: 36,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.55)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 8,
  },

  item: {
    flex: 1,

    height: 54,

    marginHorizontal: 6,

    borderRadius: 27,

    alignItems: "center",
    justifyContent: "center",
  },

  activeItem: {
    backgroundColor: "rgba(255,255,255,0.92)",

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  label: {
    marginTop: 2,

    fontSize: 13,

    fontWeight: "500",

    color: "#907D7D",
  },

  activeLabel: {
    color: "#F06B6B",

    fontWeight: "600",
  },
});