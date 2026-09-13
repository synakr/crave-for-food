import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

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
            style={[styles.chip, active && styles.activeChip]}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={active ? "#F06B6B" : "#8B7777"}
            />

            <Text style={[styles.text, active && styles.activeText]}>
              {item.label}
            </Text>
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
    flexDirection: "row",
    alignItems: "center",

    height: 40,
    paddingHorizontal: 14,

    borderRadius: 20,

    backgroundColor: "#FFF",

    marginRight: 8,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  activeChip: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFD6D6",
  },

  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#8B7777",
  },
  activeText: {
    color: "#F06B6B",
  },
});
