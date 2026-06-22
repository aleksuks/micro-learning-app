import { View, Text, SafeAreaView, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
  },
  statsContainer: {
    marginTop: 32,
    gap: 16,
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
});

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Stats</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Videos Completed</Text>
            <Text style={styles.statValue}>0</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>0 days</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Time Learned</Text>
            <Text style={styles.statValue}>0 min</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
