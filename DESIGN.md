<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#A78BFA,#8B5CF6);margin:0 0 22px 0;"></div>
# <span style="color:#5B21B6;">WaveChat — Design System & UX Specification</span>

**Status:** <span style="display:inline-block;padding:3px 10px;border-radius:999px;background:#EDE9FE;color:#5B21B6;font-weight:700;">Target-state design specification</span>  
**Audience:** Human developers, designers, and AI coding agents

---

# <span style="color:#5B21B6;">1. Design Direction</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

WaveChat should feel:

- modern,
- social,
- fast,
- polished,
- trustworthy,
- expressive without being visually noisy,
- professional enough for a portfolio-grade product.

The visual language should prioritize communication content over decoration.

---

# <span style="color:#5B21B6;">2. Brand Principles</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

1. Communication first.
2. Content hierarchy must be obvious.
3. Interaction feedback must be immediate.
4. Destructive actions must be clear.
5. Motion should explain state changes, not distract.
6. Mobile behavior must be intentional.
7. Accessibility is part of the design, not a later patch.

---

# <span style="color:#5B21B6;">3. Color System</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use semantic tokens rather than hard-coded colors throughout components.

Recommended token families:

```text
background
foreground
surface
surface-elevated
surface-muted
border
border-subtle
primary
primary-foreground
secondary
secondary-foreground
success
warning
danger
info
muted
muted-foreground
online
offline
message-own
message-other
```

The exact brand palette is not fixed by the supplied project.

> [!WARNING]
> <span style="color:#5B21B6;background:#EDE9FE;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER INPUT REQUIRED: Finalize WaveChat brand colors. The existing frontend already contains theme variables, but the final product palette should be centralized and documented.</span>

---

# <span style="color:#5B21B6;">4. Typography</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

The supplied frontend includes Manrope and Inter.

Recommended:

- **Manrope:** brand/UI headings and major interface typography.
- **Inter:** dense functional UI and data-heavy areas.

Use a limited type scale.

```text
Display
H1
H2
H3
Body
Body Small
Caption
Label
```

Do not create a new font size for every component.

---

# <span style="color:#5B21B6;">5. Spacing</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use a consistent spacing scale.

Recommended base unit:

```text
4px
```

Examples:

```text
4
8
12
16
20
24
32
40
48
64
80
```

Use spacing tokens/classes rather than arbitrary values whenever possible.

---

# <span style="color:#5B21B6;">6. Radius</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use semantic radius levels:

```text
sm   → inputs/small controls
md   → cards/buttons
lg   → panels/dialogs
xl   → major containers
full → avatars/chips/status indicators
```

Avoid excessive rounded containers that make the application look like a collection of pills.

---

# <span style="color:#5B21B6;">7. Shadows and Elevation</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use restrained elevation.

```text
Level 0 → flat
Level 1 → subtle controls/cards
Level 2 → popovers
Level 3 → dialogs
Level 4 → major overlays
```

Dark mode should not simply invert shadows.

---

# <span style="color:#5B21B6;">8. Layout</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

## <span style="color:#8B5CF6;">Desktop >= 1280px</span>

Recommended shell:

```text
┌──────────────┬──────────────────────┬───────────────────┐
│ Sidebar      │ Main content/chat    │ Context panel     │
│              │                      │                   │
│ navigation   │ feed / chat          │ profile/details   │
│ shortcuts    │                      │ media/search      │
└──────────────┴──────────────────────┴───────────────────┘
```

The right context panel should appear only when useful.

## <span style="color:#8B5CF6;">Tablet 768–1279px</span>

Reduce persistent navigation.

- Collapsible sidebar.
- Chat remains primary.
- Context panels become drawers.
- Avoid three-column layouts unless there is enough space.

## <span style="color:#8B5CF6;">Mobile &lt;768px</span>

Use single-primary-surface navigation.

Examples:

```text
Home → Feed
Chat → Conversation
Search → Search
Profile → Profile
```

Chat should prioritize:

```text
Header
Messages
Composer
```

Everything else should become a drawer/modal/screen.

---

# <span style="color:#5B21B6;">9. Navigation</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Desktop:

- Persistent sidebar.
- Clear active state.
- User/profile control.
- Notifications.
- Search.

Mobile:

- Bottom navigation or compact top navigation depending on the final information architecture.

> [!WARNING]
> <span style="color:#5B21B6;background:#EDE9FE;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER INPUT REQUIRED: Finalize mobile navigation model.</span>

---

# <span style="color:#5B21B6;">10. Authentication Screens</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Required:

- Login.
- Registration.
- Forgot password.
- Reset password.
- Google authentication.
- Verification states.

Visual requirements:

- Strong brand identity.
- Minimal distractions.
- Clear validation.
- Password visibility control.
- Loading state.
- Error state.
- Success confirmation.

Do not hide important errors in toasts only.

---

# <span style="color:#5B21B6;">11. Home/Feed</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Feed cards should have:

```text
Avatar
Name / username
Timestamp
Content
Media
Actions
```

Actions must have clear hit targets.

If the product's social feed remains in scope, define the exact post/comment/reaction model before implementing it.

> [!WARNING]
> <span style="color:#5B21B6;background:#EDE9FE;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — IMPORTANT: The supplied frontend contains Feed/Post/Comment modules, but the supplied PostgreSQL model list does not show a corresponding Post model. Decide whether Feed/Post is a real WaveChat feature, remove it from the final scope, or add the required domain model/API specification.</span>

---

# <span style="color:#5B21B6;">12. Chat List</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Each conversation item:

```text
Avatar
Name
Last message
Timestamp
Unread badge
Mute indicator
Presence indicator where allowed
```

States:

- active,
- unread,
- muted,
- archived,
- blocked,
- loading,
- empty.

Do not show sensitive previews when privacy settings prohibit them.

---

# <span style="color:#5B21B6;">13. Chat Window</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Structure:

```text
┌─────────────────────────────┐
│ Chat header                 │
├─────────────────────────────┤
│                             │
│ Message list                │
│                             │
│ replies                     │
│ reactions                   │
│ attachments                 │
│                             │
├─────────────────────────────┤
│ Reply/edit preview          │
│ Attachment preview          │
│ Message composer            │
└─────────────────────────────┘
```

### Message bubbles

Own messages and other messages must be visually distinguishable without relying solely on color.

Message metadata:

- timestamp,
- edited state,
- delivery/read state where relevant.

---

# <span style="color:#5B21B6;">14. Message Interaction</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Desktop:

- Hover reveals secondary actions.
- Context menu for more actions.

Mobile:

- Long press opens action sheet.

Actions:

- Reply.
- React.
- Copy.
- Edit if owner.
- Delete according to policy.
- Forward.
- Pin.
- Report where applicable.

---

# <span style="color:#5B21B6;">15. Composer</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Composer should support:

- Text.
- Emoji.
- Attachment.
- Voice recording.
- Reply state.
- Edit state.
- Mention autocomplete.
- Send button.
- Upload progress.
- Error/retry.

Keyboard:

- Enter sends according to setting.
- Ctrl+Enter behavior follows user preference.

---

# <span style="color:#5B21B6;">16. Group UI</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Group header should show:

- group avatar,
- group name,
- member count,
- online/member context where useful,
- call/search/menu actions.

Group info:

- description,
- members,
- admins,
- permissions,
- invites,
- join requests,
- muted state,
- media/files.

---

# <span style="color:#5B21B6;">17. Stories UI</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Story entry should be visually distinct from normal profile content.

Story viewer:

```text
Progress
Header
Story content
Reply/reaction action
More menu
```

Support:

- image,
- video,
- text,
- voice.

Always show remaining progress clearly.

---

# <span style="color:#5B21B6;">18. Profile</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Profile layout:

```text
Avatar
Full name
Username
About
Relationship actions
Stats/context
```

Actions vary by relationship:

- Message.
- Add contact.
- Friend request.
- Block.
- Report.

---

# <span style="color:#5B21B6;">19. Search</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Search should have:

- prominent input,
- loading state,
- recent searches,
- categorized results,
- empty state,
- error state.

Debounce input.

---

# <span style="color:#5B21B6;">20. Notifications</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Notification rows:

```text
Icon/avatar
Title
Description
Timestamp
Unread indicator
Action/deep link
```

Do not make every notification a visually dominant alert.

---

# <span style="color:#5B21B6;">21. Settings</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use grouped settings:

```text
Account
Privacy
Security
Chats
Notifications
Media
Appearance
Language
AI
```

Dangerous operations must be visually separated.

Examples:

- delete account,
- revoke all sessions,
- remove data.

---

# <span style="color:#5B21B6;">22. AI UI</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

AI chat should feel like part of WaveChat but remain visually distinguishable.

Required:

- AI identity.
- Conversation history.
- Streaming state if supported.
- Credit balance.
- Usage/plan information.
- Retry on provider failure.
- Clear attachment support.
- Empty state.
- Rate/credit limit state.

Do not make AI output look identical to a normal human message if that can cause confusion.

---

# <span style="color:#5B21B6;">23. Modals and Drawers</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use:

- modal for focused confirmation/input,
- drawer for contextual information,
- full-page route for complex workflows.

Do not put entire applications inside a modal.

---

# <span style="color:#5B21B6;">24. Toasts</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use toasts for:

- lightweight confirmation,
- non-blocking status,
- background operation completion.

Do not use toasts for:

- critical validation errors,
- information that must remain visible,
- destructive confirmations.

---

# <span style="color:#5B21B6;">25. Loading States</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Prefer skeletons for content.

Use spinners for:

- small action progress,
- button submission,
- short transient waits.

Avoid full-page spinners whenever partial UI can remain usable.

---

# <span style="color:#5B21B6;">26. Empty States</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Every major list needs an intentional empty state.

Examples:

- No conversations.
- No messages.
- No friend requests.
- No notifications.
- No stories.
- No search results.
- No AI chats.

Each empty state should explain what the user can do next.

---

# <span style="color:#5B21B6;">27. Error States</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Errors should provide:

- what happened,
- whether retry is possible,
- a clear action.

Example:

```text
Couldn't load your conversations.
[Try again]
```

Avoid:

```text
Something went wrong.
```

with no recovery action.

---

# <span style="color:#5B21B6;">28. Motion</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Use Framer Motion where motion improves:

- route transitions,
- drawers,
- dialogs,
- message insertion,
- list appearance,
- loading transitions.

Do not animate every element.

Respect:

```text
prefers-reduced-motion
```

and the user's `animations` setting.

---

# <span style="color:#5B21B6;">29. Accessibility</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

Target:

- WCAG-conscious contrast.
- Keyboard operation.
- Focus management.
- Screen-reader labels.
- Reduced motion.
- Semantic structure.

Interactive hit areas should be comfortable on touch devices.

---

# <span style="color:#5B21B6;">30. Responsive QA Checklist</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

### Mobile

- No horizontal overflow.
- Keyboard does not hide composer.
- Long messages wrap correctly.
- Images do not overflow.
- Menus remain inside viewport.
- Bottom navigation does not cover content.
- Chat scroll position remains stable.

### Tablet

- Sidebar does not consume excessive width.
- Chat remains usable.
- Drawers work correctly.

### Desktop

- Multi-column layout remains balanced.
- Long conversations remain performant.
- Wide screens do not create excessive text line lengths.

---

# <span style="color:#5B21B6;">31. Design Tokens Still Needed</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

> [!WARNING]
> <span style="color:#5B21B6;background:#EDE9FE;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER INPUT REQUIRED</span>

Finalize:

- brand primary,
- accent,
- dark background,
- light background,
- semantic colors,
- exact typography scale,
- shadow scale,
- radius scale,
- component heights,
- breakpoints beyond the existing 768/1280 targets,
- mobile navigation.

---

# <span style="color:#5B21B6;">32. Design Acceptance Criteria</span>
<div style="height:1px;background:linear-gradient(90deg,#A78BFA55,transparent);margin:10px 0 18px 0;"></div>

A feature is visually complete only when:

- Desktop works.
- Tablet works.
- Mobile works.
- Dark mode works.
- Light mode works.
- Loading state exists.
- Empty state exists.
- Error state exists.
- Disabled state exists.
- Focus state exists.
- Reduced-motion behavior works.
- No obvious layout overflow exists.

<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#8B5CF6,#A78BFA);margin:22px 0 0 0;"></div>
