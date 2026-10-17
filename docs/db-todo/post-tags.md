# TODO: Add Post Tags

## Purpose

Allow users to associate up to **3 tags per post**. Users can select existing tags or create new ones.

## 1. `tags` Table

- `id` — UUID, primary key
- `name` — Unique, normalized tag name

## 2. `post_tags` Table

- `post_id` — UUID, FK → `posts.id`
- `tag_id` — UUID, FK → `tags.id`

**Constraint:** Composite primary key on `(post_id, tag_id)` to prevent duplicate tags on a post.

## Implementation

1. Normalize the tag name and check whether it already exists.
2. Reuse the existing tag or create a new one.
3. Associate the tag with the post through `post_tags`.
4. Allow a maximum of 3 tags per post.
5. Add an index on `post_tags.tag_id` for tag-based post searches.
6. Enable RLS and configure appropriate policies.

## SQL Migration

```sql
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.post_tags (
    post_id UUID NOT NULL
        REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL
        REFERENCES public.tags(id) ON DELETE CASCADE,

    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_tag_id
    ON public.post_tags(tag_id);
```

**Note:** Enforce tag normalization and the 3-tag limit in the application, or add database-level enforcement if required.
