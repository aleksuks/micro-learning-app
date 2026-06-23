import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/use-auth";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginTop: 24 },
  profileSection: { marginTop: 32, alignItems: "center" },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#c084fc", justifyContent: "center", alignItems: "center",
  },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff", marginTop: 16 },
  email: { fontSize: 14, color: "#999", marginTop: 4 },
  menuContainer: { marginTop: 48, gap: 12 },
  menuItem: {
    backgroundColor: "#1a1a1a", borderRadius: 12, padding: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  menuItemContent: { flexDirection: "row", alignItems: "center" },
  menuItemText: { fontSize: 18, color: "#fff", marginLeft: 16 },
  logoutText: { fontSize: 18, color: "#ef4444", marginLeft: 16 },
  chevron: { color: "#666" },
});

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "User";
  const email = user?.email ?? "";

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="white" />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="settings" size={24} color="white" />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="help-circle" size={24} color="white" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemContent}>
              <Ionicons name="log-out" size={24} color="#ef4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} style={styles.chevron} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
