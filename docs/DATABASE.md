# Crave — Data Reference

> This document describes the current **model/mock database**, not a live production schema.

## Current Store
`data/mock/db.ts` exposes these collections:

| Collection | Model | Purpose |
|---|---|---|
| `users` | `User` | User profiles |
| `places` | `Place` | Discoverable geographic places |
| `posts` | `Post` | User-created posts |
| `post_contents` | `PostContent` | Ordered post media/content |
| `likes` | `Like` | Post likes |
| `comments` | `Comment` | Comments and replies |
| `follows` | `Follow` | User relationships |
| `follow_requests` | `FollowRequest` | Pending/managed follow requests |
| `mentions` | `Mention` | User mentions |
| `map_promotions` | `MapPromotion` | Map promotion data |
| `user_locations` | `UserLocation` | User location/sharing state |
| `saved` | `Saved` | Saved posts |

## Key Relationships
- `Post.author_id` → `User.id`
- `Post.place_id` → `Place.id` (optional)
- `PostContent.post_id` → `Post.id`
- `Like.post_id` → `Post.id`
- `Like.user_id` → `User.id`
- `Comment.post_id` → `Post.id`
- `Comment.user_id` → `User.id`
- `Comment.parent_comment_id` → `Comment.id` (nullable; enables replies)
- `Follow.follower_id` / `Follow.following_id` → `User.id`
- `FollowRequest.requester_id` / `target_user_id` → `User.id`
- `Saved.post_id` → `Post.id`
- `Saved.user_id` → `User.id`
- `UserLocation.user_id` → `User.id`

## Repository Rules
Use repository interfaces for feature data access:
- `PostRepository`
- `CommentRepository`
- `LikeRepository`
- `SavedRepository`

The current repository implementations mutate/read the in-memory `db` directly.

## Post Content
`PostContent` supports typed content records. Explore currently selects the `IMAGE` content associated with a post and uses its `storage_key` as the image URI in the mock implementation.

## Seed Data
`data/mock/seed.ts` is the source of demo data used by the active MVP. Do not mistake seeded records for real user/backend data.

## Backend Status
No active production Supabase integration is present in the current codebase. Do not write documentation that assumes live Supabase tables, policies, storage buckets or auth are already wired into the app.
