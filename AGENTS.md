# Crave Agent Guide

## Project Overview

Crave is an experimental location-based food discovery app. It organizes food posts around places on an interactive map rather than around a conventional social feed. The current app is an Expo/React Native MVP backed by in-memory mock data; it does not yet have authentication, a server API, persistence, or image storage.

## Tech Stack

- Expo SDK 54 (`expo` `~54.0.37`) with Expo Router (`~6.0.23`)
- React 19.1, React Native 0.81.5, TypeScript 5.9
- React Native Maps 1.20.1 with the Google provider
- Reanimated 4, Gesture Handler, Safe Area Context
- Expo Location for permissions, current position, and geocoding
- Expo Image Picker for local gallery selection
- Expo Blur and `@expo/vector-icons`/Ionicons for UI
- Hermes and the React Native New Architecture are enabled on Android

## Repository Structure

```text
app/                    Expo Router routes and screen entry points
	_layout.tsx           Root Stack configuration
	index.tsx             Redirect to the Explore tab
	create-post.tsx       Local image/text post composer
	(tabs)/               Explore, Saved, Activity, and Profile routes
components/             Reusable UI, map interactions, tab bar, and post modals
	PostModal/            Post detail and post action components
constants/              Current user and map style constants
data/models/            Domain interfaces for posts, users, places, and interactions
data/repositories/      Repository interfaces and mock implementations
data/mock/              Mutable mock database and seed data
assets/                 App icon and splash image
android/                Generated/native Android project
backup-code/            Older code kept for reference, not active flow
```

`README.md` is partly stale: it refers to `src/screens/ExploreScreen.tsx`, which is not present. Use the route and component tree above as the source of truth.

## Architecture and Important Layers

- Expo Router discovers routes from `app/`. The root Stack hides headers and uses a fade transition. The `(tabs)` group supplies a custom `FloatingTabBar` instead of the default tab bar.
- `app/(tabs)/explore.tsx` is the primary screen. It loads mock posts, requests location, renders the map and image markers, and opens post/focus overlays.
- UI behavior is mostly screen-local state. There is no Context, Redux, Zustand, global store, or server state library.
- Domain models in `data/models/` describe the intended data shape. Repository interfaces in `data/repositories/` are the seam for a future backend, but all current implementations read and mutate the mock database.
- `components/PostModal/` is the most complete interaction surface: likes, saves, comments, author/location details, captions, and modal presentation.

## Data Flow and Persistence

`data/mock/db.ts` exports a mutable singleton containing users, places, posts, post contents, likes, comments, follows, saved records, and other collections. `seedMockDatabase()` populates the demo users/places/posts/content and is called when Explore mounts. `postRepository.getExplorePosts()` joins posts to their author, place, and IMAGE content and returns the `ExplorePost` view shape used by the map.

Like, save, and comment repositories mutate the singleton directly. `constants/currentUser.ts` fixes the current user to `user-1`. There is no API client, database adapter, authentication, upload service, or persistence across app restarts. Post creation is incomplete: image selection remains local to the composer, and text submission only logs to the console.

## UI and Coding Conventions

- Use TypeScript with strict mode and the `@/*` path alias; typed Expo Router routes and the React Compiler experiment are enabled.
- Follow the existing local style: functional components, React hooks, double-quoted imports/strings in most source files, and `StyleSheet.create` for component styles.
- Keep styles colocated with components. There is no shared theme or design-token layer.
- Existing UI uses Ionicons, BlurView, rounded surfaces, shadows/elevation, absolute overlays, and animated modal transitions. Explore has a cream/pink map treatment and translucent floating controls; other tabs have their own dark treatments, while Create Post uses a light white/gray surface.
- Preserve the existing route names and repository interfaces when extending behavior. Prefer the mock repository layer over direct `db` access for post/like/save/comment operations unless matching an existing screen pattern such as Profile.

## Development Commands

Run from the repository root:

```bash
npm install
npm run start          # Start the Expo development server
npm run android        # Build/run the native Android app
npm run ios            # Build/run the native iOS app
npm run web            # Start Expo for web
npm run lint           # Run Expo's ESLint configuration
```

`npm run reset-project` points to `scripts/reset-project.js`, but no `scripts/` directory currently exists, so do not rely on that command without first restoring the script. `npx tsc --noEmit` is the direct TypeScript type-check command; there is no dedicated `typecheck` script.

## Testing, Linting, and Builds

- There is no project-owned test suite, test script, Jest/Vitest configuration, or test file.
- The configured lint command is `npm run lint` (`expo lint`).
- TypeScript is checked with `npx tsc --noEmit`.
- Native Android builds use the checked-in Gradle wrapper (`android/gradlew` or `android/gradlew.bat`) and Gradle 8.14.3; Expo's `npm run android` is the normal developer entry point.
- Validate map, location permission, image picker, and marker rendering on a device/emulator; web does not provide equivalent native behavior.

## Constraints and Do Not Change Casually

- This project targets Expo SDK 54. Read the versioned Expo 54 documentation before changing Expo configuration, native modules, routing, or build behavior.
- Do not replace the mock data layer with ad hoc screen-local fixtures. Keep model/repository contracts coherent while the backend is absent.
- Do not assume `seedMockDatabase()` is harmless: it resets posts, likes, comments, follows, and related collections whenever Explore mounts. `db.saved` is not reset, so reset behavior is intentionally inconsistent today.
- Do not add a production backend, auth, upload flow, expiry behavior, or location selection and assume it is already supported by the UI; those are planned/incomplete areas.
- Avoid casual edits to generated/native Android files. Changes there can be overwritten by Expo prebuild and may require matching Expo SDK 54 configuration.
- Android release builds currently use the debug signing configuration, and release minification is disabled by default. Treat this as development-only until explicitly hardened.

## Common Pitfalls

- Saved and Profile can appear empty if opened before Explore has seeded the in-memory database.
- The floating tab bar's plus action selects an image and passes `uploadedImage`/`uploadId` route parameters, but Explore currently ignores those parameters; the selected image is discarded.
- Explore falls back to coordinates around `23.5335, 91.4845` when location permission fails. Search uses platform geocoding and logs failures rather than showing an in-app error state.
- Google map rendering depends on native/provider configuration; no Google Maps API key is visible in `app.json`.
- Marker image rendering uses `tracksViewChanges` and a delayed Android state update. Preserve that behavior when changing marker components.
- `getExplorePosts()` does not filter `expires_at`, sort posts, validate missing images, or prevent empty marker image URIs.
- Category chips, several profile controls/tabs, and some menu/filter affordances are visual placeholders rather than implemented behavior.
- `components/DemoPopup.tsx`, `data/FoodPost.ts`, `backup-code/PostModal.tsx`, and `constants/mapStyle.ts` appear to be legacy/reference material, not part of the active flow.
