# Crave — Project Context

## Overview
Crave is a location-based social discovery mobile app. The current product experience is food-oriented, but the architecture should remain general enough for future discovery modes such as travel and other location-based content.

Current implementation is an **Expo + React Native MVP backed by an in-memory mock database**. The app is not yet connected to a production backend, persistent database, production authentication, or production media storage.

## Stack
- Expo SDK 57
- React Native 0.86.3
- React 19.2.3
- Expo Router 57
- TypeScript 6
- react-native-maps 1.27.2
- Reanimated 4.5.1
- Gesture Handler 2.32
- Expo Location 57
- Expo Image Picker 57
- Expo Blur / Linear Gradient / SVG

## App Structure
```text
app/
├── _layout.tsx
├── index.tsx
├── create-post.tsx
├── challenge.tsx
├── leaderboard.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── explore.tsx
    ├── saved.tsx
    ├── activity.tsx
    └── profile.tsx

components/
data/
├── models/
├── repositories/
├── mock/
└── challenges/
constants/
```

## Major Modules
- **Explore:** map-first discovery, location, search, category UI, post markers, focused post UI, post modal.
- **Posts:** post creation, content models, post repository, likes, comments, saves.
- **Profile:** profile presentation, stats, badges, post grid and related interactions.
- **Leaderboard:** leaderboard presentation and navigation.
- **Challenges:** personal challenge data and challenge selection UI.
- **Navigation:** Expo Router stack + tabs with a custom floating tab bar and navigation drawer.

## Data Architecture
UI code should consume repository interfaces rather than coupling new features directly to storage implementation.

Current repository interfaces:
- `PostRepository`
- `CommentRepository`
- `LikeRepository`
- `SavedRepository`

Current implementations are mock/in-memory repositories backed by `data/mock/db.ts`.

The mock database currently models users, places, posts, post contents, likes, comments, follows, follow requests, mentions, map promotions, user locations and saved posts.

See `docs/DATABASE.md` for the compact data reference.

## Important Integrations
- `expo-location` for foreground device location.
- `react-native-maps` for map rendering.
- `expo-image-picker` for image selection.
- `app.config.js` configures `react-native-maps` with `GOOGLE_MAPS_API_KEY` for native Android builds. Never commit the secret value.

## Current State
- UI and interaction layer is substantially implemented.
- Mock data/repository layer is active.
- Native and Expo Go development workflows are supported.
- Backend/persistent storage is not active in the current codebase.

## Constraints
- Preserve general-purpose location-discovery architecture even while the current UI is food-focused.
- Prefer repository/model boundaries over direct data access in new features.
- Keep the visual language clean, premium and light; do not introduce a dark redesign unless explicitly requested.
- Avoid unnecessary dependencies and architectural rewrites.
