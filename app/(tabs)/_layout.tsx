import FloatingTabBar from "@/components/FloatingTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
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
