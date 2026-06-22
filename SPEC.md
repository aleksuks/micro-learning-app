# Micro Learning App
# Product Specification: Micro-Learning App

## Core Overview
A mobile-first micro-learning platform targeting adolescents. It uses a high-dopamine vertical video feed format featuring "satisfying" backgrounds or relevant stock footage paired with text overlays, automated voiceovers, and instant interactive comprehension checks. Comprehension checks shouldn't be questions that need answers, but more like engagement prompts like "what do you think will happen next?" Content should be generated according to topic. Viewers are shown topics that are known to be of interest, with an occasional insert of something else to see if they find that engaging too.

## Tech Stack
- **Frontend:** React Native with Expo (TypeScript)
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** Expo Router (File-based)
- **Backend & Database:** Supabase (Auth, PostgreSQL database, Storage for MP4s/MP3s)

## MVP Scope & Content Architecture
1. **Vertical Dual-Layer Video Feed:** Full-screen vertical swipe interface utilizing `expo-video`. Videos will feature a hybrid format (either automated stock footage or text and voiceover "satisfying content" loops).
2. **Text & Audio Synchronization:** Dynamic caption overlays timed alongside an automated AI voiceover track.
3. **Interactive Quiz Overlay:** At the right time, a prompt asks the viewer a question designed to drive engagement and critical thought, rather than actually seeking an answer.
4. **Basic User Progress:** A profile tab tracking user engagement metrics (videos completed, streak count).