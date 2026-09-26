import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  caption: string;
  maxLength?: number;
  onMore: () => void;
}

export default function PostCaption({
  caption,
  maxLength = 140,
  onMore,
}: Props) {
  if (!caption) {
    return null;
  }

  const isLongCaption = caption.length > maxLength;

  const visibleCaption = isLongCaption
    ? `${caption.slice(0, maxLength)}...`
    : caption;

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>{visibleCaption}</Text>

      {isLongCaption && (
        <Pressable
          onPress={onMore}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Read full caption">
          <Text style={styles.more}>more</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 13,
  },

  caption: {
    fontSize: 13,
    lineHeight: 19,
    color: "#C8BBBB",
  },

  more: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
