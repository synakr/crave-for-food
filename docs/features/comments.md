# Comments Feature

## Purpose
Display comments for a post, create comments and support replies.

## Related Code
- `components/CommentModal.tsx`
- `data/models/Comment.ts`
- `data/repositories/CommentRepository.ts`
- `data/repositories/MockCommentRepository.ts`

## Data Flow
`CommentModal` loads comments through `commentRepository`, creates comments through the same repository, and resolves user display data from the current mock database.

Replies use `parent_comment_id` and are rendered recursively beneath their parent comment.

## Current State
The active implementation is mock/in-memory. New comment work should preserve the repository boundary so the implementation can later be replaced without redesigning the modal.

## Important Behavior
- Empty/whitespace-only comments are ignored.
- New comments use the current-user helper.
- Replies are comments whose `parent_comment_id` points to another comment.
