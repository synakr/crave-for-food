# Post composers

Each composer is an independent form and accepts:

- `onSubmit(draft)`: receives validated post data; connect this callback to your post-creation service.
- `onCancel()`: optional cancel/back handler.
- `submitting`: optional loading state controlled by the parent.

```tsx
import { MediaComposer } from "@/components/post-composers";

<MediaComposer
  onCancel={() => router.back()}
  onSubmit={async (draft) => {
    // Persist the draft using the project's repository/service.
    console.log(draft);
    router.back();
  }}
/>
```

The components intentionally do not write to the database directly. This keeps form UI independent from persistence and protects existing mock/Supabase behavior while the shared post creation flow is integrated.
