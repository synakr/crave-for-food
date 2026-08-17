import { Feather, Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

import QuickActionsModal from "./QuickActionModal";

const TAB_CONFIG: {
  [key: string]: { icon: string; type: "custom-pin" | "ionicons" | "feather" };
} = {
  explore: { icon: "pin", type: "custom-pin" },
  saved: { icon: "bookmark", type: "feather" },
  activity: { icon: "heart", type: "ionicons" },
  profile: { icon: "person", type: "ionicons" },
};

export default function FloatingTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0.6)).current;

  // Pin slider & opacity animations
  const pinSlideX = useRef(new Animated.Value(0)).current;
  const pinOpacity = useRef(new Animated.Value(1)).current;

  // Track latest navigation indices with Refs to avoid closure stale state
  const currentIndexRef = useRef(state.index);
  const tabRoutesRef = useRef(state.routes.map((r) => r.name));

  useEffect(() => {
    currentIndexRef.current = state.index;
    tabRoutesRef.current = state.routes.map((r) => r.name);
  }, [state.index, state.routes]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0.4,
          duration: 1300,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [waveAnim]);

  const navigateToTab = (nextIndex: number, direction: "left" | "right") => {
    const routes = tabRoutesRef.current;
    if (nextIndex < 0 || nextIndex >= routes.length) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const exitOffset = direction === "left" ? -35 : 35;
    const entryOffset = direction === "left" ? 35 : -35;

    Animated.parallel([
      Animated.timing(pinSlideX, {
        toValue: exitOffset,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pinOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate(routes[nextIndex]);

      pinSlideX.setValue(entryOffset);
      Animated.parallel([
        Animated.spring(pinSlideX, {
          toValue: 0,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.timing(pinOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderMove: (_, gestureState) => {
        pinSlideX.setValue(gestureState.dx * 0.4);
      },
      onPanResponderRelease: (_, gestureState) => {
        const SWIPE_THRESHOLD = 25;
        const current = currentIndexRef.current;
        const total = tabRoutesRef.current.length;

        if (gestureState.dx < -SWIPE_THRESHOLD && current < total - 1) {
          // Swipe Left -> Next Tab
          navigateToTab(current + 1, "left");
        } else if (gestureState.dx > SWIPE_THRESHOLD && current > 0) {
          // Swipe Right -> Previous Tab
          navigateToTab(current - 1, "right");
        } else {
          // Snap back to center
          Animated.spring(pinSlideX, {
            toValue: 0,
            friction: 6,
            tension: 120,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(pinSlideX, {
          toValue: 0,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 8,
      tension: 150,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const routes = tabRoutesRef.current;
    if (state.index !== 0) {
      navigation.navigate(routes[0]);
    }
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setMenuVisible(true);
  };

  const renderActiveIcon = () => {
    const currentRoute = state.routes[state.index]?.name || "explore";
    const tab = TAB_CONFIG[currentRoute] || TAB_CONFIG.explore;

    if (tab.type === "feather") {
      return <Feather name={tab.icon as any} size={22} color="#FFFFFF" />;
    }

    if (tab.type === "ionicons") {
      return <Ionicons name={tab.icon as any} size={23} color="#FFFFFF" />;
    }

    return (
      <Svg width="22" height="25" viewBox="0 0 20 23" fill="none">
        <Path
          d="M10 0.8C4.9 0.8 0.8 4.9 0.8 10C0.8 15.6 9 22.2 9.4 22.5C9.6 22.7 9.8 22.8 10 22.8C10.2 22.8 10.4 22.7 10.6 22.5C11 22.2 19.2 15.6 19.2 10C19.2 4.9 15.1 0.8 10 0.8ZM10 13.8C7.9 13.8 6.2 12.1 6.2 10C6.2 7.9 7.9 6.2 10 6.2C12.1 6.2 13.8 7.9 13.8 10C13.8 12.1 12.1 13.8 10 13.8Z"
          fill="#FFFFFF"
        />
        <Path
          d="M10 11.5C10.8284 11.5 11.5 10.8284 11.5 10C11.5 9.17157 10.8284 8.5 10 8.5C9.17157 8.5 8.5 9.17157 8.5 10C8.5 10.8284 9.17157 11.5 10 11.5Z"
          fill="#FFFFFF"
        />
      </Svg>
    );
  };

  const W = 188;
  const H = 74;

  return (
    <>
      <QuickActionsModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectAction={(actionId) => {
          if (actionId === "saved") navigation.navigate("saved");
        }}
      />

      <View pointerEvents="box-none" style={styles.wrapper}>
        <View style={styles.bubbleContainer}>
          {/* Static Pill Base */}
          <Svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={styles.svgShape}>
            <Defs>
              <SvgGradient id="bubbleGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
                <Stop offset="100%" stopColor="#FFF0F5" stopOpacity="0.92" />
              </SvgGradient>
            </Defs>
            <Path
              d="
                M 30 3
                L 158 3
                A 26 26 0 0 1 184 29
                A 26 26 0 0 1 158 55
                L 102 55
                Q 96 55 94 62.5
                L 94 70.5
                L 94 62.5
                Q 92 55 86 55
                L 30 55
                A 26 26 0 0 1 4 29
                A 26 26 0 0 1 30 3
                Z
              "
              fill="url(#bubbleGrad)"
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth="1.5"
            />
          </Svg>

          {/* Waves */}
          <Animated.View
            style={[
              styles.wavesWrapper,
              {
                opacity: waveAnim,
                transform: [
                  {
                    scale: waveAnim.interpolate({
                      inputRange: [0.4, 1],
                      outputRange: [0.94, 1.05],
                    }),
                  },
                ],
              },
            ]}>
            <Svg
              width="28"
              height="36"
              viewBox="0 0 28 36"
              style={styles.leftWaves}>
              <Path
                d="M 22 6 A 18 18 0 0 0 22 30"
                fill="none"
                stroke="#FF3875"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity="0.32"
              />
              <Path
                d="M 12 10 A 13 13 0 0 0 12 26"
                fill="none"
                stroke="#FF3875"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeOpacity="0.2"
              />
            </Svg>

            <View style={styles.centerAura} />

            <Svg
              width="28"
              height="36"
              viewBox="0 0 28 36"
              style={styles.rightWaves}>
              <Path
                d="M 6 6 A 18 18 0 0 1 6 30"
                fill="none"
                stroke="#FF3875"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity="0.32"
              />
              <Path
                d="M 16 10 A 13 13 0 0 1 16 26"
                fill="none"
                stroke="#FF3875"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeOpacity="0.2"
              />
            </Svg>
          </Animated.View>

          {/* Swipeable Pin Disc */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.centerPinAnchor,
              {
                transform: [{ translateX: pinSlideX }, { scale: scaleAnim }],
                opacity: pinOpacity,
              },
            ]}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handlePress}
              onLongPress={handleLongPress}
              delayLongPress={800}
              style={styles.pinGlowWrapper}>
              <LinearGradient
                colors={["#FF4D88", "#E6004C"]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.pinCircle}>
                <View style={styles.pinSpecularHighlight} />
                {renderActiveIcon()}
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleContainer: {
    width: 188,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#FF6584",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  svgShape: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  wavesWrapper: {
    position: "absolute",
    top: 7,
    width: 154,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    pointerEvents: "none",
  },
  leftWaves: {
    marginLeft: 4,
  },
  rightWaves: {
    marginRight: 4,
  },
  centerAura: {
    position: "absolute",
    left: 47,
    width: 60,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 60, 116, 0.12)",
  },
  centerPinAnchor: {
    position: "absolute",
    top: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  pinGlowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: "#FF1B6B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pinSpecularHighlight: {
    position: "absolute",
    top: 1,
    width: 32,
    height: 15,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
});
