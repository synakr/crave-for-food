import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const SAVED = [
  {
    id: "1",
    title: "Spicy Chicken Momos",
    location: "Matabari",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
  },
  {
    id: "2",
    title: "Cheese Burger",
    location: "Udaipur",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: "3",
    title: "Cold Coffee",
    location: "Melaghar",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
  },
];

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved</Text>

      <FlatList
        data={SAVED}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.food} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090C12",
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 18,
  },

  list: {
    paddingBottom: 120,
    gap: 12,
  },

  card: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151922",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#20252E",
  },

  image: {
    width: 90,
    height: 90,
  },

  info: {
    flex: 1,
    paddingHorizontal: 14,
  },

  food: {
    color: "#F1F2F5",
    fontSize: 16,
    fontWeight: "700",
  },

  location: {
    color: "#8D94A3",
    fontSize: 13,
    marginTop: 5,
  },
});
