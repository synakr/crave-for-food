import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  LAUNCH_SCREEN_BOUNCE,
  LAUNCH_SCREEN_COLORS,
  LAUNCH_SCREEN_TIMINGS,
  LAUNCH_SCREEN_TYPOGRAPHY,
} from "@/constants/launchScreen";

type LaunchScreenProps = {
  onComplete?: () => void;
  logoText?: string;
};

type Phase = "idle" | "appear" | "write" | "settle" | "bounce" | "expand" | "complete";

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function LaunchScreen({
  onComplete,
  logoText = "Crave",
}: LaunchScreenProps) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>("idle");
  const [logoOpacity, setLogoOpacity] = useState(0.18);
  const [bounceScale, setBounceScale] = useState(1);

  const dotX = useSharedValue(0);
  const dotY = useSharedValue(0);
  const dotOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0.75);
  const expansionScale = useSharedValue(0.001);

  const logoFontSize = useMemo(() => {
    if (width < 360) return 58;
    if (width < 430) return 72;
    return 84;
  }, [width]);

  const letterSpacing = useMemo(() => {
    return width < 360 ? 0.9 : 1.2;
  }, [width]);

  const centerX = width / 2;
  const centerY = height / 2;

  const pathPoints = useMemo<Point[]>(() => {
    const originalWidth = width < 360 ? 240 : width < 430 ? 300 : 340;
    const originalHeight = 92;
    const offsetX = (width - originalWidth) / 2;
    const offsetY = (height - originalHeight) / 2 - 8;

    return [
      { x: offsetX + 0.18 * originalWidth, y: offsetY + 0.46 * originalHeight },
      { x: offsetX + 0.24 * originalWidth, y: offsetY + 0.3 * originalHeight },
      { x: offsetX + 0.36 * originalWidth, y: offsetY + 0.2 * originalHeight },
      { x: offsetX + 0.49 * originalWidth, y: offsetY + 0.25 * originalHeight },
      { x: offsetX + 0.6 * originalWidth, y: offsetY + 0.42 * originalHeight },
      { x: offsetX + 0.73 * originalWidth, y: offsetY + 0.63 * originalHeight },
      { x: offsetX + 0.84 * originalWidth, y: offsetY + 0.5 * originalHeight },
    ];
  }, [height, width]);

  const getPointForProgress = useCallback(
    (progress: number) => {
      const clamped = clamp(progress, 0, 1);
      const totalSegments = pathPoints.length - 1;
      const segmentIndex = Math.min(totalSegments - 1, Math.floor(clamped * totalSegments));
      const startPoint = pathPoints[segmentIndex];
      const endPoint = pathPoints[segmentIndex + 1];
      const segmentProgress = clamped * totalSegments - segmentIndex;

      return {
        x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
        y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress,
      };
    },
    [pathPoints],
  );

  useEffect(() => {
    setPhase("appear");
  }, []);

  useEffect(() => {
    if (phase !== "appear") return;

    dotOpacity.value = withTiming(1, {
      duration: LAUNCH_SCREEN_TIMINGS.appear,
      easing: Easing.out(Easing.quad),
    });

    dotScale.value = withTiming(1, {
      duration: LAUNCH_SCREEN_TIMINGS.appear + 60,
      easing: Easing.out(Easing.quad),
    });

    const timeout = setTimeout(() => {
      setPhase("write");
    }, 90);

    return () => clearTimeout(timeout);
  }, [phase, dotOpacity, dotScale]);

  useEffect(() => {
    if (phase !== "write") return;

    const start = performance.now();
    const duration = LAUNCH_SCREEN_TIMINGS.write;

    let frameId = 0;

    const tick = (now: number) => {
      const progress = clamp((now - start) / duration, 0, 1);
      const point = getPointForProgress(progress);

      dotX.value = point.x - centerX;
      dotY.value = point.y - centerY;
      setLogoOpacity(0.18 + progress * 0.82);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setLogoOpacity(1);
        setPhase("settle");
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [phase, centerX, centerY, dotX, dotY, getPointForProgress]);

  useEffect(() => {
    if (phase !== "settle") return;

    const timeout = setTimeout(() => {
      setPhase("bounce");
    }, LAUNCH_SCREEN_TIMINGS.settle);

    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "bounce") return;

    const start = performance.now();
    const duration = LAUNCH_SCREEN_TIMINGS.bounce;

    let frameId = 0;

    const tick = (now: number) => {
      const progress = clamp((now - start) / duration, 0, 1);
      const cycle = (now - start) / 420;
      const normalized = (cycle % 1) * Math.PI * 2;
      const bounceHeight =
        LAUNCH_SCREEN_BOUNCE.minHeight +
        (LAUNCH_SCREEN_BOUNCE.maxHeight - LAUNCH_SCREEN_BOUNCE.minHeight) * progress +
        Math.sin(normalized) * 2;
      const amplitude = bounceHeight;
      const offset = Math.sin(normalized * 1.4) * amplitude;
      const scale = 1 - Math.abs(Math.sin(normalized * 1.2)) * 0.06;

      dotX.value = 112;
      dotY.value = offset;
      setBounceScale(scale);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setPhase("expand");
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [dotX, dotY, phase]);

  useEffect(() => {
    if (phase !== "expand") return;

    const duration = LAUNCH_SCREEN_TIMINGS.expand;
    const targetScale = Math.max(width, height) / 14;

    expansionScale.value = withTiming(targetScale, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    const timeout = setTimeout(() => {
      setPhase("complete");
      if (onComplete) {
        onComplete();
      } else {
        router.replace("/(tabs)/explore");
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [phase, expansionScale, height, onComplete, router, width]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [
      { translateX: dotX.value },
      { translateY: dotY.value },
      { scale: dotScale.value },
    ],
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: expansionScale.value }],
    opacity: 1,
  }));

  const bounceDotStyle = {
    transform: [{ scale: phase === "bounce" ? bounceScale : 1 }],
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.background} />

      <Animated.View
        pointerEvents="none"
        style={[styles.expandingCircle, animatedCircleStyle]}
      />

      <View style={styles.logoShell}>
        <Text
          style={[
            styles.logoText,
            {
              color: LAUNCH_SCREEN_COLORS.ink,
              fontSize: logoFontSize,
              letterSpacing,
              opacity: logoOpacity,
            },
          ]}
          numberOfLines={1}
        >
          {logoText}
        </Text>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.dot,
          animatedDotStyle,
          phase === "bounce" ? bounceDotStyle : undefined,
        ]}
      />

      {phase === "bounce" && (
        <View style={styles.periodAnchor}>
          <View style={styles.periodDot} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: LAUNCH_SCREEN_COLORS.background,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LAUNCH_SCREEN_COLORS.background,
  },
  logoShell: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  logoText: {
    fontFamily: LAUNCH_SCREEN_TYPOGRAPHY.fontFamily,
    fontWeight: LAUNCH_SCREEN_TYPOGRAPHY.fontWeight,
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 90,
  },
  dot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: LAUNCH_SCREEN_COLORS.ink,
    shadowColor: LAUNCH_SCREEN_COLORS.ink,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  expandingCircle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: LAUNCH_SCREEN_COLORS.ink,
  },
  periodAnchor: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  periodDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: LAUNCH_SCREEN_COLORS.ink,
    top: "50%",
    left: "50%",
    marginLeft: 112,
    marginTop: -7,
    opacity: 0.2,
  },
});
