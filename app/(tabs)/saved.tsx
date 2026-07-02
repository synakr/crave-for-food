import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const SAVED = [
  {
    id: "1",
    title: "Spicy Chicken Momos",
    location: "Matabari",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e",
  },
  {
    id: "2",
    title: "Cheese Burger",
    location: "Udaipur",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: "3",
    title: "Cold Coffee",
    location: "Melaghar",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
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
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.food}>{item.title}</Text>
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
    backgroundColor: "#FAF8F6",
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },

  image: {
    width: 100,
    height: 100,
  },

  food: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 18,
    marginHorizontal: 16,
  },

  location: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
    marginHorizontal: 16,
  },
});