import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface DemoPopupProps {
  visible: boolean;
  onClose: () => void;
}

export default function DemoPopup({ visible, onClose }: DemoPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color="#555" />
          </Pressable>

          {/* Content */}
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={28} color="#F06B6B" />
          </View>

          <Text style={styles.title}>Demo Popup</Text>

          <Text style={styles.description}>
            This is a demo popup for the long-press interaction.
          </Text>

          <Pressable style={styles.actionButton} onPress={onClose}>
            <Text style={styles.actionText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  popup: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },

  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF1F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#777",
    marginBottom: 22,
  },

  actionButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F06B6B",
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
