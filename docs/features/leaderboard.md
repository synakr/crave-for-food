# Leaderboard Feature

## Purpose
Display Crave ranking/leaderboard UI and provide navigation from the app.

## Current Route
`app/leaderboard.tsx`

## Related Code
- `components/Leaderboard.tsx`
- `app/(tabs)/profile.tsx` and other navigation callers as applicable
- `data/mock/db.ts` when data is sourced from demo state

## Current State
Leaderboard presentation exists as a dedicated route/component. The current implementation is part of the MVP UI and should be treated as mock/demo-driven unless the target code explicitly shows a persistent source.

## UI Constraints
Maintain the existing compact, single-screen-oriented visual composition when making UI changes. Do not introduce a new ranking/data architecture just to alter presentation.
