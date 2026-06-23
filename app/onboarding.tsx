import { useState } from "react";
import {
  View, Text, SafeAreaView, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TOPICS } from "@/constants/topics";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 15, color: "#999", marginTop: 8, lineHeight: 22 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, paddingBottom: 120 },
  topicCard: {
    width: "46%", margin: "2%", borderRadius: 16, padding: 16,
    backgroundColor: "#1a1a1a", borderWidth: 2, borderColor: "transparent",
  },
  topicCardSelected: { borderColor: "#fff" },
  iconRow: { marginBottom: 10 },
  topicName: { fontSize: 14, fontWeight: "600", color: "#fff" },
  topicDesc: { fontSize: 12, color: "#aaa", marginTop: 4, lineHeight: 16 },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#000", paddingHorizontal: 24, paddingVertical: 20,
    borderTopWidth: 1, borderTopColor: "#222",
  },
  button: {
    backgroundColor: "#c084fc", borderRadius: 12, padding: 16, alignItems: "center",
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
  countText: { color: "#999", textAlign: "center", marginBottom: 12, fontSize: 13 },
});

export default function OnboardingScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  function toggle(slug: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function handleFinish() {
    if (!user || selected.size === 0) return;
    setLoading(true);

    try {
      // Fetch topic IDs for selected slugs
      const { data: topics } = await supabase
        .from("topics")
        .select("id, slug")
        .in("slug", Array.from(selected));

      if (!topics || topics.length === 0) throw new Error("Could not load topics");

      // Insert interest rows
      const interests = topics.map(t => ({
        user_id: user.id,
        topic_id: t.id,
        interest_score: 0.7,
        explicit_score: 1.0,
        implicit_score: 0.0,
      }));

      await supabase
        .from("user_topic_interests")
        .upsert(interests, { onConflict: "user_id,topic_id" });

      // Mark user as onboarded
      await supabase
        .from("user_profiles")
        .update({ onboarded: true })
        .eq("id", user.id);

      router.replace("/(tabs)/index");
    } catch (e) {
      Alert.alert("Error", (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>What interests you?</Text>
          <Text style={styles.subtitle}>
            Pick topics you want to learn about. You can always change this later.
          </Text>
        </View>

        <View style={styles.grid}>
          {TOPICS.map(topic => {
            const isSelected = selected.has(topic.slug);
            return (
              <TouchableOpacity
                key={topic.slug}
                style={[styles.topicCard, isSelected && styles.topicCardSelected]}
                onPress={() => toggle(topic.slug)}
                activeOpacity={0.7}
              >
                <View style={styles.iconRow}>
                  <Ionicons
                    name={topic.icon_name as any}
                    size={28}
                    color={topic.color_primary}
                  />
                </View>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicDesc}>{topic.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.countText}>
          {selected.size === 0
            ? "Select at least 1 topic"
            : `${selected.size} topic${selected.size > 1 ? "s" : ""} selected`}
        </Text>
        <TouchableOpacity
          style={[styles.button, selected.size === 0 && styles.buttonDisabled]}
          onPress={handleFinish}
          disabled={selected.size === 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Start Learning</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
