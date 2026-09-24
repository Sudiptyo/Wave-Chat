<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#22C55E,#16A34A);margin:0 0 22px 0;"></div>
# <span style="color:#166534;">WaveChat — Master Development Plan</span>

**Purpose:** Single source of truth for implementation progress.

Status values:

- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#E5E7EB;color:#374151;font-weight:800;">`TODO`</span>
- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#DBEAFE;color:#1D4ED8;font-weight:800;">`IN PROGRESS`</span>
- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#FEE2E2;color:#B91C1C;font-weight:800;">`BLOCKED`</span>
- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#DCFCE7;color:#166534;font-weight:800;">`DONE`</span>
- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#F3E8FF;color:#7E22CE;font-weight:800;">`DEFERRED`</span>

Priority:

- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#FEE2E2;color:#991B1B;font-weight:800;">`P0`</span> — required for a finished release.
- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#FEF3C7;color:#92400E;font-weight:800;">`P1`</span> — important product feature.
- <span style="display:inline-block;padding:1px 7px;border-radius:999px;background:#DBEAFE;color:#1E40AF;font-weight:800;">`P2`</span> — polish/secondary feature.

---

# <span style="color:#166534;">Phase 0 — Project Foundation</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Confirm final repository structure.
- [ ] P0 — Confirm frontend/backend package boundaries.
- [ ] P0 — Confirm PostgreSQL + Prisma as authoritative persistence.
- [ ] P0 — Remove/justify legacy Mongoose usage.
- [ ] P0 — Define environment-variable contract.
- [ ] P0 — Define development/production configuration.
- [ ] P0 — Establish formatting/linting standards.
- [ ] P0 — Establish API response/error contract.
- [ ] P0 — Establish logging strategy.
- [ ] P0 — Establish test infrastructure.
- [ ] P1 — Establish CI pipeline.
- [ ] P1 — Add dependency/security audit workflow.

---

# <span style="color:#166534;">Phase 1 — Frontend Foundation</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Finalize application shell.
- [ ] P0 — Finalize React Router route tree.
- [ ] P0 — Configure TanStack Query.
- [ ] P0 — Configure Redux Toolkit.
- [ ] P0 — Define Redux ownership rules.
- [ ] P0 — Configure Axios client.
- [ ] P0 — Configure auth-aware API handling.
- [ ] P0 — Add global error boundary.
- [ ] P0 — Add loading/empty/error primitives.
- [ ] P0 — Finalize theme system.
- [ ] P1 — Finalize reusable design system components.
- [ ] P1 — Accessibility baseline.
- [ ] P1 — Mobile navigation.

The supplied frontend already contains API, component, hook, layout, page, route, store, type, and utility boundaries. Preserve and refine them rather than replacing them wholesale. fileciteturn0file0L23-L148

---

# <span style="color:#166534;">Phase 2 — Authentication</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Registration.
- [ ] P0 — Login.
- [ ] P0 — Logout.
- [ ] P0 — Access-token handling.
- [ ] P0 — Refresh-token rotation.
- [ ] P0 — Session restoration.
- [ ] P0 — Session revocation.
- [ ] P0 — Logout all sessions.
- [ ] P0 — Forgot password.
- [ ] P0 — Reset password.
- [ ] P0 — Email verification.
- [ ] P0 — Google OAuth.
- [ ] P0 — Protected routes.
- [ ] P0 — Account status handling.
- [ ] P1 — Login alerts.
- [ ] P1 — Two-factor authentication.

---

# <span style="color:#166534;">Phase 3 — User/Profile</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Get current user.
- [ ] P0 — Get user by username/id.
- [ ] P0 — Edit profile.
- [ ] P0 — Upload avatar.
- [ ] P0 — Update about.
- [ ] P0 — Contact management.
- [ ] P0 — Profile privacy.
- [ ] P0 — Online/last-seen privacy.
- [ ] P1 — Profile statistics.
- [ ] P1 — Shared content/media.

---

# <span style="color:#166534;">Phase 4 — Contacts/Friends</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Search users.
- [ ] P0 — Add contact.
- [ ] P0 — Remove contact.
- [ ] P0 — Send friend request.
- [ ] P0 — Accept request.
- [ ] P0 — Reject request.
- [ ] P0 — Cancel request.
- [ ] P0 — Incoming request list.
- [ ] P0 — Outgoing request list.
- [ ] P0 — Block user.
- [ ] P0 — Unblock user.
- [ ] P0 — Enforce block rules across messaging/search/privacy.

---

# <span style="color:#166534;">Phase 5 — Conversations</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Create/open private conversation.
- [ ] P0 — Prevent duplicate private conversations.
- [ ] P0 — Conversation list.
- [ ] P0 — Latest-message ordering.
- [ ] P0 — Unread counts.
- [ ] P0 — Archive conversation.
- [ ] P0 — Unarchive conversation.
- [ ] P0 — Mute conversation.
- [ ] P0 — Custom mute duration.
- [ ] P0 — Conversation settings.
- [ ] P0 — Conversation authorization.

---

# <span style="color:#166534;">Phase 6 — Messaging</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Send text.
- [ ] P0 — Message history pagination.
- [ ] P0 — Infinite scroll.
- [ ] P0 — Real-time receive.
- [ ] P0 — Sent state.
- [ ] P0 — Delivered state.
- [ ] P0 — Read state.
- [ ] P0 — Typing indicator.
- [ ] P0 — Reply.
- [ ] P0 — Edit.
- [ ] P0 — Delete.
- [ ] P0 — Forward.
- [ ] P0 — Reaction.
- [ ] P0 — Remove/change reaction.
- [ ] P0 — Pin.
- [ ] P0 — Unpin.
- [ ] P0 — Mentions.
- [ ] P0 — Retry failed send.
- [ ] P0 — Duplicate-send protection.
- [ ] P1 — Message search.
- [ ] P1 — Shared media/files panel.
- [ ] P1 — Link previews.

---

# <span style="color:#166534;">Phase 7 — Media</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Upload abstraction.
- [ ] P0 — Cloudinary/storage integration.
- [ ] P0 — Image upload.
- [ ] P0 — Video upload.
- [ ] P0 — File upload.
- [ ] P1 — Voice-message upload.
- [ ] P0 — MIME validation.
- [ ] P0 — File-size validation.
- [ ] P0 — Upload progress.
- [ ] P0 — Upload failure/retry.
- [ ] P1 — Image preview.
- [ ] P1 — Video thumbnail/preview.
- [ ] P1 — Media auto-download settings.
- [ ] P1 — Upload quality settings.

---

# <span style="color:#166534;">Phase 8 — Groups</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Create group.
- [ ] P0 — Edit group.
- [ ] P0 — Group avatar.
- [ ] P0 — Group description.
- [ ] P0 — Group privacy.
- [ ] P0 — Invite members.
- [ ] P0 — Accept/decline invite.
- [ ] P0 — Join request.
- [ ] P0 — Approve/reject request.
- [ ] P0 — Leave group.
- [ ] P0 — Remove member.
- [ ] P0 — Ban member.
- [ ] P0 — Unban member.
- [ ] P0 — Promote admin.
- [ ] P0 — Demote admin.
- [ ] P0 — Owner rules.
- [ ] P0 — Group authorization.
- [ ] P1 — Group member nicknames.
- [ ] P1 — Group-specific settings.

---

# <span style="color:#166534;">Phase 9 — Stories</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Create text story.
- [ ] P0 — Create image story.
- [ ] P0 — Create video story.
- [ ] P1 — Voice story.
- [ ] P0 — Story feed.
- [ ] P0 — Story viewer.
- [ ] P0 — 24-hour expiration.
- [ ] P0 — Story privacy.
- [ ] P0 — Story exclusions.
- [ ] P0 — Story allowed-users list.
- [ ] P0 — Story view tracking.
- [ ] P1 — Story love/reaction.
- [ ] P1 — Story archive.

---

# <span style="color:#166534;">Phase 10 — Calls</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P1 — WebRTC architecture.
- [ ] P1 — Signaling.
- [ ] P1 — STUN.
- [ ] P1 — TURN.
- [ ] P1 — Audio call.
- [ ] P1 — Video call.
- [ ] P1 — Ringing state.
- [ ] P1 — Accept.
- [ ] P1 — Reject.
- [ ] P1 — Missed call.
- [ ] P1 — End call.
- [ ] P1 — Call history.
- [ ] P1 — Reconnect handling.
- [ ] P2 — Device switching.

---

# <span style="color:#166534;">Phase 11 — Notifications</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Notification service.
- [ ] P0 — Friend request notification.
- [ ] P0 — Message notification.
- [ ] P0 — Mention notification.
- [ ] P0 — Call notification.
- [ ] P0 — Group invite notification.
- [ ] P0 — Real-time notification delivery.
- [ ] P0 — Notification list.
- [ ] P0 — Mark read.
- [ ] P0 — Mark all read.
- [ ] P0 — Unread count.
- [ ] P0 — Deep links.
- [ ] P1 — Browser push.
- [ ] P1 — Notification preferences.

---

# <span style="color:#166534;">Phase 12 — Search</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — User search.
- [ ] P0 — Username search.
- [ ] P0 — Debounce.
- [ ] P0 — Pagination.
- [ ] P1 — Conversation search.
- [ ] P1 — Message search.
- [ ] P1 — Recent searches.
- [ ] P1 — Search ranking.
- [ ] P2 — Dedicated search engine if required.

---

# <span style="color:#166534;">Phase 13 — Privacy/Safety</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Block.
- [ ] P0 — Unblock.
- [ ] P0 — Report user.
- [ ] P0 — Report message.
- [ ] P0 — Report conversation.
- [ ] P0 — Report group.
- [ ] P0 — Report story.
- [ ] P0 — Report status lifecycle.
- [ ] P0 — Admin report queue.
- [ ] P1 — Admin moderation dashboard.
- [ ] P1 — Moderation audit trail.
- [ ] P1 — Appeal flow.

---

# <span style="color:#166534;">Phase 14 — Settings</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Account settings.
- [ ] P0 — Privacy settings.
- [ ] P0 — Security settings.
- [ ] P0 — Chat settings.
- [ ] P0 — Notification settings.
- [ ] P0 — Appearance settings.
- [ ] P0 — Media settings.
- [ ] P0 — Language settings.
- [ ] P1 — Two-factor authentication.
- [ ] P1 — Disappearing messages.
- [ ] P1 — Chat wallpaper.
- [ ] P1 — Compact mode.
- [ ] P1 — Translation toggle.

---

# <span style="color:#166534;">Phase 15 — AI</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P1 — AI provider abstraction.
- [ ] P1 — AI chat creation.
- [ ] P1 — AI history.
- [ ] P1 — AI message sending.
- [ ] P1 — Streaming.
- [ ] P1 — Text input.
- [ ] P1 — Image/file support where provider permits.
- [ ] P1 — Credit authorization.
- [ ] P1 — Credit consumption.
- [ ] P1 — AI error handling.
- [ ] P1 — AI usage logging.
- [ ] P1 — AI plan listing.
- [ ] P1 — Subscription creation.
- [ ] P1 — Payment integration.
- [ ] P1 — Payment webhook.
- [ ] P1 — Idempotent payment handling.
- [ ] P1 — Failed payment handling.
- [ ] P2 — Usage analytics.

---

# <span style="color:#166534;">Phase 16 — Async Infrastructure</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P1 — Redis setup.
- [ ] P1 — Queue setup.
- [ ] P1 — Worker process.
- [ ] P1 — Email jobs.
- [ ] P1 — Push jobs.
- [ ] P1 — Media jobs.
- [ ] P1 — Cleanup jobs.
- [ ] P1 — Retry strategy.
- [ ] P1 — Dead-letter/failure strategy.
- [ ] P1 — Queue monitoring.

---

# <span style="color:#166534;">Phase 17 — Testing</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Unit test infrastructure.
- [ ] P0 — API integration tests.
- [ ] P0 — Auth tests.
- [ ] P0 — Conversation tests.
- [ ] P0 — Message tests.
- [ ] P0 — Authorization tests.
- [ ] P0 — Group tests.
- [ ] P0 — Story tests.
- [ ] P0 — Notification tests.
- [ ] P0 — Block/report tests.
- [ ] P1 — AI tests.
- [ ] P1 — Payment webhook tests.
- [ ] P1 — Socket tests.
- [ ] P1 — Frontend component tests.
- [ ] P1 — E2E tests.
- [ ] P1 — Mobile responsive E2E tests.

---

# <span style="color:#166534;">Phase 18 — Security</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Threat model.
- [ ] P0 — Dependency audit.
- [ ] P0 — Rate limits.
- [ ] P0 — Upload security.
- [ ] P0 — Auth security review.
- [ ] P0 — Authorization matrix.
- [ ] P0 — CORS review.
- [ ] P0 — Helmet/security headers.
- [ ] P0 — Secret-management review.
- [ ] P0 — SQL/ORM query review.
- [ ] P0 — XSS/content sanitization review.
- [ ] P0 — Session fixation/rotation review.
- [ ] P1 — Penetration/security testing.

---

# <span style="color:#166534;">Phase 19 — Performance</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P1 — Frontend bundle analysis.
- [ ] P1 — Route lazy loading.
- [ ] P1 — Image optimization.
- [ ] P1 — Message virtualization if needed.
- [ ] P1 — Database query profiling.
- [ ] P1 — Index review.
- [ ] P1 — Redis caching.
- [ ] P1 — Socket scalability review.
- [ ] P1 — Load testing.
- [ ] P2 — Advanced CDN/media optimization.

---

# <span style="color:#166534;">Phase 20 — Observability</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Structured logging.
- [ ] P0 — Request IDs.
- [ ] P1 — Error tracking.
- [ ] P1 — API latency metrics.
- [ ] P1 — Database metrics.
- [ ] P1 — Redis metrics.
- [ ] P1 — Queue metrics.
- [ ] P1 — Socket metrics.
- [ ] P1 — AI usage/cost metrics.
- [ ] P1 — Security event logging.

---

# <span style="color:#166534;">Phase 21 — Deployment</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Production environment configuration.
- [ ] P0 — Frontend build.
- [ ] P0 — Backend build.
- [ ] P0 — Database migration process.
- [ ] P0 — HTTPS.
- [ ] P0 — CORS production configuration.
- [ ] P0 — Secrets management.
- [ ] P1 — Redis production.
- [ ] P1 — Worker deployment.
- [ ] P1 — Health endpoints.
- [ ] P1 — Readiness/liveness strategy.
- [ ] P1 — Backups.
- [ ] P1 — Restore test.
- [ ] P1 — CI/CD.
- [ ] P2 — Horizontal scaling.

---

# <span style="color:#166534;">Phase 22 — Final Product QA</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — Full auth journey.
- [ ] P0 — Full private chat journey.
- [ ] P0 — Full group journey.
- [ ] P0 — Full media journey.
- [ ] P0 — Full story journey.
- [ ] P1 — Full call journey.
- [ ] P0 — Full notification journey.
- [ ] P0 — Full privacy journey.
- [ ] P0 — Full settings journey.
- [ ] P1 — Full AI journey.
- [ ] P1 — Full payment journey.
- [ ] P0 — Mobile QA.
- [ ] P0 — Tablet QA.
- [ ] P0 — Desktop QA.
- [ ] P0 — Accessibility QA.
- [ ] P0 — Security QA.
- [ ] P0 — Performance QA.
- [ ] P0 — Production smoke test.

---

# <span style="color:#166534;">Phase 23 — Documentation</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] P0 — README.
- [ ] P0 — Environment setup guide.
- [ ] P0 — API documentation.
- [ ] P0 — Architecture documentation.
- [ ] P0 — Database documentation.
- [ ] P0 — Deployment documentation.
- [ ] P0 — Troubleshooting guide.
- [ ] P1 — Contribution guide.
- [ ] P1 — ADRs for major architecture decisions.

---

# <span style="color:#166534;">Current Snapshot Notes</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

The supplied frontend is currently structurally prepared for auth/chat/feed/notifications/profile/search/settings and uses React, TypeScript, Vite, TanStack Query, Redux Toolkit and related UI libraries. fileciteturn0file0L23-L153

The supplied backend has a much broader target data model covering authentication, conversations, messages, groups, stories, notifications, calls, reports, contacts and AI. fileciteturn0file1L11-L42

Therefore this task list intentionally describes the **finished product**, not merely the next coding task.

---

# <span style="color:#166534;">Decisions Blocking Certain Tasks</span>
<div style="height:1px;background:linear-gradient(90deg,#22C55E55,transparent);margin:10px 0 18px 0;"></div>

- [ ] Final payment provider.
- [ ] Final AI provider/model.
- [ ] Final WebRTC/STUN/TURN provider.
- [ ] Final Web Push implementation.
- [ ] Final email provider.
- [ ] Final media limits.
- [ ] Final group limits.
- [ ] Final message deletion policy.
- [ ] Final story privacy semantics.
- [ ] Final production hosting.
- [ ] Final observability platform.
- [ ] Final moderation policy.

<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#16A34A,#22C55E);margin:22px 0 0 0;"></div>
