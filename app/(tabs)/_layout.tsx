import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,

          borderRadius: 100,

          height: 70,

          paddingBottom: 10,
          paddingTop: 10,

          backgroundColor: "rgba(255,255,255,0.95)",

          borderTopWidth: 0,

          elevation: 0,
        },
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
