import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors } = useTheme();

  const s = makeStyles(colors);
  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "User";
  const email = user?.email ?? "";

  function handleSettings() {
    router.push("/settings");
  }

  function handleHelp() {
    Alert.alert("Help & Support", "Support features coming soon.");
  }

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.title}>Profile</Text>

        <View style={s.profileSection}>
          <View style={s.avatar}>
            <Ionicons name="person" size={48} color="white" />
          </View>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.email}>{email}</Text>
        </View>

        <View style={s.menuContainer}>
          <TouchableOpacity style={s.menuItem} onPress={handleSettings}>
            <View style={s.menuItemContent}>
              <Ionicons name="cog-outline" size={24} color={colors.text} />
              <Text style={s.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem} onPress={handleHelp}>
            <View style={s.menuItemContent}>
              <Ionicons name="help-circle-outline" size={24} color={colors.text} />
              <Text style={s.menuItemText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.subtext} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem} onPress={handleLogout}>
            <View style={s.menuItemContent}>
              <Ionicons name="log-out-outline" size={24} color={colors.red} />
              <Text style={s.logoutText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.subtext} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { flex: 1, paddingHorizontal: 16 },
    title: { fontSize: 32, fontWeight: "bold", color: colors.text, marginTop: 24 },
    profileSection: { marginTop: 32, alignItems: "center" },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: "#c084fc",
      justifyContent: "center",
      alignItems: "center",
    },
    name: { fontSize: 24, fontWeight: "bold", color: colors.text, marginTop: 16 },
    email: { fontSize: 14, color: colors.subtext, marginTop: 4 },
    menuContainer: { marginTop: 48, gap: 12 },
    menuItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    menuItemContent: { flexDirection: "row", alignItems: "center" },
    menuItemText: { fontSize: 18, color: colors.text, marginLeft: 16 },
    logoutText: { fontSize: 18, color: colors.red, marginLeft: 16 },
  });
}
