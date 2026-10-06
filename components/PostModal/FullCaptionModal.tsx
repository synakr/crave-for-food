import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  caption: string;
  onClose: () => void;
}

export default function FullCaptionModal({ visible, caption, onClose }: Props) {
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0.94);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, scale]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close caption">
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.dim} />
      </Pressable>

      <Animated.View
        style={[
          styles.modal,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}>
        <Text style={styles.label}>CAPTION</Text>

        <Text style={styles.caption}>{caption}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },

  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modal: {
    width: "88%",
    maxWidth: 420,
    maxHeight: "70%",
    padding: 20,
    borderRadius: 22,
    backgroundColor: "#211D1D",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 24,

    elevation: 35,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#8F8080",
    marginBottom: 12,
  },

  caption: {
    fontSize: 15,
    lineHeight: 23,
    color: "#F5EEEE",
  },
});
