# Crave — Architectural Decisions

## Decision: Keep Crave General-Purpose
**Decision:** Crave is a location-based social discovery platform, not a permanently food-only architecture.

**Reason:** Food is the current product direction, but future modes such as travel and other location-based discovery should remain possible.

**Consequences:** Avoid naming core models, repositories and infrastructure around food when the concept is broader.

## Decision: Repository Boundary Before Backend Integration
**Decision:** UI-facing data access uses repository interfaces, with mock implementations active today.

**Reason:** The MVP can iterate without a backend while preserving a replaceable data layer.

**Consequences:** New data-backed features should normally add/use a repository contract rather than reaching directly into a database implementation.

## Decision: Mock Database for Current MVP
**Decision:** The current active data source is the in-memory database in `data/mock/db.ts`, populated by `data/mock/seed.ts`.

**Reason:** Fast UI/interaction development without requiring production infrastructure.

**Consequences:** Data is not persistent and must not be treated as production storage.

## Decision: Expo Router
**Decision:** Navigation is built with Expo Router using a root stack and tab navigator with a custom floating tab bar.

**Reason:** It matches the current Expo architecture and keeps routes file-based.

**Consequences:** New screens should normally follow the existing `app/` route structure rather than introducing another navigation system.

## Decision: Maps via react-native-maps
**Decision:** Crave uses `react-native-maps` as the map abstraction.

**Reason:** Current needs are map rendering, location, pan/zoom and Crave-specific markers; a heavier map platform is not required at this stage.

**Consequences:** Platform-specific provider behavior must be respected. Native Google Maps configuration belongs in Expo/native configuration, not in arbitrary JS secrets.

## Decision: Progressive AI Context
**Decision:** Project context is split between concise core Markdown files and task-specific docs.

**Reason:** Agents should spend tokens on the current task instead of loading the whole project history.

**Consequences:** `AGENTS.md` contains behavior rules; `PROJECT.md` contains the compact system overview; deeper architecture/data/feature details live in `docs/`.
