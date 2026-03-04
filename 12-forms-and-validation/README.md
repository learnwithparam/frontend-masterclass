# Module 12: Forms & Validation

> "A form that only validates on the server is a form that wastes the user's time."

## The Story

The admin "Add Book" form works, but validation only happens on the server — a full round-trip just to learn you forgot the title. There's no cover image upload. And too many fields in one long form intimidate new admins. Time for a multi-step book submission flow with instant client-side validation.

## What You'll Build

- **Shared Zod schemas** used on both client and server
- **Multi-step form** (Details, Cover Upload, Review)
- **Per-field error messages** with instant client-side validation
- **Accessible patterns** (aria-describedby, aria-invalid, focus management)
- **File upload** with preview before submission

## Architecture

```
Step 1: Details          Step 2: Cover           Step 3: Review
[Title     ]             [Choose File]           Title: The Great...
[Author    ]             [Preview img]           Author: F. Scott...
[Pages     ]                                     Pages: 180
[Published ]                                     Cover: gatsby.jpg
[Next >>   ]         [<< Back] [Next >>]     [<< Back] [Submit]
     │                     │                       │
     └── Zod validates ────┘                       │
         client-side                               │
                                            Server Action
                                            ├── Zod validates (again)
                                            ├── POST /api/v1/books
                                            └── POST /api/v1/books/:id/cover
```

## Key Concepts

### Shared Validation
One Zod schema, two environments. The client validates for instant feedback. The server validates for security. Never trust the client alone.

### Multi-Step UX
Break overwhelming forms into digestible steps. Each step validates independently — you can't proceed without fixing errors. The progress bar shows where you are.

### Accessibility
- `aria-describedby` links error messages to fields
- `aria-invalid` signals validation state to assistive tech
- Focus management moves to the first error field
- `role="alert"` announces errors to screen readers

## Prerequisites

- Module 08 (Server Actions) completed
- Backend Module 12 (api-hardening) for file upload endpoint
- Docker Desktop running

## Your Task

1. Create a shared Zod schema for book validation
2. Build a 3-step form with progress indicator
3. Add per-field error messages with aria attributes
4. Implement file upload with client-side preview
5. Wire up the server action with server-side re-validation

## Testing

```bash
make setup    # Install dependencies
make dev      # Run dev server
make smoke    # Run E2E smoke test
```

## Common Mistakes

1. **Client-only validation** — Never trust the client. Always re-validate on the server.
2. **Missing aria-describedby** — Error messages need to be linked to their fields for screen readers.
3. **Losing form state on back** — When going back a step, previous values should be preserved.
4. **No file size check** — Check file size before upload to avoid wasting bandwidth.

## What's Next

Module 13 connects to the backend WebSocket server for live updates — the catalog shows real-time stock changes.
