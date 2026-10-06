# Crave — Architecture Reference

## High-Level Flow
```text
Expo Router screen
      ↓
UI components / screen state
      ↓
Repository interface
      ↓
Current mock repository
      ↓
data/mock/db.ts
```

The intended long-term change is at the repository implementation/data boundary, not a rewrite of screen code around a new backend.

## Navigation
- `app/_layout.tsx` defines the root stack and global screen options.
- `app/(tabs)/_layout.tsx` defines the main tabs.
- `components/FloatingTabBar.tsx` supplies the custom tab bar.
- Additional routes such as `create-post`, `challenge`, and `leaderboard` live directly under `app/`.

## Data Layer
### Models
Domain models live in `data/models/` and include posts, post content, users, places, comments, likes, follows, follow requests, mentions, map promotions, user locations and saved posts.

### Repositories
Interfaces live beside their mock implementations:
- `data/repositories/PostRepository.ts`
- `CommentRepository.ts`
- `LikeRepository.ts`
- `SavedRepository.ts`

`data/repositories/index.ts` currently exports mock implementations as the application-level repository instances.

### Mock Store
`data/mock/db.ts` contains the in-memory store. `data/mock/seed.ts` populates it. This is runtime state, not durable persistence.

## Explore Data Flow
`app/(tabs)/explore.tsx` seeds the mock database, requests explore posts from `postRepository.getExplorePosts()`, prefetches marker images, stores the result in screen state, and renders map markers/post UI.

Location is obtained with `expo-location` and used to update the map region.

## UI Architecture
Reusable UI is placed in `components/`. Feature-specific route orchestration remains in `app/` routes. Constants such as map styles and current-user access live in `constants/`.

Prefer extending existing components and repository/model abstractions before introducing parallel patterns.

## Native Configuration
`app.config.js` adds the `react-native-maps` config plugin and passes `process.env.GOOGLE_MAPS_API_KEY` as the Android native Google Maps key. The key value itself is environment-only and must not enter source control.

## Boundary Rules
1. Do not move repository logic into presentation components just to solve a local feature.
2. Do not introduce a second state/data architecture without a clear requirement.
3. Do not make the UI depend on mock-only behavior that a future persistent implementation cannot reproduce.
4. Keep platform-specific map behavior explicit.
