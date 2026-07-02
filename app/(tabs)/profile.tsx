import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://i.pravatar.cc/300",
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Sayan</Text>
      <Text style={styles.username}>@sayan</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.number}>27</Text>
          <Text style={styles.label}>Posts</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>142</Text>
          <Text style={styles.label}>Saved</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>890</Text>
          <Text style={styles.label}>Followers</Text>
        </View>
      </View>

      <Pressable style={styles.button}>
        <Ionicons
          name="create-outline"
          size={18}
          color="#fff"
        />

        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>

      <View style={styles.card}>
        <Ionicons
          name="restaurant-outline"
          size={22}
          color="#FF6B6B"
        />

        <View style={{ marginLeft: 14 }}>
          <Text style={styles.cardTitle}>Favorite Cuisine</Text>
          <Text style={styles.cardValue}>Street Food 🌮</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons
          name="location-outline"
          size={22}
          color="#FF6B6B"
        />

        <View style={{ marginLeft: 14 }}>
          <Text style={styles.cardTitle}>Home City</Text>
          <Text style={styles.cardValue}>Agartala</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F6",
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 24,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  name: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "700",
  },

  username: {
    marginTop: 4,
    color: "#888",
    fontSize: 16,
  },

  stats: {
    flexDirection: "row",
    marginVertical: 30,
  },

  stat: {
    alignItems: "center",
    marginHorizontal: 22,
  },

  number: {
    fontSize: 22,
    fontWeight: "700",
  },

  label: {
    color: "#888",
    marginTop: 4,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 28,
    height: 52,
    borderRadius: 16,
    marginBottom: 32,
  },

  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 16,
  },

  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  cardTitle: {
    color: "#777",
    fontSize: 13,
  },

  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
});