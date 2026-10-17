# TODO: Create `post_responses` Table

## Purpose

Track users who express interest in a post by clicking **Join** or **I'm Interested**. The UI handles the distinction between these actions.

## Schema

- `id` — UUID, primary key
- `post_id` — UUID, FK → `posts.id`
- `user_id` — UUID, FK → `users.id`
- `is_interested` — Boolean, defaults to `TRUE`
- `created_at` — Timestamp, defaults to current time

## Constraints

- Each user can have only one response per post.
- Deleting a post or user deletes their associated response.
- Delete the response row when the user cancels their interest.

## SQL Migration

```sql
CREATE TABLE public.post_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    post_id UUID NOT NULL
        REFERENCES public.posts(id) ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES public.users(id) ON DELETE CASCADE,

    is_interested BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (post_id, user_id)
);

CREATE INDEX idx_post_responses_user_id
    ON public.post_responses(user_id);

CREATE INDEX idx_post_responses_post_id
    ON public.post_responses(post_id);
```

## Implementation Notes

- Insert a row when a user clicks **Join** or **I'm Interested**.
- Use `post_id` to count responses for a post.
- Use `user_id` to retrieve a user's responses.
- Enable Row Level Security (RLS) and configure appropriate policies before exposing the table to clients.
- `is_interested` is currently always `TRUE`; remove it if no boolean state is needed. If `JOINED` and `INTERESTED` must be distinguished in the database later, replace it with a response-type column.
