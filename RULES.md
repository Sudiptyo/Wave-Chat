<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#F43F5E,#E11D48);margin:0 0 22px 0;"></div>
# <span style="color:#9F1239;">WaveChat — AI + Engineering Rules</span>

**Purpose:** This file is the contract for humans and AI coding agents working on WaveChat.

---

# <span style="color:#9F1239;">1. Golden Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

1. Read `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `TASKS.md`, and `MEMORY.md` before making substantial changes.
2. Treat the documentation as the source of project intent.
3. Never invent a feature because it seems useful.
4. Never remove a feature without updating the PRD and task plan.
5. Prefer the smallest safe change that completes the requested task.
6. Do not rewrite unrelated files.
7. Do not replace working architecture merely because another technology is fashionable.
8. Never expose secrets.
9. Never bypass server-side authorization.
10. Never mark a task complete without verification.

---

# <span style="color:#9F1239;">2. AI Agent Operating Procedure</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Before coding:

```text
1. Understand request.
2. Read relevant docs.
3. Inspect existing implementation.
4. Identify affected modules.
5. Identify database/API implications.
6. Identify tests required.
7. State assumptions if anything is unspecified.
8. Implement minimal coherent change.
9. Run validation.
10. Update TASKS.md and MEMORY.md if project state changed.
```

If requirements conflict:

```text
PRD
 ↓
ARCHITECTURE
 ↓
DESIGN
 ↓
RULES
 ↓
TASKS
 ↓
existing implementation
```

If the conflict is a product decision rather than implementation detail, stop and place it in the `TODO — Product decision` section instead of guessing.

---

# <span style="color:#9F1239;">3. Never Guess Missing Product Decisions</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Use explicit placeholders:

```md
> TODO — USER INPUT REQUIRED:
> Decide whether ...
```

Do not silently choose:

- payment provider,
- AI model,
- WebRTC provider,
- retention policy,
- group limits,
- file limits,
- deletion policy,
- legal policy,
- production infrastructure.

---

# <span style="color:#9F1239;">4. Frontend Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

## <span style="color:#E11D48;">4.1 React</span>

- Use functional components.
- Use TypeScript.
- Prefer composition over giant components.
- Keep components focused.
- Avoid unnecessary `useEffect`.
- Do not use effects for derived values.
- Keep event handlers close to the UI behavior they control.
- Avoid prop drilling when a well-defined composition pattern is sufficient.
- Do not introduce a state library for one component's local state.

## <span style="color:#E11D48;">4.2 Server state</span>

Use TanStack Query for API/server state.

Examples:

- user profile,
- conversations,
- messages,
- notifications,
- search,
- stories,
- groups,
- AI chats.

Do not duplicate the same API data into Redux without a documented reason.

## <span style="color:#E11D48;">4.3 Redux</span>

Use Redux Toolkit for genuine client/global state:

- theme,
- global UI state,
- dialogs/drawers,
- local application state that spans unrelated components.

Do not turn Redux into a second backend cache.

## <span style="color:#E11D48;">4.4 Forms</span>

Use React Hook Form + Zod for complex validated forms.

Validate:

- registration,
- login,
- password reset,
- profile editing,
- group creation,
- settings,
- report forms,
- AI plan/checkout forms where applicable.

---

# <span style="color:#9F1239;">5. API Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

- Every endpoint must have explicit request validation.
- Every protected endpoint must authenticate.
- Every sensitive operation must authorize.
- Controllers should not contain large business workflows.
- Services own business logic.
- Responses must use consistent shapes.
- Never return passwords, token hashes, or sensitive internal fields.
- Use meaningful HTTP status codes.
- Make mutations idempotent where duplicate requests are possible.
- Document new endpoints.

---

# <span style="color:#9F1239;">6. Backend Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

The backend uses Fastify + TypeScript.

Prefer:

```text
Route
 → validation
 → auth
 → controller
 → service
 → persistence
```

Avoid:

```text
Route
 → 500-line handler
 → Prisma everywhere
```

Keep modules isolated.

---

# <span style="color:#9F1239;">7. Database Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

- PostgreSQL is the durable source of truth.
- Prisma is the authoritative ORM.
- Do not edit generated Prisma files.
- Do not manually modify generated client output.
- Use migrations for schema changes.
- Never modify an already-applied production migration destructively.
- Add indexes based on real query patterns.
- Add unique constraints for true invariants.
- Use foreign keys and explicit cascade/set-null behavior intentionally.
- Keep timestamps consistent.
- Prefer UUID identifiers where the existing schema does.
- Never store large binary media directly in normal relational rows.

The supplied project already separates Prisma schema/model definitions from generated client output; preserve that boundary. fileciteturn0file1L5-L64

---

# <span style="color:#9F1239;">8. Authentication Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

- Passwords must be hashed.
- Refresh tokens must not be stored in plaintext.
- Access tokens should be short-lived.
- Refresh sessions must be revocable.
- Validate session ownership.
- Revoke compromised sessions.
- Do not silently link Google accounts to existing local accounts.
- Do not trust client-provided user IDs for authorization.
- Derive authenticated identity from verified server-side credentials.

---

# <span style="color:#9F1239;">9. Authorization Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

For every mutation ask:

```text
Who is performing it?
What resource is being modified?
Does this user own or have permission for the resource?
Is the target still valid?
Is the user blocked?
Does privacy permit the operation?
```

Examples:

- Message edit → sender only.
- Group ban → authorized group admin/owner.
- Private story → audience rules.
- Conversation history → participant only.
- User report → authenticated user, valid target.
- Settings → owner only.

---

# <span style="color:#9F1239;">10. Real-Time Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Socket events are transport, not truth.

- Persist durable state first where appropriate.
- Emit events after successful state changes.
- Never trust a socket event as proof that a mutation succeeded.
- Authenticate socket connections.
- Authorize room membership.
- Avoid broadcasting sensitive data to broad rooms.
- Handle reconnects.
- Handle duplicate events safely.
- Keep event names consistent.

Recommended naming:

```text
message.created
message.updated
message.deleted
message.delivered
message.read
typing.started
typing.stopped
presence.updated
notification.created
friend-request.created
group.updated
call.incoming
call.accepted
call.rejected
call.ended
```

---

# <span style="color:#9F1239;">11. Redis Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Redis is not the permanent database.

Every temporary Redis key must have:

- a clear name,
- clear owner,
- explicit TTL where appropriate,
- documented invalidation behavior.

Do not cache data unless you know:

- why it is cached,
- when it expires,
- what happens when it is stale,
- what happens when Redis is unavailable.

---

# <span style="color:#9F1239;">12. Queue Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Jobs must be:

- idempotent,
- retry-safe,
- observable,
- bounded,
- explicit about retry count,
- explicit about failure behavior.

Never enqueue a job containing secrets or unnecessary personal data.

---

# <span style="color:#9F1239;">13. Media Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Validate uploads server-side.

Never trust:

- filename,
- extension,
- client MIME type,
- client file size.

Use actual file-type detection where appropriate.

Store only metadata/references in PostgreSQL.

---

# <span style="color:#9F1239;">14. Security Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Never commit:

```text
.env
private keys
JWT secrets
database credentials
Cloudinary secrets
Google client secrets
payment secrets
AI provider keys
VAPID private keys
```

Use environment variables or secret management.

Do not log:

- passwords,
- access tokens,
- refresh tokens,
- authorization headers,
- raw payment credentials,
- sensitive personal data.

---

# <span style="color:#9F1239;">15. Error Handling Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Every error must be classified.

Examples:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
RATE_LIMITED
DEPENDENCY_ERROR
INTERNAL_ERROR
```

Do not expose internal implementation details to users.

Log enough server-side context to debug.

---

# <span style="color:#9F1239;">16. TypeScript Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

- `strict` mode remains enabled.
- Avoid `any`.
- Prefer `unknown` for unknown errors.
- Use discriminated unions for state machines.
- Keep API types explicit.
- Avoid duplicated incompatible type definitions.
- Prefer shared schemas/types where safe.
- Do not suppress TypeScript errors without a documented reason.

---

# <span style="color:#9F1239;">17. Naming Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Use:

- `camelCase` for variables/functions.
- `PascalCase` for React components/classes/types where appropriate.
- Descriptive names.
- Domain-specific names.

Avoid:

```text
data
thing
temp
foo
bar
x
```

unless the scope is genuinely trivial.

---

# <span style="color:#9F1239;">18. Component Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

A component should have one clear responsibility.

Split components when:

- JSX becomes difficult to understand.
- A block is reused.
- A feature has independent state.
- Testing becomes difficult.
- Conditional rendering becomes deeply nested.

Do not split components merely to create hundreds of tiny files with no meaningful boundary.

---

# <span style="color:#9F1239;">19. API Client Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Keep endpoint definitions centralized where appropriate.

The supplied frontend already has API modules for authentication, chat, comments, messages, notifications, posts, search, and users. fileciteturn0file0L9-L18

New APIs should follow the same organizational pattern.

---

# <span style="color:#9F1239;">20. Query Key Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Use stable, descriptive query keys.

Example:

```ts
["user", "me"]
["conversation", conversationId]
["conversation", conversationId, "messages"]
["notifications", { unreadOnly }]
["group", groupId, "members"]
```

Never create inconsistent keys for the same resource.

---

# <span style="color:#9F1239;">21. Cache Invalidation Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

After a mutation, update or invalidate the smallest relevant cache.

Do not invalidate the entire application after every message.

Prefer targeted updates.

---

# <span style="color:#9F1239;">22. UI Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Every asynchronous feature must consider:

- loading,
- success,
- empty,
- error,
- retry,
- disabled,
- permission-denied,
- offline/reconnecting where relevant.

No blank screens for ordinary failures.

---

# <span style="color:#9F1239;">23. Accessibility Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

- Buttons must be buttons.
- Inputs need labels.
- Icon-only actions need accessible labels.
- Modals must trap/focus correctly.
- Keyboard navigation must work.
- Do not rely solely on color to communicate state.
- Respect reduced-motion preferences.

---

# <span style="color:#9F1239;">24. Testing Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Critical flows require automated tests.

Minimum high-value coverage:

### Auth

- registration,
- login,
- refresh,
- logout,
- revoke session,
- Google auth,
- password reset.

### Messaging

- send,
- read,
- delivery,
- edit,
- delete,
- reaction,
- reply,
- attachment,
- authorization.

### Groups

- create,
- invite,
- join request,
- member permissions,
- leave,
- ban.

### Stories

- create,
- privacy,
- view,
- expiration.

### Safety

- block,
- report.

### AI

- credit check,
- AI message,
- provider failure,
- subscription state.

---

# <span style="color:#9F1239;">25. Git Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Use small, focused commits.

Recommended style:

```text
feat(auth): add refresh token rotation
feat(chat): add message reactions
fix(chat): prevent duplicate message submission
refactor(groups): isolate membership service
test(auth): add session revocation tests
docs(architecture): define socket room strategy
```

Do not mix:

```text
feature + unrelated refactor + formatting + dependency upgrade
```

unless necessary.

---

# <span style="color:#9F1239;">26. Dependency Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Before adding a dependency:

1. Check whether existing libraries already solve the problem.
2. Check maintenance/security status.
3. Check bundle/runtime cost.
4. Check compatibility with the architecture.
5. Add only if justified.

The frontend already has a substantial dependency set including TanStack Query, Redux Toolkit, Axios, React Router, React Hook Form, Zod, Tailwind, and Framer Motion. fileciteturn0file0L228-L246

---

# <span style="color:#9F1239;">27. AI Coding Agent Rules</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

An AI agent must never:

- delete working modules without justification,
- rewrite the whole project to solve a local issue,
- change database architecture without approval,
- invent API contracts,
- invent environment variables,
- invent credentials,
- silently install large dependencies,
- bypass tests,
- mark incomplete work as complete.

When unsure:

```text
STOP → identify ambiguity → document it → ask for decision
```

---

# <span style="color:#9F1239;">28. Completion Checklist</span>
<div style="height:1px;background:linear-gradient(90deg,#F43F5E55,transparent);margin:10px 0 18px 0;"></div>

Before declaring a task complete:

- [ ] Implementation complete.
- [ ] TypeScript passes.
- [ ] Lint passes.
- [ ] Tests pass.
- [ ] Relevant API contract updated.
- [ ] UI states handled.
- [ ] Authorization checked.
- [ ] Security implications reviewed.
- [ ] Database migration created if needed.
- [ ] Documentation updated.
- [ ] TASKS.md updated.
- [ ] MEMORY.md updated if architecture/project state changed.

<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#E11D48,#F43F5E);margin:22px 0 0 0;"></div>
