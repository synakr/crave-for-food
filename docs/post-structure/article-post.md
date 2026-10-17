# Article Post — Database Structure

## Example Post

**Post type:** `ARTICLE`

### 1. `posts`

```yaml
id: post-uuid-002
author_id: user-uuid-101
latitude: 23.8315
longitude: 91.2868
post_type: ARTICLE
view_count: 0
like_count: 0
comment_count: 0
expires_at: null
created_at: 2026-10-11T10:05:00Z
updated_at: 2026-10-11T10:05:00Z
metadata:
  links:
    - url: "https://example.com/travel-guide"
      title: "Read the full travel guide"
  locations:
    - name: "Ujjayanta Palace"
      address: "Agartala, Tripura"
      latitude: 23.8350
      longitude: 91.2794
```

### 2. `post_contents`

**Row 1 — Article text**

```yaml
id: content-uuid-002
post_id: post-uuid-002
type: TEXT
text_content: null
storage_key: null
metadata:
  title: "A Guide to Exploring Agartala"
  body: "Agartala offers a rich mix of history, culture, and beautiful places to explore."
  article_type: "TRAVEL"
content_order: 0
created_at: 2026-10-11T10:05:00Z
```

**Row 2 — First image (optional)**

```yaml
id: content-uuid-003
post_id: post-uuid-002
type: IMAGE
text_content: null
storage_key: "posts/post-uuid-002/image-1.jpg"
metadata: null
content_order: 1
created_at: 2026-10-11T10:05:00Z
```

**Row 3 — Second image (optional)**

```yaml
id: content-uuid-004
post_id: post-uuid-002
type: IMAGE
text_content: null
storage_key: "posts/post-uuid-002/image-2.jpg"
metadata: null
content_order: 2
created_at: 2026-10-11T10:05:00Z
```

## Relationship

```text
posts
  └── post_contents
        ├── TEXT  (article title, body, and category)
        ├── IMAGE (first image, optional)
        └── IMAGE (second image, optional)
```

## Rules

- `posts.id` identifies the article post.
- `posts.latitude` and `posts.longitude` define the main map-marker location.
- `posts.metadata.links` stores optional attached links.
- `posts.metadata.locations` stores optional additional locations.
- `post_contents.metadata` stores article-specific fields.
- `post_contents.post_id` references `posts.id`.
- `content_order` determines the display order of content items.
- `storage_key` stores the image's object-storage path.
- `ARTICLE` is the post type; `TEXT` and `IMAGE` are content types.

**Database requirement:** `posts.metadata` must be a PostgreSQL `JSONB` column.

**Note:** UUIDs, timestamps, URLs, and coordinates are illustrative.

## Future addition:

- soothening bgm
- dynamuc background designs
