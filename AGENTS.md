# CRAVE — Agent Context & Engineering Guide

> **Purpose:** This file is the primary context document for AI coding agents working on Crave.
> Read it before making changes. Treat the **Current Codebase** sections as the source of truth over older conversations, stale README text, or assumptions.

---

## 0. AI AGENT OPERATING PROTOCOL

### Before doing anything

1. Read this file completely enough to understand the relevant architecture and constraints.
2. Inspect the actual target file(s) before editing them.
3. Search for existing components, repositories, constants, or utilities before creating new ones.
4. Preserve the current architecture unless the task explicitly asks for architectural change.
5. Make the smallest correct change that satisfies the request.
6. Do not rewrite unrelated code or redesign UI without being asked.

### Context efficiency

- Do **not** ask the user to re-explain information already present in this file.
- Do **not** dump the whole repository back to the user.
- When a task is clear, act directly.
- If one missing fact blocks implementation, ask only for that fact.
- Prefer inspecting/searching the repository over guessing.
- Reuse existing components, models, repository contracts, constants, and patterns.
- Avoid introducing dependencies when an installed dependency already solves the problem.
- Keep explanations short; report only what changed, why, and any required command/test.

### Source-of-truth priority

When information conflicts, use this order:

1. Actual current source files
2. `package.json` / Expo config
3. This `AGENTS.md`
4. Current task/request
5. README or historical conversation context

Do not revive code from older pasted snippets merely because it existed previously.

---

# 1. PRODUCT

**Crave** is a location-based social discovery app.

The architecture is intentionally general-purpose. Food is the current visual/product direction, but Crave should remain extensible to other discovery modes such as travel or other location-based content.

Current state is an **Expo + React Native MVP using an in-memory mock database**.

There is currently no production authentication, backend API, persistent database integration, or production media storage in the active codebase.

### Current development focus

- Mobile-first React Native experience
- Android and iOS compatibility
- Map-based discovery
- Social post interactions
- Profile / badges / leaderboard / challenges
- Clean, premium visual UI
- Repository-based data access so the mock backend can later be replaced

---

# 2. CURRENT TECH STACK — SOURCE OF TRUTH

Current versions from `package.json`:

- Expo **SDK 57** (`expo ~57.0.26`)
- Expo Router `~57.0.24`
- React **19.2.3**
- React Native **0.86.3**
- TypeScript `~6.0.3`
- React Native Maps **1.27.2**
- React Native Reanimated **4.5.1**
- React Native Gesture Handler `~2.32.0`
- React Native Safe Area Context `~5.7.0`
- React Native SVG `15.15.4`
- Expo Location `~57.0.20`
- Expo Image Picker `~57.0.20`
- Expo Blur `~57.0.3`
- Expo Linear Gradient `^57.0.2`
- `@expo/vector-icons` `^15.0.3`
- React Native Web `~0.21.0`
- Hermes / New Architecture through current Expo/RN setup

### Important migration fact

The project was migrated from the old Expo SDK 54 setup to **SDK 57**. Do not use old SDK 54 assumptions when changing Expo/native configuration.

The current codebase has already passed the project's Expo compatibility checks after the migration.

---

# 3. ROUTE / APP STRUCTURE

```text
app/
├── _layout.tsx                 Root Expo Router stack
├── index.tsx                   Entry/redirect
├── create-post.tsx             Post creation screen
├── challenge.tsx               Daily challenge screen
├── leaderboard.tsx             Leaderboard route
└── (tabs)/
    ├── _layout.tsx             Tab navigation
    ├── explore.tsx             Main map/discovery screen
    ├── saved.tsx               Saved posts
    ├── activity.tsx            Activity
    └── profile.tsx             Profile

components/
├── Badge.tsx
├── CategoryChips.tsx
├── CommentModal.tsx
├── DemoPopup.tsx
├── ExploreSearchBar.tsx
├── FloatingTabBar.tsx
├── FocusedMiniMap.tsx
├── Leaderboard.tsx
├── LikesModal.tsx
├── MapPostFocus.tsx
├── NavigationDrawer.tsx
└── PostModal/
    ├── FullCaptionModal.tsx
    ├── PostActions.tsx
    ├── PostCaption.tsx
    ├── PostHeader.tsx
    ├── PostLocation.tsx
    ├── PostModal.tsx
    └── index.ts

constants/
├── currentUser.ts
├── mapStyle.ts
└── mapStyleRedesign.ts

data/
├── FoodPost.ts
├── challenges/
│   ├── personalChallenges.ts
│   ├── personalChallengeSelector.ts
│   └── types.ts
├── models/
├── mock/
│   ├── db.ts
│   └── seed.ts
└── repositories/
    ├── CommentRepository.ts
    ├── LikeRepository.ts
    ├── MockCommentRepository.ts
    ├── MockLikeRepository.ts
    ├── MockPostRepository.ts
    ├── MockSavedRepository.ts
    ├── PostRepository.ts
    ├── SavedRepository.ts
    └── index.ts

assets/                        App assets
```

### Important

`README.md` may contain older architecture/file references. **Do not treat it as authoritative** if it conflicts with the actual tree.

---

# 4. ARCHITECTURE

Current architecture:

```text
Screens / UI
     ↓
Repositories
     ↓
Mock Database
```

Target production architecture:

```text
Screens / UI
     ↓
Features / Domain / Services
     ↓
Repositories
     ↓
Supabase / External Providers
```

The repository boundary is intentional. Keep it.

### Do

- Keep UI focused on presentation and interaction.
- Put data operations behind repositories when a repository exists.
- Keep infrastructure replaceable.
- Keep provider-specific code isolated.

### Don't

- Put Supabase calls directly into screens.
- Put random mock arrays directly into screens when the data belongs to the data layer.
- Couple unrelated business logic to Google Maps.
- Create a second competing repository/data-access pattern without a strong reason.

---

# 5. CURRENT DATA LAYER

`data/mock/db.ts` contains the mutable in-memory singleton.

It currently contains collections for concepts including:

- users
- places
- posts
- post contents
- likes
- comments
- follows
- saved posts
- related entities

`data/mock/seed.ts` populates development/demo data.

### Current repositories

`data/repositories/index.ts` exposes:

```ts
postRepository;
commentRepository;
likeRepository;
savedRepository;
```

Current implementations are mock repositories:

```text
PostRepository   → MockPostRepository
CommentRepository → MockCommentRepository
LikeRepository   → MockLikeRepository
SavedRepository  → MockSavedRepository
```

### Current user

`constants/currentUser.ts` currently defines the active mock user as:

```text
user-1
```

Do not introduce another current-user mechanism casually.

Future authentication should replace this mechanism while preserving repository/service boundaries.

---

# 6. SEEDING / STATE BEHAVIOR

`seedMockDatabase()` is currently called by Explore when loading posts.

Important existing behavior:

- Several mock collections are reset/reseeded when Explore mounts.
- Saved state has historically behaved differently and may persist in the singleton.
- Other screens can therefore depend on Explore having initialized mock data first.

Do **not** silently change this behavior unless the task specifically involves state/seed behavior.

If changing seeding, inspect `data/mock/seed.ts` and `data/mock/db.ts` first.

---

# 7. DOMAIN MODELS

Current models include:

- `User`
- `UserLocation`
- `Place`
- `Post`
- `PostContent`
- `Like`
- `Comment`
- `Follow`
- `FollowRequest`
- `Saved`
- `Mention`
- `MapPromotion`

`PostContent` currently has content types:

```text
IMAGE | VIDEO | GIF | AUDIO | TEXT
```

However, **the current MVP post/upload experience is photo-first**. Do not infer that video upload infrastructure is implemented merely because the domain type allows it.

---

# 8. EXPLORE / MAP — CURRENT IMPLEMENTATION

Primary file:

```text
app/(tabs)/explore.tsx
```

The Explore screen currently handles:

- Device location
- Map rendering
- Post markers
- Marker image loading
- Marker press → post modal
- Marker long press → focused post experience
- Focused-post previous/next navigation
- Map recentering
- Location search/geocoding
- Navigation drawer
- Search UI
- Mock post loading/prefetching

### Current location fallback

```text
latitude: 23.5335
longitude: 91.4845
latitudeDelta: 0.03
longitudeDelta: 0.03
```

When location permission is available, Explore gets the current device position with Expo Location.

### Current map behavior

The active `MapView` in the latest code currently has the Google provider line commented out:

```tsx
// provider={PROVIDER_GOOGLE}
```

Therefore, **on iOS the map currently falls back to Apple Maps**. Android/provider behavior should be checked against the exact current file before modifying it.

The current custom map style is also commented out:

```tsx
// customMapStyle={mapStyle}
```

Do not assume `mapStyleRedesign` is currently active just because the constant exists.

### Map-specific implementation rules

Preserve these behaviors unless the task explicitly changes them:

- Image markers are custom React Native views.
- `tracksViewChanges` is controlled using `loadedMarkers`.
- Android marker image loading intentionally uses a delay before updating state.
- Marker press opens the post modal.
- Long press can open `MapPostFocus`.
- `mapRef` is used for recentering and coordinate/screen calculations.

### Map provider architecture

Keep map-provider decisions isolated to the map layer.

Do not spread Google Maps-specific APIs through unrelated components.

If platform-specific behavior is required, prefer a localized pattern such as:

```tsx
{...(Platform.OS === "android"
  ? { provider: PROVIDER_GOOGLE }
  : {})}
```

rather than duplicating the entire map component.

---

# 9. GOOGLE MAPS / NATIVE BUILD CONTEXT

The project uses `react-native-maps@1.27.2`.

`app.config.js` configures the React Native Maps plugin with:

```js
[
  "react-native-maps",
  {
    androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
];
```

The API key is supplied through the environment and **must never be hardcoded into source files or committed to Git**.

`.env` may exist locally. Never copy or expose its secret values into this document, source code, logs, or responses.

### Important debugging fact

A minimal clean Expo test app successfully rendered Google Maps in **Expo Go without configuring a user API key**.

This means:

- The device can render Google Maps.
- Google Play Services/maps renderer is functional.
- `react-native-maps@1.27.2` itself works in the Expo Go environment.
- Expo Go has its own native configuration.

Therefore, if the Crave **native development build** has a blank/black Google map while the clean Expo Go test works, investigate Crave's generated/native configuration rather than assuming the phone or `react-native-maps` package is broken.

### Native configuration rule

Generated native folders are not the architectural source of truth. Prefer Expo config/plugin changes over manual edits to generated native files when possible.

After native configuration changes, rebuild the native app.

---

# 10. LOCATION

`expo-location` is used for:

- Foreground location permission
- Current position
- Geocoding/search

Location failure must not crash the UI.

Current search behavior uses platform geocoding and logs failures rather than presenting a complete search-error UI.

Do not add background location tracking unless explicitly requested.

---

# 11. POST MODAL / SOCIAL INTERACTIONS

The Post Modal is componentized under:

```text
components/PostModal/
```

It currently includes pieces for:

- Header
- Caption
- Full caption modal
- Location
- Actions
- Comments
- Likes

Current social repository interactions include:

- Likes
- Comments
- Saves

Use the repository layer for these operations.

Do not add realtime merely because a social interaction exists.

---

# 12. PROFILE — CURRENT IMPLEMENTATION

Primary file:

```text
app/(tabs)/profile.tsx
```

The current Profile screen includes:

- Fixed hero image background
- Scroll-driven blur effect
- Scroll-driven glass tint
- Profile identity
- Verification icon
- Followers/following/creation stats
- Share/follow/message actions
- Horizontal badge selector
- Selected badge description
- Post grid/content area
- Leaf-branch decorative SVG component

The hero image intentionally remains fixed while the scrollable content moves over it.

Do not remove/reimplement this effect unless explicitly asked.

Current profile data is still derived from the mock database and contains development fallbacks/placeholders to keep the UI populated.

---

# 13. LEADERBOARD / CHALLENGE

### Leaderboard

Route:

```text
app/leaderboard.tsx
```

It currently renders:

```tsx
<Leaderboard />
```

The actual UI lives in:

```text
components/Leaderboard.tsx
```

### Challenge

Route:

```text
app/challenge.tsx
```

Current behavior:

- Selects personal challenges from `data/challenges`.
- Requests camera permission.
- Opens the camera through Expo Image Picker.
- Gets current location.
- Builds a local challenge post object.
- Currently logs the generated post and navigates back.

Do not assume challenge posts are persisted to the mock database unless the code explicitly does so.

---

# 14. NAVIGATION DRAWER

Primary file:

```text
components/NavigationDrawer.tsx
```

Current drawer contains navigation for:

- Explore
- Saved
- Activity
- Leaderboard
- Settings placeholder
- Help & Feedback placeholder
- Daily Challenge

It uses animated slide-in/out behavior and a backdrop.

Do not add navigation destinations that do not have an actual route unless explicitly requested.

---

# 15. MEDIA

Current MVP is photo-oriented.

Current development images may come from remote URLs and local image picker URIs.

Planned production flow:

```text
Select image
   ↓
Compress / optimize
   ↓
Upload to Cloudflare R2
   ↓
Store media reference in Supabase
   ↓
Serve optimized media through CDN/cache
```

Do not implement R2/Supabase media infrastructure unless explicitly requested.

Do not add video infrastructure casually.

---

# 16. FUTURE BACKEND

Planned production backend:

```text
React Native UI
      ↓
Services / Repositories
      ↓
Supabase
 ┌────┼───────────┐
 DB   Auth     Realtime

Media:
React Native → Cloudflare R2 → CDN/cache
```

Supabase is intended for:

- PostgreSQL
- Authentication
- Realtime
- Edge Functions only when server-side logic genuinely requires them

Cloudflare R2 is intended for media storage.

Do not introduce backend infrastructure unless the task explicitly requires it.

---

# 17. REALTIME POLICY

Initially realtime is intended for:

- New posts appearing on the map

Initially **not realtime**:

- Likes
- Comments
- Follows
- Notifications
- General feed refreshes

Normal requests/database operations are sufficient for those interactions initially.

Do not create persistent realtime subscriptions just for convenience.

---

# 18. UI / DESIGN RULES

Crave's visual language is evolving, but the current code contains a strong premium/mobile aesthetic.

Existing patterns include:

- Rounded cards/surfaces
- Blur / glass effects
- Floating controls
- Shadows/elevation
- Animated transitions
- Image-based map markers
- Custom decorative SVG elements
- Light/cream map and UI treatments in Explore
- Dark/glass treatment in the current Profile hero

### Rules

- Preserve existing UI unless redesign is requested.
- Match surrounding component styling when adding UI.
- Prefer existing icons/components.
- Use `StyleSheet.create`.
- Keep styles close to the component.
- Do not introduce a global design-token/theme system without a clear requirement.
- Do not make unrelated screens visually consistent merely for consistency if they intentionally use different treatments.

---

# 19. TYPESCRIPT / CODE STYLE

Use:

- TypeScript
- Functional components
- React hooks
- `@/*` aliases
- Strict typing
- `StyleSheet.create`
- Existing local formatting/style conventions

Existing source generally uses double quotes.

Avoid unnecessary abstraction.

Do not create a component or utility merely to wrap a one-off expression unless it improves maintainability.

---

# 20. DEPENDENCY RULES

Before adding a dependency:

1. Check `package.json`.
2. Check whether Expo/RN already provides the required capability.
3. Check whether an installed package can solve it.
4. Add a new dependency only when necessary.

Do not upgrade Expo/React Native/RN Maps versions casually.

Version changes can require native rebuilds and compatibility work.

---

# 21. NATIVE / EXPO RULES

Current Expo SDK is **57**.

Before changing:

- `app.json`
- `app.config.js`
- Expo plugins
- native modules
- Android/iOS configuration
- routing
- build settings

inspect the current configuration first.

Prefer config plugins and Expo configuration over manual generated-native edits.

If a native dependency/configuration changes, expect to rebuild the native development app.

### Generated native project

The latest shared codebase archive does **not** include an `android/` source directory. Treat any locally generated Android project as generated/build state rather than the primary repository architecture unless the user explicitly provides it as part of the source of truth.

---

# 22. DEVELOPMENT COMMANDS

From project root:

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
```

Equivalent direct native commands commonly used:

```bash
npx expo start
npx expo run:android
npx expo run:ios
```

### When to use what

**JS/UI-only change:**

```bash
npx expo start
```

**Native dependency/config/plugin change:**

```bash
npx expo run:android
```

or iOS equivalent.

Do not tell an agent to rebuild native code for every JSX/style change.

---

# 23. TESTING / VALIDATION

There is currently no project-owned Jest/Vitest test suite.

Use:

```bash
npx tsc --noEmit
npm run lint
```

For native behavior, test on a real device/emulator when appropriate.

Especially test:

- Maps
- Location permission
- Image picker
- Marker rendering
- Animations
- Blur/glass effects
- Native navigation behavior

Web is not an equivalent test environment for native functionality.

---

# 24. CURRENT KNOWN ISSUES / DEBUGGING NOTES

### Google Maps native-vs-Expo-Go distinction

A minimal standalone Expo test app rendered Google Maps successfully in Expo Go without a custom API key.

The Crave project has a custom `react-native-maps` plugin configuration through `app.config.js` for native Android API-key injection.

If Crave's native build shows a blank/black map while the standalone Expo Go test works:

1. Verify the exact current `MapView` provider configuration.
2. Verify resolved Expo config.
3. Verify generated native configuration after prebuild/build.
4. Inspect native logs.
5. Do not immediately change unrelated map props, styles, markers, or application architecture.

### Do not infer from historical snippets

Previous versions of Explore used different combinations of:

- `PROVIDER_GOOGLE`
- `customMapStyle`
- region initialization
- marker loading delays

The current file is authoritative.

---

# 25. COMMON PITFALLS

### Do not

- Assume SDK 54 is still active.
- Assume the old `ExploreScreen.tsx` exists.
- Assume Google Maps is currently forced on iOS.
- Assume `customMapStyle` is currently enabled.
- Assume challenge posts are persisted.
- Assume the mock DB is persistent.
- Assume PostContent's VIDEO type means video upload is implemented.
- Put API keys/secrets into source files or documentation.
- Add a second current-user system.
- Bypass repositories when an appropriate repository exists.
- Add realtime to every social action.
- Rewrite working screens because an older version looked different.
- Modify generated native files without first checking whether Expo config can produce the required result.

---

# 26. SAFE CHANGE WORKFLOW FOR AI AGENTS

For a normal coding request:

```text
1. Read AGENTS.md
       ↓
2. Identify exact target files
       ↓
3. Inspect current implementation
       ↓
4. Search for existing reusable code
       ↓
5. Make the smallest change
       ↓
6. Type-check / lint when appropriate
       ↓
7. Report exactly what changed
```

For architecture/backend requests:

```text
1. Inspect current models
2. Inspect repository contracts
3. Inspect mock implementations
4. Identify affected UI
5. Change boundaries deliberately
6. Keep mock implementation working unless migration is explicitly requested
```

For native/Expo requests:

```text
1. Inspect package.json
2. Inspect app.json
3. Inspect app.config.js
4. Check whether the feature requires native code
5. Prefer Expo config/plugin changes
6. Rebuild only when native configuration actually changed
```

---

# 27. NON-NEGOTIABLE CONSTRAINTS

- Do not replace the mock data layer with ad-hoc screen fixtures.
- Do not introduce a production backend unless explicitly requested.
- Do not introduce authentication unless explicitly requested.
- Do not add video upload infrastructure unless explicitly requested.
- Do not add unnecessary realtime.
- Do not add dependencies without justification.
- Do not upgrade core framework versions casually.
- Do not redesign UI unless requested.
- Do not rewrite working architecture unnecessarily.
- Do not remove repository abstractions for direct backend calls.
- Do not expose secrets.
- Do not invent functionality that is only described as future/planned.
- Do not silently change behavior outside the requested scope.

---

# 28. QUICK CONTEXT — READ THIS IF TOKEN BUDGET IS LIMITED

```text
APP: Crave — location-based social discovery

STACK:
Expo 57 / React 19.2.3 / RN 0.86.3 / TS 6 / Expo Router 57 / RN Maps 1.27.2

CURRENT BACKEND:
In-memory mock DB + repository layer. No production auth/API/storage yet.

MAIN SCREEN:
app/(tabs)/explore.tsx
Map + device location + image markers + search + post modal + long-press focus + drawer.

DATA:
data/mock/db.ts + data/mock/seed.ts
Repositories in data/repositories/
Current mock user: user-1

IMPORTANT UI:
Profile has fixed hero image + scroll blur/glass + badges.
Leaderboard lives in components/Leaderboard.tsx.
Challenge creates a local post object but currently only logs it.

MAP:
react-native-maps 1.27.2.
Current Explore has Google provider commented out and custom map style commented out.
Check current source before changing provider/style.

NATIVE GOOGLE CONFIG:
app.config.js uses react-native-maps plugin + GOOGLE_MAPS_API_KEY.
Never expose the key.
Standalone clean Expo Go map test works without custom API key.

BACKEND PLAN:
Supabase for DB/Auth/Realtime; Cloudflare R2 for media.
Repositories should remain the boundary.

STYLE:
Do not redesign unless asked. Reuse existing components/styles/patterns.

WORK STYLE:
Inspect → reuse → minimal change → validate → concise report.
```

## Repository Inspection

Do not recursively inspect the entire repository by default.

Ignore generated, dependency, build, cache, and environment directories/files unless the task specifically requires them.

Common exclusions:

- node_modules/
- .git/
- .expo/
- android/.gradle/
- android/build/
- android/app/build/
- ios/Pods/
- ios/build/
- dist/
- build/
- coverage/
- .next/
- .turbo/
- \*.lock
- .env\*
- generated files

Prefer inspecting:

- source files
- configuration files
- package manifests
- database/migration files
- relevant documentation
- files directly related to the requested task

Start narrow and expand inspection only when necessary.
