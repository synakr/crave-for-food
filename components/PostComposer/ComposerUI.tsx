import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function ComposerLayout({
  title,
  children,
  onCancel,
  onSubmit,
  submitting = false,
  submitLabel = "Publish",
}: {
  title: string;
  children: ReactNode;
  onCancel?: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onCancel ? (
          <Pressable onPress={onCancel} hitSlop={10} style={styles.iconButton}>
            <Ionicons name="close" size={22} color="#202020" />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          disabled={submitting}
          onPress={onSubmit}
          style={[styles.publishButton, submitting && { opacity: 0.65 }]}>
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
              <Text style={styles.publishText}>{submitLabel}</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  maxLength,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "numeric" | "email-address";
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#969696"
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7F5" },
  header: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8E5E2",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#202020", fontSize: 17, fontWeight: "700" },
  content: { padding: 16, paddingBottom: 28 },
  footer: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8E5E2",
  },
  publishButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: "#171717",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  publishText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  fieldWrap: { marginBottom: 16 },
  label: { marginBottom: 7, fontSize: 13, fontWeight: "700", color: "#393939" },
  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E1DE",
    backgroundColor: "#FFFFFF",
    color: "#202020",
    fontSize: 15,
  },
  multiline: { minHeight: 120, paddingTop: 12 },
});
