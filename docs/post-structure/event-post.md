# Event Post — Database Structure

## Example Post

**Post type:** `EVENT`

### 1. `posts`

```yaml
id: post-uuid-003
author_id: user-uuid-101
latitude: 23.8315
longitude: 91.2868
post_type: EVENT
view_count: 0
like_count: 0
comment_count: 0
expires_at: null
created_at: 2026-10-11T10:10:00Z
updated_at: 2026-10-11T10:10:00Z
metadata:
  links:
    - url: "https://example.com/register"
      title: "Register for the event"
  locations:
    - name: "Main Auditorium"
      address: "NIT Agartala Campus"
      latitude: 23.8315
      longitude: 91.2868
    - name: "Workshop Hall"
      address: "NIT Agartala Campus"
      latitude: 23.8320
      longitude: 91.2872
```

### 2. `post_contents`

**Row 1 — Event details**

```yaml
id: content-uuid-005
post_id: post-uuid-003
type: TEXT
text_content: null
storage_key: null
metadata:
  title: "NIT Agartala Tech Fest"
  description: "Join us for a day of technology, innovation, and fun."
  category: "TECHNICAL"
  date: "2026-10-20"
  start_time: "10:00"
  end_time: "17:00"
  audience: "PUBLIC"
content_order: 0
created_at: 2026-10-11T10:10:00Z
```

**Row 2 — Event poster (optional)**

```yaml
id: content-uuid-006
post_id: post-uuid-003
type: IMAGE
text_content: null
storage_key: "posts/post-uuid-003/event-poster.jpg"
metadata: null
content_order: 1
created_at: 2026-10-11T10:10:00Z
```

## Relationship

```text
posts
  └── post_contents
        ├── TEXT  (event details)
        └── IMAGE (event poster, optional)
```

## Rules

- `posts.id` identifies the event post.
- `posts.latitude` and `posts.longitude` define the main map-marker location.
- `posts.metadata.links` stores optional links attached to the event.
- `posts.metadata.locations` stores optional additional locations.
- `post_contents.post_id` references `posts.id`.
- `post_contents.metadata` stores event-specific details.
- `content_order` determines the display order of content items.
- `storage_key` stores the poster's object-storage path.
- `EVENT` is the post type; `TEXT` and `IMAGE` are content types.

**Database requirement:** `posts.metadata` must be a PostgreSQL `JSONB` column to store the links and locations shown above.

**Note:** UUIDs, timestamps, URLs, and coordinates are illustrative.

## Future addition:

- soothening bgm
- dynamuc background designs
- show anonymous interest; you are added but your name is not shown in the interested list
