import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import FloatingTabBar from "@/components/FloatingTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarActiveTintColor: "#C89B9B",
        tabBarInactiveTintColor: "#A99595",

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: "absolute",

          left: 16,
          right: 16,
          bottom: 18,

          height: 82,

          borderRadius: 30,

          backgroundColor: "transparent",

          borderTopWidth: 0,

          elevation: 0,

          overflow: "hidden",

          shadowColor: "#352727",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.08,
          shadowRadius: 26,
        },

        tabBarItemStyle: {
          marginVertical: 10,
          borderRadius: 18,
        },

        tabBarIconStyle: {
          marginTop: 2,
        },

        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={95}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}