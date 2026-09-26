import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  location: string;
}

export default function PostLocation({ title, location }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.locationRow}>
        <Ionicons name="location" size={14} color="#A99A9A" />

        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },

  title: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  location: {
    flex: 1,
    marginLeft: 4,
    fontSize: 12,
    color: "#A99A9A",
  },
});
