import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useStreak } from "@/hooks/use-streak";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginTop: 24 },
  statsContainer: { marginTop: 32, gap: 16 },
  statCard: { backgroundColor: "#1a1a1a", borderRadius: 12, padding: 16 },
  statLabel: { fontSize: 14, color: "#999" },
  statValue: { fontSize: 36, fontWeight: "bold", color: "#fff", marginTop: 4 },
});

export default function StatsScreen() {
  const { user } = useAuth();
  const { streak } = useStreak(user?.id);
  const [videosCompleted, setVideosCompleted] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_progress")
      .select("watched, time_spent_seconds")
      .eq("user_id", user.id)
      .eq("watched", true)
      .then(({ data }) => {
        setVideosCompleted(data?.length ?? 0);
        const totalSecs = (data ?? []).reduce((acc, p) => acc + (p.time_spent_seconds ?? 0), 0);
        setTotalMinutes(Math.round(totalSecs / 60));
      });
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Stats</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Videos Completed</Text>
            <Text style={styles.statValue}>{videosCompleted}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>
              {streak?.current_streak ?? 0} days
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Time Learned</Text>
            <Text style={styles.statValue}>{totalMinutes} min</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
