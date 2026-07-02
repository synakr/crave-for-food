import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Dimensions } from "react-native";

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {

const BAR_WIDTH = Dimensions.get("window").width - 36;
const TAB_WIDTH = BAR_WIDTH / state.routes.length;

const indicatorX = useSharedValue(6);

React.useEffect(() => {
  indicatorX.value = withSpring(state.index * TAB_WIDTH + 6, {
    damping: 18,
    stiffness: 170,
  });
}, [state.index, TAB_WIDTH]);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: indicatorX.value }],
}));

  return (
    <View style={styles.wrapper}>
      <BlurView
        intensity={95}
        tint="light"
        style={styles.container}
      >
        <View style={styles.glassHighlight} />

        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: TAB_WIDTH - 12,
              left: 6,
            },
            animatedStyle,
          ]}
        />

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

            case "activity":
              icon = focused ? "heart" : "heart-outline";
              break;

            case "profile":
              icon = focused ? "person" : "person-outline";
              break;
          }

          const label =
            options.title ??
            (typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : route.name.charAt(0).toUpperCase() +
                route.name.slice(1));

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
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
  height: 74,

  borderRadius: 37,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",

  overflow: "hidden",

  backgroundColor: "rgba(255,255,255,0.28)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.55)",

  shadowColor: "#A88787",
  shadowOffset: {
    width: 0,
    height: 16,
  },
  shadowOpacity: 0.12,
  shadowRadius: 28,

  elevation: 18,
},

item: {
  flex: 1,

  height: 74,

  alignItems: "center",
  justifyContent: "center",

  zIndex: 2,
},

label: {
  marginTop: 4,
  fontSize: 11,
  fontWeight: "600",
  color: "#8F7D7D",
},

activeLabel: {
  color: "#F06B6B",
},

activeIndicator: {
  position: "absolute",

  top: 9,

  height: 56,

  borderRadius: 28,

  backgroundColor: "rgba(255,255,255,0.42)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.75)",

  shadowColor: "#FFFFFF",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.8,
  shadowRadius: 12,

  zIndex: 1,
},
glassHighlight: {
  position: "absolute",

  top: 0,
  left: 24,
  right: 24,

  height: 1,

  backgroundColor: "rgba(255,255,255,0.7)",

  zIndex: 3,
},
});