import { View, Text, SafeAreaView, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Video Feed</Text>
        <Text style={styles.subtitle}>Vertical micro-learning videos coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
