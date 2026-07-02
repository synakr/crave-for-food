import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ACTIVITIES = [
  {
    id: 1,
    icon: "heart",
    text: "Riya liked your Momos post",
    time: "2m ago",
  },
  {
    id: 2,
    icon: "bookmark",
    text: "Arjun saved your Burger post",
    time: "18m ago",
  },
  {
    id: 3,
    icon: "chatbubble",
    text: 'Neha commented "Looks delicious 🤤"',
    time: "1h ago",
  },
  {
    id: 4,
    icon: "person-add",
    text: "Karan started following you",
    time: "4h ago",
  },
];

export default function ActivityScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Activity</Text>

      {ACTIVITIES.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.icon}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color="#FF6B6B"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F6",
  },

  content: {
    padding: 20,
    paddingTop: 70,
    gap: 14,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
  },

  time: {
    color: "#999",
    marginTop: 4,
  },
});