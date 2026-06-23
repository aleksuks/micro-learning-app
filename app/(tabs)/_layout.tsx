import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useTheme } from "@/contexts/theme";

export default function TabLayout() {
  const { colors } = useTheme();

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: colors.tabActive,
    tabBarInactiveTintColor: colors.tabInactive,
    tabBarStyle: {
      backgroundColor: colors.tabBar,
      borderTopColor: colors.tabBarBorder,
      borderTopWidth: 1,
      paddingBottom: Platform.OS === "ios" ? 20 : 8,
      paddingTop: 8,
      height: Platform.OS === "ios" ? 80 : 56,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 4,
    },
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
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
