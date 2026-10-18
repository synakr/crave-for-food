# Crave Post System

> **Status:** Core product and architecture specification\
> **Scope:** Post types, creation flows, rendering, persistence, and
> occasion-based experiences\
> **Primary principle:** Crave is a general-purpose, location-based
> social discovery app. It must support different kinds of user-created
> content without becoming structurally tied to one theme or occasion.

---

## 1. Purpose

The post system is a core Crave feature. It must support multiple kinds
of posts through one coherent creation and discovery experience.

Crave is not exclusively a food app, travel app, event app, or any other
single-category product. Users should be able to share different kinds
of content, and the architecture must remain extensible as new use cases
emerge.

This document is the source of truth for decisions about:

- Supported post types and their creation experiences.
- How posts are rendered throughout the app.
- Shared functionality such as likes, comments, and saves.
- How occasion-based experiences (for example, Christmas) fit into the
  system.
- When to reuse an existing post type and when to introduce a new one.
- Compatibility, persistence, and safe incremental implementation.

## 2. Non-negotiable principles

1.  **One creation entry point.** Users begin from a single Create Post
    flow and choose what they want to create.
2.  **Independent composers.** Each post type has its own focused
    creation form and validation.
3.  **Independent renderers.** Each post type has its own display
    component, so one type can evolve without redesigning every other
    type.
4.  **Shared infrastructure.** Post identity, persistence, and common
    interactions are shared rather than reimplemented per type.
5.  **General-purpose by design.** Do not hard-code Crave around food,
    travel, or any other single theme.
6.  **Occasions are not automatically new post types.** Seasonal and
    occasion-based experiences should normally reuse existing post
    types, composition flows, renderers, and shared actions.
7.  **Extend only when justified.** Add a new post type only when the
    content has meaningfully different structure, validation, behavior,
    or presentation---not merely because it has a different theme.
8.  **Preserve existing behavior.** Changes must be incremental and must
    not silently remove or regress the map, markers, location, search,
    navigation, existing modals, or existing post interactions.
9.  **Do not assume the database schema.** Verify the actual Supabase
    schema and constraints before preparing or applying migrations.
10. **Mock first, then verify the backend.** The mock implementation can
    support UI development, but it must not be treated as proof that the
    production database supports the same shape.

## 3. Initial post types

The initial system has five post types.

---

Type Purpose Typical content

---

`MEDIA` Visual or short-form Photo, GIF, or a short
media sharing clip (including a 2--3
second clip)

`CAPTION` Quick text-first Thought, short update,
sharing question, or status

`EVENT` Organize or promote a Meetup, sports
gathering activity, community
gathering, or other
event

`GIG` Share an opportunity or A gig, offer, task, or
request request, with details
appropriate to the
product's eventual gig
model

`ARTICLE` Longer-form writing Article, story, or poem

---

These types are the initial supported set, not a limit on Crave's future
capabilities.

### 3.1 Media posts

- Support a media-first experience for photos, GIFs, and short clips.
- A caption may accompany the media.
- The composer and renderer should accommodate media-specific UI
  without forcing text-only posts to use media layouts.
- Media limits, accepted formats, playback behavior, and upload rules
  must be explicit and validated by the relevant layer.

### 3.2 Caption posts

- Support a text-first post with no photo required by default.
- The UI must support a plain text-only post.
- If optional media is later supported, it must not make media
  mandatory or undermine the text-first experience.

### 3.3 Event posts

- Represent a planned gathering with event-specific fields such as
  title, description, category, date, start time, end time, location,
  audience, and an optional cover image.
- Preserve existing event creation and display behavior during
  migration.
- Event-specific information must be represented consistently so the
  event renderer and any event-detail UI can read it.
- Event fields should not be added indiscriminately to the shared
  `posts` record if they are only meaningful to events.

### 3.4 Gig posts

- Have a dedicated composer and renderer.
- Define and validate gig-specific fields within the gig feature
  rather than leaking them into unrelated post types.
- The detailed gig data contract must be documented before
  implementation depends on fields not yet agreed upon.

### 3.5 Article / poem posts

- Support longer-form written content.
- Use a dedicated writing composer and readable renderer.
- Keep article-specific fields and layout out of the media and caption
  components.

## 4. Required project structure

Use the following architecture as the target structure. Existing files
may remain in place during migration; do not delete or move working
functionality until the replacement has been verified.

```text
app/
  create-post.tsx                 # Entry point and post-type selection

components/
  post-composers/
    MediaComposer.tsx
    CaptionComposer.tsx
    EventComposer.tsx
    GigComposer.tsx
    ArticleComposer.tsx

  posts/
        CaptionPost.tsx               # Compact renderer + CaptionPostModal export
        EventPost.tsx                 # Compact renderer + CreatedEventPostModal export
        GigPost.tsx                   # Compact renderer + GigPostModal export
        ArticlePost.tsx               # Compact renderer + ArticlePostModal export
        PostActions.tsx               # Shared likes, comments, saves, etc.

data/
  models/
    Post.ts
    PostContent.ts

  repositories/
    PostRepository.ts             # Shared persistence interface
    MockPostRepository.ts         # Development/mock implementation
    # A production adapter must follow the same interface.

  services/
    postCreation.ts               # Shared creation orchestration, as needed
```

The names above describe the intended architecture. If the project
already uses a different folder convention, adapt imports and file
placement consistently rather than duplicating competing
implementations.

## 5. Creation flow

1.  The user opens `app/create-post.tsx`.
2.  The user chooses one of the supported post types.
3.  The entry point displays that type's composer.
4.  The composer collects and validates type-specific input.
5.  The composer submits a well-defined draft through a shared creation
    contract.
6.  Shared creation/persistence code creates the common post record and
    its content records, plus any required type-specific details.
7.  On success, the user receives appropriate feedback and the flow
    closes or navigates according to the existing UX.
8.  On failure, show an actionable error and retain enough context for
    the user to recover.

### 5.1 Composer responsibilities

Each composer owns:

- Its form fields and local form state.
- Type-specific validation and input limits.
- Type-specific selection UI, such as media picking when relevant.
- Submission of a typed draft through the agreed creation contract.
- Clear loading, success, failure, and cancel behavior.

A composer must not independently implement its own database persistence
logic. It should use the shared creation/persistence path.

### 5.2 Entry-point responsibilities

`app/create-post.tsx` owns:

- The available post-type choices.
- Which composer is currently active.
- Shared navigation/cancel behavior where appropriate.
- The connection between a composer submission and the shared creation
  flow.

It should not become a giant component containing all five forms. Adding
a new type should not require rewriting the existing composers.

## 6. Rendering and discovery

Each in-scope post type has a dedicated display module in `components/Posts/`:

- `CaptionPost.tsx`
- `EventPost.tsx`
- `GigPost.tsx`
- `ArticlePost.tsx`

Each module preserves its default compact renderer export and exposes the
corresponding detail modal as a named export. MEDIA rendering remains in its
existing map/modal path and is intentionally outside this display grouping.

A renderer should display the post type's content and relevant details.
Shared interactions should be delegated to `PostActions.tsx` or a common
equivalent.

### 6.1 Renderer responsibilities

- Render the correct content for the post type.
- Handle absent optional content gracefully.
- Keep type-specific layout and behavior local to that renderer.
- Use shared author, timestamp, location, and action UI where
  appropriate.
- Avoid assuming that every post has an image, place, or caption.
- Avoid reading type-specific metadata through unsafe assumptions;
  validate or normalize data at a clear boundary.

### 6.2 Renderer selection

Use a single, explicit mapping from the post type to its renderer.
Unknown or legacy types must not crash the screen: provide a safe
fallback or a clear unsupported-content treatment.

The map-based Explore experience must remain functional. A post that has
no valid coordinates should not be passed to a map marker as though its
coordinates were valid. The UI can still display that post in a non-map
surface when such a surface exists.

### 6.3 Shared post actions

`components/posts/PostActions.tsx` is responsible for shared actions
where applicable, such as:

- Like / unlike.
- Open or view comments.
- Save / unsave.
- Share or other common actions introduced later.

The action component should receive explicit post identity and callbacks
or use the established shared data layer. It must not contain five
separate implementations of the same interaction. Actions that do not
make sense for a particular post can be hidden or disabled
intentionally.

## 7. Shared data and persistence

The system should have one shared post identity and one repository
contract for common post operations. Post types should not each create a
completely separate persistence system.

### 7.1 Shared post record

The shared `posts` record should contain fields that apply broadly
across post types, such as:

- Post ID.
- Author ID.
- Optional place ID.
- Post type.
- Shared caption or summary, when applicable.
- Common counters such as views, likes, and comments (subject to the
  verified database design).
- Creation and update timestamps.
- Optional expiration information, if supported by the product.

Do not add every possible event, gig, article, and future occasion field
to the shared post table. A shared column is appropriate when the field
has a consistent meaning across most or all post types.

### 7.2 Content records

`post_contents` can represent ordered content associated with a post,
such as text and media. A content record may contain:

- Content ID and owning post ID.
- Content type (for example, text or image).
- Storage key or media reference, when applicable.
- Text content, when applicable.
- Content order.
- Optional metadata for flexible, type-specific information.
- Creation timestamp.

Use explicit, validated data contracts for fields that drive important
behavior. JSON/JSONB metadata is useful for flexible information, but it
should not become an unvalidated dumping ground for fields needed for
filtering, indexing, authorization, or relational integrity.

A post may have zero, one, or multiple content records depending on its
type. Do not assume every post has an image.

### 7.3 Type-specific details

Use a separate detail table when a type has a meaningful group of
structured fields that require relational constraints, frequent
filtering, or their own lifecycle. Event and gig details are candidates,
depending on the final product requirements and verified schema.

Choose the representation based on actual access patterns and data
integrity needs---not on a blanket rule that every type must have a
separate table or that every field must live in JSON.

### 7.4 Repository contract

`PostRepository.ts` is the shared persistence interface. It should
define the common operations required by the app, including reading
posts, reading content, creating, updating, deleting, and retrieving the
data needed by Explore.

Creating a post and its associated content should be handled as one
logical operation. Where the backend supports transactions, use them to
avoid a post being saved without its required content or vice versa. A
mock implementation should emulate the same contract and basic integrity
checks.

The mock and production adapters must agree on behavior and types. Keep
UI components independent of whether the repository currently uses an
in-memory mock or a production backend.

### 7.5 Supabase safety

Before changing the live schema:

1.  Inspect the actual tables, columns, foreign keys, constraints, and
    Row Level Security policies.
2.  Confirm the existing schema supports the proposed post type and
    content relationships.
3.  Design a migration that preserves existing data and compatibility.
4.  Update the production repository adapter and policies as needed.
5.  Test creation, retrieval, updates, and deletion against the real
    schema.

Do not assume that the mock schema matches Supabase. Do not disable
security policies merely to make a feature work.

## 8. Occasion-based and seasonal experiences

Occasion-based content is a core extension point, not a reason to
fragment the post system.

Examples include Christmas, New Year, festivals, local celebrations,
seasonal campaigns, and community occasions. These examples are
illustrative; they do not imply a fixed list of supported occasions.

### 8.1 Reuse before adding a type

When adding an occasion:

1.  Identify what the user is trying to share.
2.  Select the existing post type that best represents that content.
3.  Reuse its composer, renderer, repository flow, and shared actions.
4.  Add an occasion-specific theme, template, badge, prompt, or optional
    metadata where appropriate.
5.  Add a new post type only if the occasion introduces genuinely
    different content semantics or behavior.

For example, a Christmas photo should normally be a `MEDIA` post with an
optional Christmas theme or occasion label. A Christmas gathering should
normally be an `EVENT` post. A Christmas poem should normally be an
`ARTICLE` post. The occasion itself does not require a new `CHRISTMAS`
post type.

### 8.2 Model the occasion separately from the post type

Where occasion tagging is needed, treat it as a separate concept from
the post type. For example, a post could conceptually have:

- `post_type = MEDIA`
- `occasion = CHRISTMAS`

This is a conceptual example, not a claim that an `occasion` database
column currently exists. Choose the actual representation only after
defining its query, moderation, and persistence requirements.

An occasion may influence visual presentation or discovery without
changing the underlying post type. Occasion-specific presentation should
be optional and should not prevent a post from being rendered by its
ordinary renderer.

### 8.3 Occasion templates

If the product needs guided creation for a particular occasion, provide
templates or presets that populate an existing composer. A template may
suggest a caption, styling, prompts, or relevant optional metadata. It
should not duplicate an entire composer or renderer without a clear
functional reason.

Occasion features must not permanently couple core post logic to a
single holiday, campaign, or theme. They should be possible to add and
remove without destabilizing ordinary posts.

## 9. Rules for introducing a new post type

Before adding a new type, answer these questions:

1.  Does it represent a genuinely different kind of user content?
2.  Does it require different fields, validation, lifecycle, or
    interaction behavior?
3.  Can an existing type plus a template, theme, or metadata represent
    it cleanly?
4.  Does it need a separate renderer, or can the existing renderer
    handle the variation safely?
5.  What changes are required in the data model, repository, creation
    flow, discovery, moderation, and tests?
6.  How will old app versions and existing records behave?

Create a new type only when the answers justify the added complexity. If
the difference is mainly visual or seasonal, prefer a theme or template.

When adding a new type, update all relevant parts together:

- Type definitions and validation.
- Composer and renderer.
- Type-to-composer and type-to-renderer mappings.
- Shared creation and repository handling.
- Persistence and any necessary migration.
- Explore/discovery behavior and detail views.
- Shared actions, where relevant.
- Tests and architecture documentation.

## 10. Compatibility and safe migration

Crave already has working functionality that must be preserved while
this architecture is introduced. Refactoring must be incremental.

- Keep the existing map, map markers, location permission flow,
  location search, recenter behavior, navigation drawer, focus
  interactions, and existing post modals working.
- Do not remove the temporary event store or its UI until the
  replacement reads and displays shared-repository events correctly
  and has been verified.
- Preserve existing records and handle legacy records that do not yet
  have a `post_type`.
- During transition, use a documented fallback for legacy records
  rather than assuming every record already contains the new field.
- Avoid broad rewrites when a focused change is sufficient.
- Verify imports, TypeScript types, and runtime behavior after each
  migration step.
- Do not claim a feature is integrated merely because its component
  exists.

A safe migration order is:

1.  Document and verify current models, repository behavior, mock data,
    and Supabase schema.
2.  Add compatible post-type definitions and shared creation contracts.
3.  Extract existing event creation into `EventComposer` without
    changing its visible behavior unnecessarily.
4.  Make the create-post screen select and host composers.
5.  Ensure creation saves the post and its content consistently.
6.  Add renderer selection and migrate one type at a time.
7.  Integrate renderers into Explore and relevant detail surfaces
    without regressing map behavior.
8.  Retire the old event store only after the replacement is verified.
9.  Implement remaining types and occasion templates incrementally.
10. Test mock and production adapters separately.

## 11. Testing checklist

### Creation

- [ ] Each of the five types can be selected.
- [ ] Each composer validates required fields.
- [ ] Media selection is optional or required according to the type's
      defined behavior.
- [ ] Cancel and back navigation work.
- [ ] Repeated taps cannot accidentally create duplicate posts.
- [ ] Errors are shown clearly and do not silently discard input.

### Persistence and data integrity

- [ ] Every new post has a unique ID and correct author reference.
- [ ] The post type is stored and retrieved consistently.
- [ ] Content belongs to the correct post and preserves content order.
- [ ] Failed creation does not leave inconsistent partial data.
- [ ] Update and delete behavior is correct.
- [ ] Missing optional content does not crash rendering.
- [ ] The mock and production adapters follow the same contract.

### Rendering and interactions

- [ ] Every known type selects the correct renderer.
- [ ] Legacy or unknown types have a safe fallback.
- [ ] Shared actions operate on the correct post.
- [ ] Text-only posts do not require images.
- [ ] Posts without coordinates do not break map rendering.
- [ ] Existing map, search, location, navigation, markers, and modals
      still work.

### Occasions

- [ ] Occasion styling can be used with existing post types.
- [ ] Removing or changing an occasion theme does not corrupt the
      underlying post.
- [ ] An occasion does not create a new type unless the type-addition
      criteria are met.
- [ ] Ordinary non-occasion posts continue to work.

## 12. Definition of done

The post system is considered complete for a release when:

- The five initial post types can be created through one entry point.
- Each type has a dedicated composer and renderer.
- Shared persistence and common actions work consistently.
- Occasion-based experiences reuse existing types unless a new type is
  demonstrably necessary.
- Existing Crave functionality remains intact.
- The production schema and security rules have been verified before
  deployment.
- Tests cover creation, retrieval, rendering, actions, failure
  handling, legacy data, and relevant occasion behavior.
- Documentation is updated when the architecture or supported types
  change.

---

## Summary

**Crave has one extensible post system, not a separate system for every
theme or occasion.**

Post type describes _what the content is_. Occasion describes _the
context or theme around it_. Composers and renderers stay independent by
type; persistence and shared actions stay common; new types are
introduced only when the product genuinely needs them. All changes must
preserve existing functionality and be verified against the real data
model before production rollout.
