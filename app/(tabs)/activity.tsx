import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const ACTIVITIES = [
  { id: 1, icon: "heart", text: "Riya liked your Momos post", time: "2m ago" },
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
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Activity</Text>
      <Pressable onPress={() => router.push("/create-post")}>
        <Text style={styles.postIcon}>Create Post</Text>
      </Pressable>

      {ACTIVITIES.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name={item.icon as any} size={20} color="#FF6B6B" />
          </View>

          <View style={styles.info}>
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
    backgroundColor: "#090C12",
  },

  content: {
    padding: 20,
    paddingTop: 70,
    gap: 12,
    paddingBottom: 120,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151922",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#20252E",
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#24191C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  text: {
    color: "#F1F2F5",
    fontSize: 15,
    fontWeight: "600",
  },

  time: {
    color: "#8D94A3",
    fontSize: 13,
    marginTop: 4,
  },
  postIcon: {
    color: "#F1F2F5",
  },
});
