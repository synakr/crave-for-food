import FloatingTabBar from "@/components/FloatingTabBar";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

type FloatingTabBarProps = ComponentProps<typeof FloatingTabBar>;

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <FloatingTabBar {...(props as unknown as FloatingTabBarProps)} />
      )}
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
