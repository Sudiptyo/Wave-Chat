<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#38BDF8,#0EA5E9);margin:0 0 22px 0;"></div>
# <span style="color:#075985;">WaveChat — System Architecture</span>

**Document status:** <span style="display:inline-block;padding:3px 10px;border-radius:999px;background:#E0F2FE;color:#075985;font-weight:700;">Target-state architecture</span>  
**Architecture style:** Modular full-stack web application with REST + real-time event transport  
**Primary database:** PostgreSQL  
**ORM:** Prisma  
**Backend:** Fastify + TypeScript  
**Frontend:** React + TypeScript + Vite  
**Real-time:** Socket.IO  
**Cache/async infrastructure:** Redis + queue worker  
**Media:** Cloudinary or approved object-storage abstraction

---

# <span style="color:#075985;">1. Architecture Goals</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

- Strong module boundaries.
- Clear ownership of state.
- Server-authoritative business rules.
- Real-time behavior without coupling the entire application to sockets.
- PostgreSQL as the source of truth for durable product state.
- Redis for ephemeral/high-frequency state and asynchronous work.
- TanStack Query for frontend server state.
- Redux for client-side global state that genuinely needs it.
- Explicit validation at API boundaries.
- Production-grade authentication/session management.
- Easy testing and future extraction of services if scale requires it.

---

# <span style="color:#075985;">2. High-Level Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

```text
┌─────────────────────────────────────────────┐
│                  Browser                    │
│                                             │
│  React + TypeScript + Vite                  │
│  ├─ React Router                            │
│  ├─ TanStack Query                          │
│  ├─ Redux Toolkit                           │
│  ├─ Socket.IO Client                        │
│  └─ WebRTC Client                           │
└───────────────────┬─────────────────────────┘
                    │ HTTPS
                    │ REST / JSON
                    ▼
┌─────────────────────────────────────────────┐
│                Fastify API                  │
│                                             │
│  Routes → Validation → Controllers          │
│           → Services → Repositories          │
│                         │                   │
│              ┌──────────┴──────────┐        │
│              ▼                     ▼        │
│         PostgreSQL              Redis       │
│           Prisma             cache/presence │
│              │                     │        │
│              └──────────┬──────────┘        │
│                         ▼                   │
│                   Socket.IO                 │
│                real-time events             │
└──────────────┬───────────┬──────────────────┘
               │           │
               ▼           ▼
        Cloudinary       Queue/Worker
        Media store      async jobs
                            │
                 ┌──────────┼───────────┐
                 ▼          ▼           ▼
              Email      Push        AI/other
```

---

# <span style="color:#075985;">3. Frontend Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

The supplied frontend already uses:

- React.
- TypeScript.
- Vite.
- React Router.
- TanStack Query.
- Redux Toolkit.
- Axios.
- React Hook Form.
- Zod.
- Tailwind CSS.
- Framer Motion.
- Lucide.
- React Toastify.
- React Tooltip.

The existing source organization separates API clients, components, hooks, layouts, pages, routes, store, types, and utilities. Preserve this modular intent. fileciteturn0file0L9-L18

## <span style="color:#0EA5E9;">Recommended ownership</span>

### TanStack Query

Use for server state:

- Current user.
- Profiles.
- Conversations.
- Messages.
- Notifications.
- Search results.
- Friend requests.
- Groups.
- Stories.
- AI chats.
- Settings retrieved from server.

### Redux Toolkit

Use only for genuine client/global state:

- Theme.
- UI state.
- Open dialogs/drawers.
- Active local conversation selection if needed.
- Temporary interaction state.
- Client-only preferences not persisted to server.

Do not copy every TanStack Query result into Redux.

### Socket.IO

Socket events should update/invalidate relevant query caches instead of creating a second permanent server-state store.

---

# <span style="color:#075985;">4. Backend Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Use a modular Fastify application.

Recommended logical layers:

```text
src/
├── Config/
├── Plugins/
├── Routes/
├── Controllers/
├── Services/
├── Repositories/
├── Schemas/
├── Interfaces/
├── Middlewares/
├── Events/
├── Socket/
├── Workers/
├── Jobs/
├── Utils/
├── Types/
└── App.ts
```

The supplied project already has Config, Controllers, Db, Interfaces, Middlewares, Models, Plugins, Routes, Schemas, Services, Utils, App, Server and Worker concepts. fileciteturn0file1L65-L201

---

# <span style="color:#075985;">5. Module Boundaries</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Recommended backend modules:

```text
Auth
Users
Contacts
Friends
Conversations
Messages
Groups
Stories
Reactions
Notifications
Calls
Search
Reports
Blocks
Settings
AI
Subscriptions
Media
Realtime
Admin
```

Each module should own:

- routes,
- schemas,
- controllers,
- services,
- repository/data access where needed,
- events,
- tests.

Avoid one enormous `user.service.ts` or `chat.service.ts`.

---

# <span style="color:#075985;">6. Request Flow</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

```text
HTTP Request
    ↓
Fastify route
    ↓
Authentication / authorization
    ↓
Zod validation
    ↓
Controller
    ↓
Service
    ↓
Repository / Prisma
    ↓
Domain event if needed
    ↓
Response
```

Controllers should coordinate HTTP concerns.

Services should contain business rules.

Repositories should contain reusable persistence queries where repository abstraction provides real value.

Do not create pointless repository wrappers around every one-line Prisma call.

---

# <span style="color:#075985;">7. Database Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

PostgreSQL is the durable source of truth.

The supplied schema already models:

- users,
- auth sessions,
- settings,
- conversations,
- conversation participants,
- messages,
- attachments,
- message status,
- mentions,
- pins,
- reactions,
- groups,
- group membership,
- group invites,
- join requests,
- stories,
- story views,
- notifications,
- friend requests,
- contacts,
- blocks,
- reports,
- calls,
- AI chats/messages,
- AI plans/subscriptions.

The current Prisma models show these relationships and indexes directly. fileciteturn0file1L3882828-L3888610

---

# <span style="color:#075985;">8. PostgreSQL Responsibilities</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Use PostgreSQL for:

- Users.
- Authentication sessions.
- Relationships.
- Conversations.
- Messages.
- Durable message state.
- Group membership.
- Stories.
- Notifications.
- Reports.
- Call logs.
- AI chat history.
- Subscription records.
- Settings.

Do not use Redis as the primary durable database.

---

# <span style="color:#075985;">9. Redis Responsibilities</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Redis should be used for short-lived/high-frequency data such as:

- Online presence.
- Typing indicators.
- Socket/session coordination.
- Rate limiting where appropriate.
- Hot caches.
- Temporary upload/session state.
- Distributed locks where truly needed.
- Queue backing store.

Redis data must have explicit TTLs.

---

# <span style="color:#075985;">10. Queue/Worker Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Long-running or retryable tasks should leave the HTTP request path.

Examples:

- Email delivery.
- Push notification delivery.
- Media processing.
- AI processing when asynchronous.
- Cleanup jobs.
- Story expiration cleanup.
- Expired notification cleanup.
- Expired invite cleanup.
- Expired mute/pin cleanup.
- Analytics aggregation.

Recommended:

```text
API → Redis-backed queue → Worker → external service/database
```

**TODO — Add later:** Final queue library and worker topology. The supplied project has a Worker entry point and Queue/Cache/Redis directories, but the final queue implementation is not yet represented in the snapshot.

---

# <span style="color:#075985;">11. Real-Time Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Socket.IO should be treated as an event transport, not the primary database.

## <span style="color:#0EA5E9;">Connection</span>

```text
Browser
  │
  │ authenticate
  ▼
Socket.IO gateway
  │
  ├── validate session
  ├── associate user/socket
  └── join appropriate rooms
```

## <span style="color:#0EA5E9;">Room strategy</span>

Recommended conceptual rooms:

```text
user:{userId}
conversation:{conversationId}
group:{groupId}
```

Do not blindly join users to arbitrary rooms without authorization.

---

# <span style="color:#075985;">12. Message Send Flow</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

```text
Client
  │
  ├─ optimistic message UI
  │
  └─ REST/Socket mutation
        ↓
   authenticate
        ↓
   authorize membership
        ↓
   validate payload
        ↓
   persist Message
        ↓
   persist attachments/status if needed
        ↓
   update Conversation.lastMessage
        ↓
   publish message.created
        ↓
   deliver to recipient sockets
        ↓
   invalidate/update TanStack Query cache
```

The database transaction should cover the durable state changes that must remain consistent.

---

# <span style="color:#075985;">13. Message Delivery/Read Flow</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

```text
SENT
 ↓
recipient receives event
 ↓
DELIVERED
 ↓
recipient opens/reads conversation
 ↓
READ
```

The server should verify that the recipient is actually authorized to update the corresponding status.

---

# <span style="color:#075985;">14. Presence</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Presence is ephemeral.

Recommended Redis structure:

```text
presence:user:{userId}
```

Possible data:

- online/offline.
- last heartbeat.
- active socket count.
- last active timestamp.

A user with multiple tabs/devices should remain online until all relevant sessions disconnect or expire.

**TODO — Add later:** Exact heartbeat interval and offline grace period.

---

# <span style="color:#075985;">15. Authentication Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

The supplied session implementation creates:

- access token,
- refresh token,
- session ID,
- hashed refresh token stored in the database,
- expiry,
- device/user-agent/IP metadata.

Preserve this design direction. fileciteturn0file1L4000000-L4003000

Recommended production flow:

```text
Login
 ↓
verify credentials
 ↓
create session
 ↓
issue short-lived access token
 ↓
issue refresh token
 ↓
store refresh-token hash
```

Refresh:

```text
refresh token
 ↓
verify signature
 ↓
lookup session
 ↓
verify not revoked/expired
 ↓
rotate refresh token
 ↓
hash/store new token
 ↓
issue new access token
```

Logout:

```text
revoke current session
```

Logout-all:

```text
revoke all user sessions
```

---

# <span style="color:#075985;">16. Authorization</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Authentication answers:

> Who are you?

Authorization answers:

> Are you allowed to perform this action?

Examples:

- Only conversation members can read its messages.
- Only message owners can edit their messages.
- Group admins can moderate group members.
- Only permitted users can view private stories.
- Only authorized users can see call information.
- Blocked relationships must be enforced across relevant features.

Authorization belongs on the server even when the UI hides an action.

---

# <span style="color:#075985;">17. Media Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Recommended flow:

```text
Client
 ↓
request upload / upload directly through approved mechanism
 ↓
validate type + size
 ↓
Cloudinary/storage
 ↓
return media metadata
 ↓
create MessageAttachment
 ↓
send message
```

The database stores metadata and URL/reference, not large binary media.

The current model already represents URL, filename, file size, MIME type, caption, duration, width and height. fileciteturn0file1L3882828-L3882828

---

# <span style="color:#075985;">18. Story Expiration</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Stories have an `expiresAt` field and a default 24-hour lifetime in the supplied model. fileciteturn0file1L3893000-L3893300

Use:

- database query filtering for active stories,
- scheduled cleanup/archive where required,
- no assumption that a client clock is authoritative.

---

# <span style="color:#075985;">19. Search Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Phase 1:

- PostgreSQL indexed search.
- Username/name search.
- Paginated results.
- Message search with appropriate indexing/full-text strategy.

Phase 2 if scale requires:

```text
PostgreSQL
   ↓
search index
```

**TODO — Add later:** Decide whether PostgreSQL FTS is enough for the finished portfolio deployment.

---

# <span style="color:#075985;">20. AI Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Recommended:

```text
Frontend
 ↓
AI API module
 ↓
credit authorization
 ↓
AI provider adapter
 ↓
provider
 ↓
persist AI message
 ↓
stream/return response
```

Create a provider abstraction:

```text
AIProvider
├── generate()
├── stream()
├── estimateUsage()
└── validateModel()
```

This prevents the rest of WaveChat from depending directly on one model vendor.

The current data model already separates AI chats/messages from AI plans/subscriptions. fileciteturn0file1L3882828-L3882828

---

# <span style="color:#075985;">21. Payments Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

```text
Client
 ↓
create checkout
 ↓
payment provider
 ↓
webhook
 ↓
verify signature
 ↓
idempotency check
 ↓
update subscription
 ↓
allocate credits
 ↓
notify user
```

Never trust the browser to declare a payment successful.

**TODO — Add later:** payment provider and exact webhook implementation.

---

# <span style="color:#075985;">22. Calls Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Recommended WebRTC flow:

```text
Caller
 ↓
Socket.IO signaling
 ↓
Receiver
 ↓
WebRTC offer/answer
 ↓
ICE candidates
 ↓
STUN/TURN
 ↓
peer connection
```

Call records are persisted separately from media transport.

The supplied `CallLog` model records conversation, caller, receiver, type, timestamps, duration and status. fileciteturn0file1L3886245-L3886245

---

# <span style="color:#075985;">23. Notifications Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Durable notification:

```text
business event
 ↓
notification service
 ↓
PostgreSQL notification
 ↓
Socket.IO real-time delivery
 ↓
optional Web Push
```

Do not make browser notification delivery the source of truth.

---

# <span style="color:#075985;">24. Error Handling</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Standard backend error shape:

```json
{
  "success": false,
  "error": {
    "code": "MESSAGE_NOT_FOUND",
    "message": "Message not found",
    "requestId": "..."
  }
}
```

Never leak:

- stack traces,
- database internals,
- JWT secrets,
- provider credentials,
- raw SQL,
- sensitive account fields.

---

# <span style="color:#075985;">25. Observability</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Required:

- Structured logs with Pino.
- Request IDs.
- Error tracking.
- API latency metrics.
- Database error visibility.
- Queue failure visibility.
- Socket connection metrics.
- AI usage/cost metrics.
- Authentication/security event logs.

**TODO — Add later:** Choose production error-monitoring/metrics stack.

---

# <span style="color:#075985;">26. Deployment Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Target:

```text
CDN/HTTPS
   │
Frontend hosting
   │
   └──── API domain ──── Fastify instances
                            │
                 ┌──────────┼─────────┐
                 ▼          ▼         ▼
             PostgreSQL   Redis    Storage
                                      │
                                  Cloudinary
```

For multiple backend instances:

- Socket.IO adapter/shared coordination may be required.
- Redis should coordinate distributed real-time state.
- Sessions remain database-backed.

---

# <span style="color:#075985;">27. Security Architecture</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

Mandatory:

- HTTPS in production.
- Helmet.
- CORS allowlist.
- Secure cookies where used.
- CSRF strategy appropriate to token/cookie architecture.
- Rate limiting.
- Input validation.
- Output sanitization where relevant.
- Secure upload validation.
- Password hashing.
- Refresh-token hashing.
- Secret management.
- Dependency auditing.
- Database least privilege.
- Admin authorization.
- Audit logs for sensitive operations.

---

# <span style="color:#075985;">28. Architecture Decisions Still Required</span>
<div style="height:1px;background:linear-gradient(90deg,#38BDF855,transparent);margin:10px 0 18px 0;"></div>

1. Final Socket.IO scaling strategy.
2. Redis provider.
3. Queue library and retry policy.
4. Cloudinary vs another object-storage abstraction.
5. WebRTC provider/STUN/TURN.
6. Payment provider.
7. AI provider.
8. Email provider.
9. Web Push implementation.
10. Error monitoring.
11. Metrics/tracing.
12. Production hosting.
13. Database backup strategy.
14. Search strategy.
15. Whether to retain Mongoose dependency/code.

**Important:** The supplied backend package currently includes both Prisma/PostgreSQL tooling and Mongoose-related dependencies. The final architecture should choose one authoritative persistence strategy for each domain; do not let legacy Mongoose and Prisma models silently coexist. fileciteturn0file1L3676138-L3676200

<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#0EA5E9,#38BDF8);margin:22px 0 0 0;"></div>
