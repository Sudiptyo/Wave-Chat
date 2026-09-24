<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#F59E0B,#D97706);margin:0 0 22px 0;"></div>
# <span style="color:#92400E;">WaveChat — Project Memory</span>

**Purpose:** Persistent context for humans and AI agents.

This document records architectural decisions, current project direction, constraints, unresolved decisions, and lessons learned. It should be updated whenever a meaningful project decision changes.

---

# <span style="color:#92400E;">1. Project Identity</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

**Name:** WaveChat

**Type:** Real-time social communication web application.

**Primary goal:** Build a polished full-stack communication platform suitable as a serious portfolio project and as a foundation for further production-oriented development.

---

# <span style="color:#92400E;">2. Target Technology</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

## <span style="color:#D97706;">Frontend</span>

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Redux Toolkit
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- Framer Motion
- Lucide
- React Toastify
- React Tooltip

The supplied frontend package confirms these core technologies. fileciteturn0file0L228-L246

## <span style="color:#D97706;">Backend</span>

- Node.js
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- Socket.IO
- Redis
- Background worker/queue architecture
- Cloudinary/media storage
- Google OAuth
- JWT sessions
- Pino logging
- Zod validation

The supplied backend package confirms Fastify, Prisma/PostgreSQL tooling, Socket.IO, Cloudinary, Google APIs, Pino, JWT, Zod and related infrastructure. fileciteturn0file1L3676138-L3676200

---

# <span style="color:#92400E;">3. Persistence Decision</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

PostgreSQL + Prisma is the target authoritative persistence architecture.

The current Prisma domain model already covers a broad WaveChat data model including users, sessions, conversations, messages, groups, stories, notifications, calls, reactions, reports and AI modules. fileciteturn0file1L11-L42

Do not introduce another primary database without an explicit architecture decision.

---

# <span style="color:#92400E;">4. Frontend State Decision</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Use:

### TanStack Query

For server state.

### Redux Toolkit

For genuine client/global state.

This avoids maintaining duplicate copies of backend data.

---

# <span style="color:#92400E;">5. Authentication Memory</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The backend currently follows a session-oriented JWT design:

- access token,
- refresh token,
- session ID,
- refresh-token hash,
- expiry,
- device metadata,
- user-agent,
- IP,
- revocation state.

The session model explicitly stores refresh-token hashes and revocation/expiry information. fileciteturn0file1L3882828-L3882828

Google authentication is treated separately from local credentials.

Do not silently merge an existing local account with a Google identity.

---

# <span style="color:#92400E;">6. Current Domain Model</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Major current/planned domains:

```text
Auth
User
UserSettings
AuthSession

Contact
FriendRequest
Block
Report

Conversation
ConversationParticipant
Archive
MuteConversation

Message
MessageAttachment
MessageMention
MessageStatus
Pinned
Reaction

GroupChat
GroupMember
GroupInvite
GroupJoinRequest

Story
StoryView
StoryAllowedUser
StoryExcludedUser

Notification
CallLog

AiChat
AiMessage
AiPlan
AiSubscription
```

---

# <span style="color:#92400E;">7. Product Scope</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

WaveChat is not only a direct-message application.

Target product includes:

- authentication,
- profiles,
- contacts,
- friend requests,
- blocking,
- reporting,
- private messaging,
- rich media,
- groups,
- stories,
- notifications,
- search,
- privacy,
- settings,
- audio/video calls,
- AI assistant,
- AI credits/plans,
- subscriptions/payments.

---

# <span style="color:#92400E;">8. Real-Time Decision</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Socket.IO is the target real-time transport.

Durable state belongs in PostgreSQL.

Ephemeral state belongs in Redis.

Socket events should not become a second database.

---

# <span style="color:#92400E;">9. Async Decision</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

A worker process exists in the project structure, and Queue/Cache/Redis directories exist in the backend.

The finished architecture should use background jobs for work that does not need to block the user request.

Potential jobs:

- email,
- push notifications,
- media processing,
- AI tasks,
- cleanup,
- expiration,
- analytics.

---

# <span style="color:#92400E;">10. Media Decision</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Cloudinary is already present in the backend dependencies and utility layer.

Use a storage abstraction so the rest of WaveChat does not depend on vendor-specific details.

---

# <span style="color:#92400E;">11. AI Decision</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

AI is a first-class product module.

The database already supports:

- AI chats,
- AI messages,
- AI plans,
- AI subscriptions,
- credits.

The exact provider/model and payment system are still open decisions.

---

# <span style="color:#92400E;">12. Existing Project Structure Context</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Frontend is already organized around:

```text
API
Components
Config
Hooks
Layouts
Pages
Routes
Store
Types
Utils
```

Backend is organized around:

```text
Config
Controllers
Db
Interfaces
Middlewares
Models
Plugins
Routes
Schemas
Services
Types
Utils
App
Server
Worker
```

These structures should evolve incrementally.

Do not replace the entire codebase just to make it look like a template.

---

# <span style="color:#92400E;">13. Important Existing Frontend Areas</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The current frontend contains modules for:

- Auth.
- Chat.
- Common UI.
- Feed.
- Navbar.
- Notifications.
- Profile.
- Search.
- Sidebar.
- Settings.
- Theme provider.

The project also has route/page separation for authentication, chat, home, notifications, profiles, search, settings, about and not-found pages. fileciteturn0file0L23-L115

---

# <span style="color:#92400E;">14. Important Existing Backend Areas</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The backend already has authentication controllers/services/routes and a Prisma schema split into domain-specific model files.

The generated Prisma client contains models corresponding to the broader domain. fileciteturn0file1L455-L655

---

# <span style="color:#92400E;">15. Known Architecture Risk</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The supplied backend dependency list contains both Prisma/PostgreSQL tooling and Mongoose packages.

This must be resolved deliberately.

Target rule:

> PostgreSQL + Prisma is the authoritative relational persistence path for WaveChat.

Any remaining Mongoose code should either be removed or explicitly justified.

---

# <span style="color:#92400E;">16. Known Product Gap: Feed/Post</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The frontend contains:

```text
Feed
CreatePost
PostActions
PostCard
Comment API
Post API
```

but the supplied Prisma model list does not contain a corresponding Post domain model.

This is unresolved.

> [!WARNING]
> <span style="color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER DECISION REQUIRED:</span>
> Either:
> 1. make Feed/Post a real product module and add its complete backend/database specification, or
> 2. remove/de-scope it from WaveChat.

Do not let an AI agent invent the missing Post schema.

---

# <span style="color:#92400E;">17. Known Product Gap: Calls</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The database has CallLog.

CallLog records:

- conversation,
- caller,
- receiver,
- call type,
- start/end,
- duration,
- status.

However, CallLog alone does not implement WebRTC.

> [!WARNING]
> <span style="color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER DECISION REQUIRED:</span>
> Define WebRTC signaling, STUN/TURN, reconnect, device switching, permission handling and call lifecycle.

---

# <span style="color:#92400E;">18. Known Product Gap: Payments</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The AI subscription model contains:

- payment link ID,
- payment ID,
- amount,
- currency,
- credits,
- status.

But the supplied project snapshot does not establish a complete payment provider integration.

> [!WARNING]
> <span style="color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER DECISION REQUIRED:</span>
> Choose payment provider and define webhook/idempotency/refund behavior.

---

# <span style="color:#92400E;">19. Known Product Gap: Push Notifications</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

The product has in-app notification models and notification preferences.

Browser push requires additional implementation.

> [!WARNING]
> <span style="color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER DECISION REQUIRED:</span>
> Choose Web Push/VAPID implementation and notification delivery architecture.

---

# <span style="color:#92400E;">20. Known Product Gap: Email</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Email directories/utilities exist, but the final provider and production delivery strategy are not fixed.

> [!WARNING]
> <span style="color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER DECISION REQUIRED:</span>
> Choose email provider and verify sender/domain strategy.

---

# <span style="color:#92400E;">21. Known Product Gap: AI Provider</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

AI tables exist, but provider/model details are not fixed.

> [!WARNING]
> <span style="color:#92400E;background:#FEF3C7;padding:3px 8px;border-radius:6px;font-weight:700;">TODO — USER DECISION REQUIRED:</span>
> Choose model/provider, streaming approach, token/credit accounting, attachment limits and failure policy.

---

# <span style="color:#92400E;">22. Known Product Gap: Production Infrastructure</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Not yet fixed:

- frontend hosting,
- backend hosting,
- PostgreSQL provider,
- Redis provider,
- object/media storage,
- domain,
- CDN,
- observability platform,
- CI/CD provider.

---

# <span style="color:#92400E;">23. Known Product Gap: Legal/Compliance</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Must be added before public production:

- Privacy Policy.
- Terms of Service.
- Cookie policy if required.
- Data deletion policy.
- Content/reporting policy.
- AI usage disclosure if applicable.
- Payment/refund policy if applicable.

---

# <span style="color:#92400E;">24. Current Responsive Targets</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

```text
Desktop >= 1280px
Tablet 768px–1279px
Mobile < 768px
```

These should remain the baseline unless intentionally changed.

---

# <span style="color:#92400E;">25. Current UX Direction</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

WaveChat should be:

- modern,
- clean,
- responsive,
- social,
- communication-focused,
- accessible,
- fast,
- polished.

Do not turn the UI into a generic dashboard.

---

# <span style="color:#92400E;">26. AI Agent Context Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Before modifying code:

1. Read this file.
2. Read relevant task.
3. Read architecture.
4. Inspect actual implementation.
5. Do not assume a planned feature already exists.
6. Do not assume a database model means the UI exists.
7. Do not assume a UI component means the backend supports it.
8. Keep planned, in-progress and completed work distinct.

---

# <span style="color:#92400E;">27. How to Update Memory</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

When a decision changes:

```md
## YYYY-MM-DD — Decision

### Decision
...

### Reason
...

### Impact
...

### Follow-up
...
```

Do not delete historical decisions unless they are genuinely obsolete and the replacement is documented.

---

# <span style="color:#92400E;">28. Final Product Definition</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

WaveChat is complete when the implementation satisfies the PRD, architecture, design system and security/testing requirements, not merely when the UI looks finished.

The final standard is:

```text
Feature
+ API
+ Database
+ Authorization
+ Real-time behavior
+ Error handling
+ Loading/empty states
+ Responsive UI
+ Tests
+ Observability
+ Documentation
= Done
```

---

# <span style="color:#92400E;">29. Future Decision Log</span>
<div style="height:1px;background:linear-gradient(90deg,#F59E0B55,transparent);margin:10px 0 18px 0;"></div>

Add decisions here as the project evolves.

```text
[DATE] — [Decision]
Reason:
Impact:
Status:
```

<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#D97706,#F59E0B);margin:22px 0 0 0;"></div>
