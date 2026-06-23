import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useAuth } from "@/hooks/use-auth";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 36, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#999", marginBottom: 40 },
  input: {
    backgroundColor: "#1a1a1a", color: "#fff", borderRadius: 12,
    padding: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: "#333",
  },
  button: {
    backgroundColor: "#c084fc", borderRadius: 12, padding: 16,
    alignItems: "center", marginTop: 8,
  },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
  switchRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  switchText: { color: "#999", fontSize: 14 },
  switchLink: { color: "#c084fc", fontSize: 14, fontWeight: "600" },
});

export default function SignInScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUpWithEmail(email, password);
      setLoading(false);
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        setAwaitingConfirmation(true);
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      setLoading(false);
      if (error) Alert.alert("Error", error.message);
    }
  }

  if (awaitingConfirmation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a confirmation link to {email}. Click it, then come back and sign in.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => { setAwaitingConfirmation(false); setIsSignUp(false); }}>
            <Text style={styles.buttonText}>Go to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>{isSignUp ? "Create account" : "Welcome back"}</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? "Start your learning journey" : "Sign in to continue learning"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isSignUp ? "Already have an account? " : "No account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchLink}>{isSignUp ? "Sign In" : "Sign Up"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
