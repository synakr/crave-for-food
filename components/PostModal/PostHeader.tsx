import { Image, StyleSheet, Text, View } from "react-native";

interface Props {
  avatar: string | null;
  name: string;
  time: string;
}

const FALLBACK_AVATAR = "https://i.pravatar.cc/150?img=12";

export default function PostHeader({ avatar, name, time }: Props) {
  return (
    <View style={styles.topSection}>
      <Image
        source={{
          uri: avatar ?? FALLBACK_AVATAR,
        }}
        style={styles.avatar}
      />

      <View style={styles.userInfo}>
        <Text style={styles.username} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#292424",
  },

  userInfo: {
    flex: 1,
    minWidth: 0,
  },

  username: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  time: {
    marginTop: 2,
    fontSize: 11,
    color: "#9C8E8E",
  },
});
