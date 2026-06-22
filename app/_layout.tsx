import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Platform } from "react-native";
import FeedScreen from "./feed";
import StatsScreen from "./stats";
import ProfileScreen from "./profile";

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: "#fff",
    tabBarInactiveTintColor: "#999",
    tabBarStyle: {
      backgroundColor: "#000",
      borderTopColor: "#222",
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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={screenOptions}
        initialRouteName="feed"
      >
        <Tab.Screen
          name="feed"
          component={FeedScreen}
          options={{
            title: "Feed",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="play-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="stats"
          component={StatsScreen}
          options={{
            title: "Stats",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
