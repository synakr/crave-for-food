# Post renderers

Each renderer accepts `PostRendererProps` from `types.ts`. Use `PostRenderer` for automatic dispatch by `post.type`, or import a renderer directly.

```tsx
import { PostRenderer } from "@/components/post-renderers";

<PostRenderer
  post={{
    id: "example-1",
    type: "CAPTION",
    authorName: "Sayan",
    caption: "A text-only post",
    likes: 0,
    comments: 0,
  }}
  onLike={(id) => console.log("like", id)}
  onComment={(id) => console.log("comment", id)}
  onSave={(id) => console.log("save", id)}
/>;
```

Actions are callbacks by design: connect them to your existing repositories so the renderers don't invent a persistence mechanism or interfere with existing likes/comments.
