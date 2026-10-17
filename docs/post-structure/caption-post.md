# Caption Post — Database Structure

## Example Post

**Post type:** `CAPTION`

### 1. `posts`

```yaml
id: post-uuid-001
author_id: user-uuid-101
latitude: 23.8315
longitude: 91.2868
post_type: CAPTION
view_count: 0
like_count: 0
comment_count: 0
expires_at: null
created_at: 2026-10-11T10:00:00Z
updated_at: 2026-10-11T10:00:00Z
metadata:
  links:
    - url: "https://example.com"
      title: "Related resource"
  locations:
    - name: "Central Library"
      address: "Agartala, Tripura"
      latitude: 23.8400
      longitude: 91.2750
    - name: "New Library"
      address: "Agartala, Tripura"
      latitude: 23.9130
      longitude: 91.2750
```

### 2. `post_contents`

**Row 1 — Caption text**

```yaml
id: content-uuid-001
post_id: post-uuid-001
type: TEXT
text_content: "Finally explored this beautiful campus!"
storage_key: null
metadata: null
content_order: 0
created_at: 2026-10-11T10:00:00Z
```

## Relationship

```text
posts
  └── post_contents
        └── TEXT (caption text)
```

## Rules

- `posts.id` identifies the caption post.
- `posts.latitude` and `posts.longitude` define the main map-marker location.
- `posts.metadata.links` stores optional attached links.
- `posts.metadata.locations` stores optional additional locations.
- `post_contents.text_content` stores the actual caption.
- `post_contents.post_id` references `posts.id`.
- `CAPTION` is the post type; `TEXT` is the content type.

**Database requirement:** `posts.metadata` must be a PostgreSQL `JSONB` column.

**Note:** UUIDs, timestamps, URLs, and coordinates are illustrative.
