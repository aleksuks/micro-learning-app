import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useStreak } from "@/hooks/use-streak";
import { useTheme } from "@/contexts/theme";
import { supabase } from "@/lib/supabase";

export default function StatsScreen() {
  const { user } = useAuth();
  const { streak } = useStreak(user?.id);
  const { colors } = useTheme();
  const [videosCompleted, setVideosCompleted] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const s = makeStyles(colors);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_progress")
      .select("watched, time_spent_seconds")
      .eq("user_id", user.id)
      .eq("watched", true)
      .then(({ data }) => {
        setVideosCompleted(data?.length ?? 0);
        const totalSecs = (data ?? []).reduce(
          (acc, p) => acc + (p.time_spent_seconds ?? 0),
          0
        );
        setTotalMinutes(Math.round(totalSecs / 60));
      });
  }, [user]);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.title}>Your Stats</Text>

        <View style={s.statsContainer}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Videos Completed</Text>
            <Text style={s.statValue}>{videosCompleted}</Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>Current Streak</Text>
            <Text style={s.statValue}>{streak?.current_streak ?? 0} days</Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statLabel}>Total Time Learned</Text>
            <Text style={s.statValue}>{totalMinutes} min</Text>
          </View>
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
    statsContainer: { marginTop: 32, gap: 16 },
    statCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16 },
    statLabel: { fontSize: 14, color: colors.subtext },
    statValue: { fontSize: 36, fontWeight: "bold", color: colors.text, marginTop: 4 },
  });
}
