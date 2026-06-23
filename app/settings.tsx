import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOPICS } from "@/constants/topics";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/theme";

const PREFS_KEY = "@app_prefs";

interface Prefs {
  notifications: boolean;
  autoplay: boolean;
  subtitles: boolean;
}

const DEFAULT_PREFS: Prefs = {
  notifications: true,
  autoplay: false,
  subtitles: true,
};

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark, colors, toggleTheme } = useTheme();

  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const s = makeStyles(colors);

  useEffect(() => {
    Promise.all([loadPrefs(), loadUserTopics()]).finally(() => setLoading(false));
  }, []);

  async function loadPrefs() {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
  }

  async function updatePref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
  }

  async function loadUserTopics() {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("user_topic_interests")
        .select("topic_id")
        .eq("user_id", user.id);

      if (data) {
        const { data: topics } = await supabase
          .from("topics")
          .select("slug")
          .in("id", data.map((d) => d.topic_id));

        if (topics) {
          setSelectedTopics(new Set(topics.map((t) => t.slug)));
        }
      }
    } catch (e) {
      console.error("Error loading topics:", e);
    }
  }

  function toggleTopic(slug: string) {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function handleSaveTopics() {
    if (!user || selectedTopics.size === 0) return;
    setSaving(true);
    try {
      const { data: topics } = await supabase
        .from("topics")
        .select("id, slug")
        .in("slug", Array.from(selectedTopics));

      if (!topics || topics.length === 0) throw new Error("Could not load topics");

      const interests = topics.map((t) => ({
        user_id: user.id,
        topic_id: t.id,
        interest_score: 0.7,
        explicit_score: 1.0,
        implicit_score: 0.0,
      }));

      await supabase
        .from("user_topic_interests")
        .upsert(interests, { onConflict: "user_id,topic_id" });

      router.back();
    } catch (e) {
      Alert.alert("Error", (e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.title}>Settings</Text>
      </View>

      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Appearance</Text>
          <View style={s.settingItem}>
            <View style={s.settingContent}>
              <Text style={s.settingLabel}>Light Mode</Text>
              <Text style={s.settingDesc}>Switch to a lighter color scheme</Text>
            </View>
            <Switch
              value={!isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Playback */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Playback</Text>
          <View style={s.settingItem}>
            <View style={s.settingContent}>
              <Text style={s.settingLabel}>Autoplay</Text>
              <Text style={s.settingDesc}>Automatically advance to the next video</Text>
            </View>
            <Switch
              value={prefs.autoplay}
              onValueChange={(v) => updatePref("autoplay", v)}
              trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
          <View style={s.settingItem}>
            <View style={s.settingContent}>
              <Text style={s.settingLabel}>Subtitles</Text>
              <Text style={s.settingDesc}>Show captions on every video</Text>
            </View>
            <Switch
              value={prefs.subtitles}
              onValueChange={(v) => updatePref("subtitles", v)}
              trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Notifications</Text>
          <View style={s.settingItem}>
            <View style={s.settingContent}>
              <Text style={s.settingLabel}>Daily Reminders</Text>
              <Text style={s.settingDesc}>Get nudged to keep your streak going</Text>
            </View>
            <Switch
              value={prefs.notifications}
              onValueChange={(v) => updatePref("notifications", v)}
              trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Topics */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Topics of Interest</Text>
          <Text style={s.settingDesc}>
            Choose what you want to learn — your feed updates right away.
          </Text>
          <View style={s.topicsGrid}>
            {TOPICS.map((topic) => {
              const isSelected = selectedTopics.has(topic.slug);
              return (
                <TouchableOpacity
                  key={topic.slug}
                  style={[s.topicCard, isSelected && s.topicCardSelected]}
                  onPress={() => toggleTopic(topic.slug)}
                  activeOpacity={0.7}
                >
                  <View style={s.topicCardIcon}>
                    <Ionicons
                      name={topic.icon_name as any}
                      size={24}
                      color={topic.color_primary}
                    />
                  </View>
                  <Text style={s.topicCardName}>{topic.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[s.saveButton, selectedTopics.size === 0 && s.saveButtonDisabled]}
            onPress={handleSaveTopics}
            disabled={selectedTopics.size === 0 || saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.accentText} />
            ) : (
              <Text style={s.saveButtonText}>Save Topics</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Account</Text>
          <TouchableOpacity style={s.settingItem} onPress={() => Alert.alert("Privacy", "Privacy policy coming soon.")}>
            <View style={s.settingContent}>
              <Text style={s.settingLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <TouchableOpacity style={s.settingItem} onPress={() => Alert.alert("Terms", "Terms of service coming soon.")}>
            <View style={s.settingContent}>
              <Text style={s.settingLabel}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <View style={[s.settingItem, { marginBottom: 0 }]}>
            <View style={s.settingContent}>
              <Text style={s.settingLabel}>App Version</Text>
            </View>
            <Text style={s.versionText}>1.0.0</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
    },
    backButton: { marginRight: 16 },
    title: { fontSize: 28, fontWeight: "bold", color: colors.text, flex: 1 },
    content: { flex: 1, paddingHorizontal: 16 },
    section: { marginBottom: 32 },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.subtext,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    settingItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    settingContent: { flex: 1 },
    settingLabel: { fontSize: 16, color: colors.text, fontWeight: "500" },
    settingDesc: { fontSize: 13, color: colors.subtext, marginTop: 4, marginBottom: 12 },
    topicsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
    topicCard: {
      width: "48%",
      borderRadius: 12,
      padding: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: "transparent",
    },
    topicCardSelected: { borderColor: colors.accent },
    topicCardIcon: { marginBottom: 8 },
    topicCardName: { fontSize: 13, fontWeight: "600", color: colors.text },
    saveButton: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      padding: 14,
      alignItems: "center",
      marginBottom: 8,
    },
    saveButtonText: { color: colors.accentText, fontSize: 16, fontWeight: "bold" },
    saveButtonDisabled: { opacity: 0.4 },
    versionText: { fontSize: 14, color: colors.subtext },
  });
}
