import { View, Text, FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useFeed } from "@/hooks/use-feed";
import { FeedItem } from "@/types";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#999", fontSize: 16 },
  card: {
    backgroundColor: "#1a1a1a", marginHorizontal: 16, marginVertical: 8,
    borderRadius: 16, padding: 20,
  },
  topicBadge: {
    alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, marginBottom: 12,
  },
  topicText: { fontSize: 12, fontWeight: "600", color: "#000" },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  body: { fontSize: 14, color: "#aaa", lineHeight: 20 },
  complexity: { fontSize: 12, color: "#666", marginTop: 12, textTransform: "capitalize" },
});

function FeedCard({ item }: { item: FeedItem }) {
  const topic = item.content_item.sub_topic?.topic;
  return (
    <View style={styles.card}>
      {topic && (
        <View style={[styles.topicBadge, { backgroundColor: topic.color_primary }]}>
          <Text style={styles.topicText}>{topic.name}</Text>
        </View>
      )}
      <Text style={styles.title}>{item.content_item.title}</Text>
      {item.content_item.body_text ? (
        <Text style={styles.body}>{item.content_item.body_text}</Text>
      ) : null}
      <Text style={styles.complexity}>{item.content_item.complexity_level}</Text>
    </View>
  );
}

export default function FeedScreen() {
  const { user } = useAuth();
  const { feed, loading, fetchMore } = useFeed(user?.id);

  if (loading && feed.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && feed.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No content yet. Check back soon!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={item => item.content_item.id}
        renderItem={({ item }) => <FeedCard item={item} />}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
}
