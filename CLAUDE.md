# Product Specification: Dynamic Micro-Learning App

## Core Overview
A mobile-first micro-learning platform targeting adolescents. It uses a high-dopamine vertical video feed format featuring hypnotic, satisfying video loops (or stock footage) with text overlays, automated voiceovers, and instant interactive comprehension checks.

## Tech Stack
- **Frontend:** React Native with Expo (TypeScript)
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** Expo Router (File-based)
- **Backend & Database:** Supabase (Auth, PostgreSQL database, Storage for MP4s/MP3s)

## MVP Scope & Content Architecture
1. **Vertical Immersive Video Feed:** Full-screen vertical swipe interface utilizing `expo-video` playing hypnotic background loops.
2. **Text & Audio Synchronization:** Dynamic captions overlaid directly on top of the video, timed alongside an automated AI voiceover track.
3. **Interactive Quiz Overlay:** A snappy bottom-sheet or overlay modal containing a single multiple-choice question per video to gamify retention.
4. **Basic User Progress:** A profile tab tracking user engagement metrics (videos completed, streak count).