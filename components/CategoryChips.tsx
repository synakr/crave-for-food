import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

const CATEGORIES = [
  {
    id: "food",
    label: "Food",
    icon: "restaurant-outline",
  },
  {
    id: "cafe",
    label: "Cafés",
    icon: "cafe-outline",
  },
  {
    id: "drinks",
    label: "Drinks",
    icon: "wine-outline",
  },
  {
    id: "pastry",
    label: "Desserts",
    icon: "ice-cream-outline",
  },
  {
    id: "dish",
    label: "Desserts",
    icon: "ice-cream-outline",
  },
];

export default function CategoryChips() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {CATEGORIES.map((item, index) => {
        const active = index === 0;

        return (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.chip,
              active && styles.activeChip,
              pressed && styles.pressed,
            ]}>
            <BlurView
              intensity={Platform.OS === "ios" ? 50 : 35}
              tint="light"
              style={styles.blur}>
              <Ionicons
                name={item.icon as any}
                size={19}
                color={active ? "#111" : "rgba(17,17,17,0.55)"}
              />

              <Text style={[styles.text, active && styles.activeText]}>
                {item.label}
              </Text>
            </BlurView>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingRight: 20,
  },

  chip: {
    height: 42,
    minWidth: 92,
    borderRadius: 21,
    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.72)",

    borderWidth: 1,
    borderColor: "rgb(10, 10, 10)",

    marginRight: 8,

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

  blur: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 14,

    backgroundColor: "rgba(255,255,255,0.45)",
  },

  activeChip: {
    borderColor: "rgb(10, 10, 10)",
    backgroundColor: "rgba(10, 10, 10, 0.06)",
  },

  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(17,17,17,0.5)",
  },

  activeText: {
    color: "#111",
  },

  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
