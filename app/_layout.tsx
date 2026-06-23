import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { ThemeProvider } from "@/contexts/theme";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return; // still loading

    const seg0 = segments[0] as string;
    const inAuthGroup = seg0 === "(auth)";
    const inOnboarding = seg0 === "onboarding";

    if (!session && !inAuthGroup) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace("/(auth)/sign-in" as any);
      return;
    }

    if (session && !inOnboarding) {
      supabase
        .from("user_profiles")
        .select("onboarded")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data && !data.onboarded) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.replace("/onboarding" as any);
          } else if (inAuthGroup) {
            router.replace("/(tabs)/index");
          }
        });
    }
  }, [session, segments]);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
      </Stack>
    </ThemeProvider>
  );
}
