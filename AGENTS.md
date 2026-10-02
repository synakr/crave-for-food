# Crave Agent Guide

## Project Overview

Crave is a location-based social discovery app. Food is the current primary use case, while the architecture is intended to support broader discovery modes in the future.

The current app is an Expo/React Native MVP backed by in-memory mock data. It does not yet have authentication, a server API, persistent storage, or production image storage.

The current development priority is Android, while keeping the architecture compatible with iOS and potentially web in the future.

---

## Tech Stack

- Expo SDK 54 (`expo` `~54.0.37`) with Expo Router (`~6.0.23`)
- React 19.1
- React Native 0.81.5
- TypeScript 5.9
- React Native Maps 1.20.1 with the Google provider
- Reanimated 4
- Gesture Handler
- Safe Area Context
- Expo Location for permissions, current position, and geocoding
- Expo Image Picker for local gallery selection
- Expo Blur
- `@expo/vector-icons` / Ionicons
- Hermes
- React Native New Architecture enabled on Android

---

## Repository Structure

```text
app/                         Expo Router routes and screen entry points
    _layout.tsx              Root Stack configuration
    index.tsx                Redirect to the Explore tab
    create-post.tsx          Local image/text post composer
    (tabs)/                  Explore, Saved, Activity, and Profile routes

components/                  Reusable UI, map interactions, tab bar, and post modals
    PostModal/               Post detail and post action components

constants/                   Current user and map style constants

data/models/                 Domain interfaces for posts, users, places, and interactions

data/repositories/           Repository interfaces and mock implementations

data/mock/                   Mutable mock database and seed data

assets/                      App icon and splash image

android/                     Generated/native Android project

backup-code/                 Older code kept for reference, not active flow
```

`README.md` is partly stale and refers to `src/screens/ExploreScreen.tsx`, which is not present.

Use the actual route and component tree above as the source of truth.

---

## Architecture

The current architecture is:

```text
UI
 ↓
Screens / Components
 ↓
Repositories
 ↓
Mock Database
```

The long-term target architecture is:

```text
UI
 ↓
Features / Domain
 ↓
Services
 ↓
Repositories
 ↓
Backend / Providers
```

Keep infrastructure replaceable where practical.

The UI should not become tightly coupled to:

- Supabase
- Google Maps
- Cloudflare R2
- Specific API implementations

---

## Target Production Architecture

```text
                    CRAVE APP
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
       UI          Features        Navigation
        │              │
        └───────┬──────┘
                ▼
        Domain / Services
                │
                ▼
          Repositories
                │
        ┌───────┴────────┐
        ▼                ▼
     Supabase         Providers
        │                │
   ┌────┼────┐      ┌────┼─────────┐
   │    │    │      │    │         │
  DB   Auth Realtime Map Storage Analytics
                     │
                  Google Maps
                     │
                 Cloudflare R2
```

### Planned infrastructure

**Supabase**
- PostgreSQL
- Authentication
- Realtime
- Edge Functions when genuinely required

**Cloudflare**
- R2 for image/media storage
- CDN/cache for media delivery

**Google Maps**
- Current map provider
- Keep map-specific logic isolated so another provider can be introduced later

The repository/service/provider boundaries should allow infrastructure to change without requiring large rewrites of screens and features.

---

## Current MVP Product Rules

### Content

- Photo posts only.
- Video uploads are NOT supported.
- Images should be compressed before production upload.
- Users normally do not manually select a location.
- Device GPS should automatically provide the post location when permission is available.
- If GPS is unavailable, a manual location fallback may be introduced.
- Production media storage is planned for Cloudflare R2.

### Social Activity

Initially, these do NOT require realtime:

- Likes
- Comments
- Follows
- Notifications
- General feed updates

Normal API/database requests are sufficient.

Users can see updated social activity after refreshing/reloading.

### Map Realtime

Realtime is initially reserved for new posts appearing on the map.

```text
User creates post
      ↓
Backend / database
      ↓
Realtime event
      ↓
Nearby users
      ↓
New map marker
```

Do not add realtime connections for every social interaction unless explicitly requested.

---

## Current Data Flow

`data/mock/db.ts` exports a mutable singleton containing:

- Users
- Places
- Posts
- Post contents
- Likes
- Comments
- Follows
- Saved records
- Other collections

`seedMockDatabase()` populates demo users, places, posts, and content.

`postRepository.getExplorePosts()` joins posts to their author, place, and IMAGE content and returns the `ExplorePost` view shape used by the map.

Like, save, and comment repositories mutate the singleton directly.

`constants/currentUser.ts` currently fixes the current user to `user-1`.

There is currently no:

- API client
- Database adapter
- Authentication
- Upload service
- Persistent storage across app restarts

---

## Mock Database Rules

The mock database is temporary infrastructure.

Do not treat it as the final backend architecture.

Keep mock models and repository contracts coherent with the intended production data model.

Do not replace repository operations with random screen-local fixtures.

The intended migration is:

```text
Current:

UI
 ↓
Repository
 ↓
Mock DB


Future:

UI
 ↓
Repository
 ↓
Supabase
```

The UI should require minimal changes when moving from the mock implementation to Supabase.

### Important Current Behavior

`seedMockDatabase()` resets:

- Posts
- Likes
- Comments
- Follows
- Related collections

whenever Explore mounts.

`db.saved` is not reset, so current reset behavior is intentionally inconsistent.

Do not silently change this behavior unless the task requires it.

---

## Current User

`constants/currentUser.ts` currently defines the active mock user.

Current mock user:

```text
user-1
```

This is temporary.

Do not introduce a second competing current-user mechanism without a clear architectural reason.

Future authentication should replace this with an authenticated user/session while preserving repository/service boundaries.

---

## UI and Coding Conventions

- Use TypeScript with strict mode.
- Use the `@/*` path alias.
- Typed Expo Router routes are enabled.
- React Compiler experiment is enabled.
- Prefer functional components and React hooks.
- Follow existing local coding style.
- Existing source generally uses double-quoted imports/strings.
- Use `StyleSheet.create` for component styles.
- Keep styles colocated with components.
- Do not introduce a shared theme/design-token system unless explicitly required.

Existing UI uses:

- Ionicons
- BlurView
- Rounded surfaces
- Shadows/elevation
- Absolute overlays
- Animated modal transitions

Explore currently has:

- Cream/pink map treatment
- Translucent floating controls
- Image-based map markers

Other tabs may use different visual treatments.

Create Post currently uses a light white/gray surface.

Preserve the existing visual language unless the task explicitly requests a redesign.

---

## Repository Rules

Prefer repository methods for:

- Posts
- Likes
- Saves
- Comments
- Follows
- Places
- Users

Avoid direct `db` access from UI components when a repository already exists.

When adding functionality:

1. Define/update the model if necessary.
2. Define/update the repository contract.
3. Implement mock repository behavior.
4. Connect the UI through the repository.
5. Keep the implementation compatible with the future backend.

Do not bypass an existing repository abstraction without a clear reason.

---

## Map Architecture

The current map provider is Google Maps through React Native Maps.

Keep map-specific functionality isolated.

Avoid spreading Google-specific APIs throughout unrelated screens.

Conceptually:

```text
CRAVE Map UI
     ↓
Map-specific abstraction/layer
     ↓
Google Maps
```

Future providers may include Mapbox, MapLibre, or another provider.

Do not build provider-specific assumptions into unrelated business logic.

Preserve existing marker behavior, including `tracksViewChanges` handling and delayed Android state updates, unless there is a clear reason to change it.

---

## Location Rules

Expo Location is currently used for:

- Permission requests
- Current device position
- Geocoding

The normal post creation flow should automatically associate a post with the user's current location when permission is available.

Location permission failure should not crash the app.

Current Explore behavior falls back to approximately:

```text
23.5335, 91.4845
```

when location permission fails.

Search currently uses platform geocoding and logs failures rather than presenting a complete in-app error state.

---

## Media Rules

Current MVP:

- Photos only.
- No video uploads.
- Compress images before production upload.
- Do not unnecessarily upload original high-resolution images.
- Prefer thumbnails/optimized versions for map/feed display.
- Production media storage is planned for Cloudflare R2.

Future media flow:

```text
User selects image
      ↓
Compress / optimize
      ↓
Upload to R2
      ↓
Store media reference in Supabase
      ↓
Display through CDN/cache
```

Do not introduce video infrastructure unless explicitly requested.

---

## Realtime Rules

Use realtime selectively.

### Initially realtime

- New posts appearing on the map

### Initially NOT realtime

- Likes
- Comments
- Follows
- Notifications
- General feed refreshes

Normal API/database requests are sufficient for those interactions initially.

Do not add persistent realtime subscriptions merely for convenience.

---

## Backend Direction

Planned production backend:

```text
React Native
      ↓
Repositories / Services
      ↓
Supabase
      ├── PostgreSQL
      ├── Auth
      ├── Realtime
      └── Edge Functions
```

Cloudflare R2 is planned for media storage.

Edge Functions should be introduced only when backend-side logic is genuinely needed, such as:

- Secure business logic
- Webhooks
- Third-party API calls requiring secret keys
- Complex server-side operations
- Operations that should not be trusted to the client

Do not move simple CRUD operations into Edge Functions unnecessarily.

---

## Development Commands

Run from the repository root:

```bash
npm install

npm run start       # Start Expo development server

npm run android     # Build/run native Android app

npm run ios         # Build/run native iOS app

npm run web         # Start Expo for web

npm run lint        # Run Expo ESLint configuration

npx tsc --noEmit    # TypeScript type check
```

`npm run reset-project` points to `scripts/reset-project.js`, but no `scripts/` directory currently exists.

Do not rely on that command unless the script has been restored.

---

## Testing, Linting, and Builds

There is currently no project-owned:

- Test suite
- Test script
- Jest configuration
- Vitest configuration
- Test files

TypeScript:

```bash
npx tsc --noEmit
```

Lint:

```bash
npm run lint
```

Native Android builds use:

```text
android/gradlew
android/gradlew.bat
```

Current Gradle version:

```text
8.14.3
```

`npm run android` is the normal developer entry point.

Validate native functionality on a real device/emulator where appropriate, especially:

- Maps
- Location permissions
- Image picker
- Marker rendering
- Native animations

Web does not provide equivalent native behavior.

---

## Expo / Native Rules

This project targets Expo SDK 54.

Before changing:

- Expo configuration
- Native modules
- Expo plugins
- Routing
- Build configuration

inspect the existing configuration and use the appropriate Expo SDK 54 documentation.

Avoid casual edits to generated/native Android files.

Native changes can be overwritten by Expo prebuild and may require matching Expo SDK 54 configuration.

Current Android release configuration is development-only:

- Release builds currently use the debug signing configuration.
- Release minification is disabled by default.

Do not treat the current release configuration as production-ready without explicitly hardening it.

---

## Constraints and Do Not Change Casually

- Do not replace the mock data layer with ad hoc screen-local fixtures.
- Do not introduce a production backend unless explicitly requested.
- Do not add authentication unless explicitly requested.
- Do not add video upload infrastructure.
- Do not add unnecessary realtime functionality.
- Do not introduce new dependencies unless necessary.
- Do not rewrite working architecture unnecessarily.
- Do not redesign existing UI unless requested.
- Do not modify native Android configuration casually.
- Do not change route names unnecessarily.
- Do not remove repository abstractions in favor of direct backend calls.
- Do not assume planned functionality already exists.
- Do not silently implement future features simply because they are described in this document.

---

## Common Pitfalls

### Data / State

- Saved and Profile can appear empty if opened before Explore has seeded the in-memory database.
- `seedMockDatabase()` resets several collections whenever Explore mounts.
- `db.saved` is not reset.
- Current data does not persist across app restarts.

### Create Post

The floating tab bar's plus action currently:

1. Selects an image.
2. Passes `uploadedImage` / `uploadId` route parameters.

Explore currently ignores those parameters, so the selected image can be discarded.

Post creation is currently incomplete.

Text submission currently only logs to the console.

### Map

- Google map rendering depends on native/provider configuration.
- No Google Maps API key is currently visible in `app.json`.
- Marker image rendering uses `tracksViewChanges` and delayed Android state updates.
- Preserve this behavior when modifying marker components.
- `getExplorePosts()` currently does not filter `expires_at`.
- `getExplorePosts()` does not currently sort posts.
- Missing image validation is incomplete.
- Empty marker image URIs can occur.

### Search / Location

- Search uses platform geocoding.
- Geocoding failures are currently logged rather than shown through a complete error UI.
- Explore uses a fallback location if permission fails.

### UI Placeholders

The following may currently be visual placeholders or incomplete:

- Category chips
- Some profile controls
- Some profile tabs
- Some menu/filter affordances
- Some activity functionality

Do not assume visual presence means backend functionality exists.

### Legacy Files

These appear to be legacy/reference material rather than active flow:

```text
components/DemoPopup.tsx
data/FoodPost.ts
backup-code/PostModal.tsx
constants/mapStyle.ts
```

Do not modify legacy files unless the task explicitly concerns them.

---

## Agent Rules

### Before Making Changes

1. Read this `AGENTS.md`.
2. Inspect the relevant existing files.
3. Understand the current implementation before introducing new code.
4. Check whether an existing repository, component, hook, or utility already solves the problem.

### While Making Changes

- Prefer the smallest clean change that solves the task.
- Preserve working architecture.
- Prefer existing patterns over introducing new patterns.
- Avoid unnecessary dependencies.
- Avoid unnecessary refactors.
- Keep repository/model contracts coherent.
- Keep business logic out of UI components where practical.
- Do not introduce production infrastructure unless explicitly requested.
- Do not implement planned/incomplete features unless explicitly requested.
- Preserve Android behavior when modifying native-sensitive components.
- Do not make unrelated changes while solving a task.

### After Making Changes

When practical:

```bash
npx tsc --noEmit
npm run lint
```

If a change affects native functionality, validate it on Android/device where possible.

If architecture, folder structure, product rules, or major behavior materially changes, update this `AGENTS.md`.

---

## Decision-Making Principles

When multiple implementations are possible:

1. Prefer the simplest solution that fits the current MVP.
2. Prefer patterns that make future Supabase migration easier.
3. Prefer abstractions at infrastructure boundaries, not unnecessary abstractions everywhere.
4. Avoid premature scaling.
5. Avoid premature realtime.
6. Avoid premature backend complexity.
7. Preserve the ability to replace infrastructure providers later.
8. Favor maintainability over cleverness.
9. Do not sacrifice the current working UX for hypothetical future requirements.
10. Prefer incremental changes over large rewrites.

---

## Current Product Direction

The MVP is intentionally constrained.

Current priority:

```text
Reliable core experience
        ↓
Map-based discovery
        ↓
Photo posting
        ↓
Social interactions
        ↓
Real user adoption
        ↓
Production backend
        ↓
Scale based on actual usage
```

Do not prematurely optimize for large-scale infrastructure.

The architecture should be scalable enough to evolve, while the implementation should remain appropriately simple for the current MVP stage.

## Current Database Schema

The production database is designed around the following core tables and relationships.

### Core Tables

- `users`
  - Primary key: `id`
  - Unique: `username`

- `places`
  - Primary key: `id`

- `posts`
  - Primary key: `id`
  - `author_id` → `users.id`
  - `place_id` → `places.id`

- `post_contents`
  - Primary key: `id`
  - `post_id` → `posts.id`

- `comments`
  - Primary key: `id`
  - `post_id` → `posts.id`
  - `user_id` → `users.id`
  - `parent_comment_id` → `comments.id`
  - `parent_comment_id` is used for nested/reply comments

### Social Tables

- `likes`
  - `user_id` → `users.id`
  - `post_id` → `posts.id`
  - Represents a user liking a post

- `follows`
  - `follower_id` → `users.id`
  - `following_id` → `users.id`
  - Represents a user following another user

- `follow_requests`
  - `requester_id` → `users.id`
  - `target_user_id` → `users.id`
  - Represents a follow request

- `mentions`
  - `user_id` → `users.id`
  - `post_id` → `posts.id`
  - Represents a user mentioned in a post

### Location / Map Tables

- `user_locations`
  - Primary key: `user_id`
  - `user_id` → `users.id`

- `map_promotions`
  - Primary key: `id`
  - `place_id` → `places.id`

### Important Relationships

```text
users
 ├── posts ──────────────→ places
 │     └── post_contents
 │
 ├── comments ───────────→ posts
 │     └── parent_comment_id → comments
 │
 ├── likes ───────────────→ posts
 │
 ├── follows ─────────────→ users
 │
 ├── follow_requests ─────→ users
 │
 ├── mentions ────────────→ posts
 │
 └── user_locations

places
 ├── posts
 └── map_promotions