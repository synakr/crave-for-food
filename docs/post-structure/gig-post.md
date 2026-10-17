# Gig Post — Database Structure

## Example Post

**Post type:** `GIG`

### 1. `posts`

```yaml
id: post-uuid-004
author_id: user-uuid-101
latitude: 23.8315
longitude: 91.2868
post_type: GIG
view_count: 0
like_count: 0
comment_count: 0
expires_at: null
created_at: 2026-10-11T10:15:00Z
updated_at: 2026-10-11T10:15:00Z
metadata:
  links:
    - url: "https://example.com/apply"
      title: "Apply for this gig"
  locations:
    - name: "NIT Agartala"
      address: "NIT Agartala Campus"
      latitude: 23.8315
      longitude: 91.2868
```

### 2. `post_contents`

**Row 1 — Gig details**

```yaml
id: content-uuid-007
post_id: post-uuid-004
type: TEXT
text_content: null
storage_key: null
metadata:
  title: "Freelance Graphic Designer Needed"
  description: "Looking for a designer to create posters for our college tech fest."
  gig_type: "FREELANCE"
  contact: "organizer@example.com"
content_order: 0
created_at: 2026-10-11T10:15:00Z
```

**Row 2 — Gig image (optional)**

```yaml
id: content-uuid-008
post_id: post-uuid-004
type: IMAGE
text_content: null
storage_key: "posts/post-uuid-004/gig-poster.jpg"
metadata: null
content_order: 1
created_at: 2026-10-11T10:15:00Z
```

## Relationship

```text
posts
  ├── metadata.links       (optional links)
  ├── metadata.locations   (optional additional locations)
  └── post_contents
        ├── TEXT           (gig details)
        └── IMAGE          (gig poster, optional)
```

## Rules

- `posts.id` identifies the gig post.
- `posts.latitude` and `posts.longitude` define the main map-marker location.
- `posts.metadata` stores optional links and additional locations as JSONB.
- `post_contents.metadata` stores gig-specific details.
- `post_contents.post_id` references `posts.id`.
- `content_order` determines the display order of content items.
- `storage_key` stores the image's object-storage path.
- `GIG` is the post type; `TEXT` and `IMAGE` are content types.

**Database requirement:** `posts.metadata` must be a PostgreSQL `JSONB` column.

**Note:** UUIDs, timestamps, URLs, and coordinates are illustrative.
