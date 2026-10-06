# Profile Feature

## Purpose
Provide the user's profile, identity, stats, badges and post-oriented profile experience.

## Current Route
`app/(tabs)/profile.tsx`

## Related Code
- `components/Badge.tsx`
- `constants/currentUser.ts`
- `data/mock/db.ts`
- `data/models/User.ts`

## Current State
The profile screen is implemented as a rich custom UI. It includes a hero/profile presentation, identity and stats, badges, and profile content. The screen currently reads the mock database/current-user context rather than a production user service.

## UI Constraints
- Preserve the existing premium/light visual language unless a redesign is explicitly requested.
- Avoid replacing the existing profile composition with generic social-profile UI.
- Reuse the existing `Badge` component and current-user helper when applicable.

## Data Constraint
The profile is currently mock/in-memory backed. Do not imply that edits or profile state are persisted remotely.
