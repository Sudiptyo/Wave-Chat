<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#06B6D4,#0891B2);margin:0 0 22px 0;"></div>
# <span style="color:#155E75;">WaveChat — Product Requirements Document (PRD)</span>

**Document status:** <span style="display:inline-block;padding:3px 10px;border-radius:999px;background:#CFFAFE;color:#155E75;font-weight:700;">Target-state product definition</span>  
**Scope:** Full finished product, not limited to currently implemented features  
**Product:** WaveChat  
**Primary clients:** Web application  
**Primary stack context:** React + TypeScript + Vite frontend; Fastify + TypeScript backend; PostgreSQL + Prisma; Redis/queues; Socket.IO; Cloudinary; Google OAuth; JWT-based session management.

---

## <span style="color:#0891B2;">1. Product Overview</span>

WaveChat is a modern real-time social communication platform centered around private messaging, group conversations, social discovery, stories, notifications, profiles, privacy controls, and an integrated AI assistant.

The product should feel like a serious production application rather than a CRUD chat demo. Real-time behavior, authentication/session security, media handling, privacy, reliability, responsive UX, observability, and maintainability are first-class requirements.

### Product goals

1. Provide fast and reliable real-time communication.
2. Make discovering and connecting with other users simple.
3. Support both private and group communication.
4. Support rich messages and media.
5. Give users meaningful privacy, notification, and appearance controls.
6. Provide temporary social content through Stories.
7. Provide an integrated AI experience with credit-based usage.
8. Provide strong account/session security.
9. Remain maintainable as the codebase grows.
10. Be portfolio-quality and demonstrable as an industry-oriented full-stack system.

### Non-goals for the first finished release

- Native Android/iOS applications.
- End-to-end encryption unless explicitly designed and implemented as a separate security project.
- Large-scale enterprise multi-tenancy.
- Arbitrary third-party bots/plugins.
- Public anonymous messaging.

---

# <span style="color:#155E75;">2. Target Users</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

## <span style="color:#0891B2;">2.1 Registered user</span>

A user who can maintain a profile, discover other users, send/receive friend requests, communicate, create/join groups, publish stories, configure privacy, and use AI features.

## <span style="color:#0891B2;">2.2 Group administrator</span>

A user who manages group members, invitations, join requests, group information, moderation, and administrative permissions.

## <span style="color:#0891B2;">2.3 Platform administrator</span>

A privileged user who handles reports, account moderation, system-level configuration, and operational issues.

---

# <span style="color:#155E75;">3. Core Product Areas</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

## <span style="color:#0891B2;">3.1 Authentication and account lifecycle</span>

### Required

- Registration with local credentials.
- Login.
- Logout.
- Access-token authentication.
- Refresh-token/session rotation.
- Password hashing.
- Forgot-password flow.
- Reset-password flow.
- Email verification.
- Google authentication.
- Account status handling.
- Multi-device session management.
- Session revocation.
- Login/security alerts.
- Account deletion/deactivation flow.
- Protected routes.
- Authentication state restoration on application startup.

### Google authentication

The current backend already treats Google authentication as a separate provider and does not silently link a Google identity to an existing local account. Preserve that security behavior.

### Security requirements

- Never store plaintext passwords.
- Never store plaintext refresh tokens.
- Never expose sensitive authentication fields through API responses.
- Validate every authentication-sensitive request.
- Apply rate limits to login, registration, password reset, verification, and token endpoints.

---

# <span style="color:#155E75;">4. User Profiles</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Every user should have:

- Avatar.
- Full name.
- Unique username.
- Optional mobile number.
- Optional email.
- About/bio.
- Account status.
- Online/last-seen state according to privacy settings.
- Profile statistics where applicable.
- Joined/created date where appropriate.

### Profile actions

Depending on relationship/privacy:

- View profile.
- Add/remove contact.
- Send friend request.
- Accept/reject request.
- Block/unblock.
- Report user.
- Start conversation.
- View shared media/context where permitted.

---

# <span style="color:#155E75;">5. Contacts and Friend System</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

WaveChat should distinguish between:

- A user being discoverable.
- A user being in contacts.
- A friend request relationship.
- A conversation relationship.

### Required flows

- Search users.
- Add contact.
- Remove contact.
- Send friend request.
- Accept friend request.
- Reject friend request.
- Cancel pending request.
- View incoming requests.
- View outgoing requests.
- Block user.
- Unblock user.

Friend requests should be idempotent and must prevent invalid self-requests and duplicate active requests.

---

# <span style="color:#155E75;">6. Private Messaging</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Private conversations are the primary communication experience.

### Required

- Create/open private conversation.
- Send text messages.
- Receive messages in real time.
- Message history.
- Cursor/page-based history loading.
- Infinite scrolling.
- Optimistic UI where safe.
- Reply to a message.
- Edit own message.
- Delete message.
- Forward message.
- Add reactions.
- Remove/change reaction.
- Pin message.
- Unpin message.
- Mentions.
- Message delivery state.
- Read state.
- Typing indicators.
- Online presence.
- Last seen.
- Conversation mute.
- Conversation archive.
- Search within conversations.
- Shared media/files view.
- Unread counts.
- Last-message preview.
- Conversation sorting by latest activity.

### Message states

At minimum:

`SENT → DELIVERED → READ`

The UI must clearly distinguish pending/failed client-side transmission from server-confirmed states.

### Message editing

- Only the sender can edit their own message.
- Edited state must be visible.
- Editing should preserve message identity.
- The server is authoritative.

### Message deletion

Support the final product's chosen deletion policy:

- Delete for me.
- Delete for everyone within a defined policy window.

**TODO — Product decision required:** Define the exact deletion window and whether deleted content is hard-deleted or represented by a tombstone.

---

# <span style="color:#155E75;">7. Rich Media Messaging</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Messages may contain:

- Images.
- Videos.
- Voice messages.
- Files.
- Captions.
- Metadata such as MIME type, file size, duration, dimensions.

### Requirements

- Upload validation.
- File-type validation.
- File-size limits.
- Secure upload flow.
- Cloudinary/object-storage integration.
- Upload progress.
- Retry/cancel where practical.
- Preview before sending where appropriate.
- Thumbnail/preview generation.
- Safe URLs.
- Failed-upload recovery.
- Media auto-download preferences.
- Upload quality settings.

The existing database model supports image/video/voice/file attachments.

**TODO — Add later:** Final per-type file-size limits, accepted MIME types, image/video transcoding policy, storage folder conventions, signed URL policy, and retention policy.

---

# <span style="color:#155E75;">8. Groups</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Users should be able to create and manage group conversations.

### Group creation

- Group name.
- Group description.
- Group avatar.
- Private/public mode.
- Join approval mode.
- Read-status configuration.

### Group membership

Roles:

- OWNER
- ADMIN
- MEMBER

Statuses:

- ACTIVE
- BANNED
- LEFT
- REMOVED

### Group operations

- Invite users.
- Accept/decline invitations.
- Request to join.
- Approve/reject join requests.
- Add/remove members.
- Promote/demote admins.
- Leave group.
- Ban/unban members.
- Change group metadata.
- View member list.
- Mention members.
- Group-specific reporting.
- Group message history.

**TODO — Add later:** Define exact owner-transfer behavior, maximum group size, maximum admin count, public-group discovery rules, and whether banned users can rejoin.

---

# <span style="color:#155E75;">9. Stories</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Stories are temporary social content.

### Supported types

- Text.
- Image.
- Video.
- Voice.

### Required

- Create story.
- View stories.
- Story expiration.
- Story privacy.
- Story view tracking.
- Love/react to story.
- View story viewers where permitted.
- Archive expired stories if product policy requires it.
- Exclude specific users.
- Allow specific users.

### Privacy

Current data design supports:

- PUBLIC
- CLOSE_FRIENDS
- PRIVATE

The final UX must make the visibility choice understandable before publishing.

**TODO — Add later:** Define whether "PRIVATE" means only the owner, a custom audience, or another audience rule.

---

# <span style="color:#155E75;">10. Calls</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

WaveChat should support:

- One-to-one audio calls.
- One-to-one video calls.
- Call ringing.
- Accept.
- Reject.
- Missed calls.
- End call.
- Call duration.
- Call history.

The existing data model stores call logs but does not itself implement real-time WebRTC signaling.

**TODO — Add later:** Choose WebRTC signaling architecture, STUN/TURN provider, ICE policy, call timeout, reconnect behavior, device switching, camera/microphone permissions, and whether group calls are supported. Group calls are out of scope unless explicitly added.

---

# <span style="color:#155E75;">11. Notifications</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Notification types supported by the current model include:

- Friend request.
- Message.
- Mention.
- Call.
- Group invite.

### Required

- In-app notification list.
- Unread count.
- Mark read.
- Mark all read.
- Notification deep links.
- Notification expiration where configured.
- Notification preferences.

### Browser notifications

Support browser/desktop notifications according to user preferences and browser permission.

**TODO — Add later:** Choose Web Push provider/implementation and define VAPID key management.

---

# <span style="color:#155E75;">12. Search</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Search should support:

- Users.
- Usernames.
- Names.
- Conversations.
- Messages where permitted.

### Requirements

- Debounced search.
- Pagination.
- Empty states.
- Recent searches where desired.
- Search result ranking.
- Privacy-aware filtering.

**TODO — Add later:** Decide whether message search uses PostgreSQL full-text search initially or a dedicated search engine later.

---

# <span style="color:#155E75;">13. Privacy and Safety</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Users must have controls for:

- Profile visibility.
- Last-seen visibility.
- Online status.
- Read receipts.
- Typing indicators.
- Profile photo visibility.
- About visibility.
- Status/story visibility.
- Call privacy.
- Group-add permission.
- Block list.
- Report content/users.

### Reporting

Reports may target:

- User.
- Message.
- Conversation.
- Group.
- Story.

Report categories include:

- Spam.
- Scam.
- Harassment.
- Insult.
- Abuse.
- Inappropriate content.
- Other.

Admin workflows must support:

- Pending reports.
- Review.
- Resolve.
- Reject.
- Audit trail.

**TODO — Add later:** Define moderation escalation policy, evidence retention period, appeal workflow, and administrator permissions.

---

# <span style="color:#155E75;">14. Settings</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Settings should cover:

## <span style="color:#0891B2;">Account/security</span>

- Profile.
- Email/mobile.
- Password.
- Sessions/devices.
- Two-factor authentication.
- Login alerts.
- Account deletion/deactivation.

## <span style="color:#0891B2;">Privacy</span>

- Profile visibility.
- Last seen.
- Online status.
- Read receipts.
- Typing indicator.
- Calls.
- Group invitations/add permissions.

## <span style="color:#0891B2;">Chat</span>

- Enter-to-send.
- Ctrl+Enter behavior.
- Link previews.
- Archive behavior.
- Disappearing messages.
- Chat wallpaper.
- Compact mode.

## <span style="color:#0891B2;">Appearance</span>

- System/light/dark.
- Accent color.
- Font size.
- Animations.

## <span style="color:#0891B2;">Notifications</span>

- Global notifications.
- Message notifications.
- Group notifications.
- Friend-request notifications.
- Call notifications.
- Story notifications.
- AI notifications.
- Sound.
- Vibration.
- Desktop notifications.
- Preview.

## <span style="color:#0891B2;">Media</span>

- Auto-download by network type.
- Upload quality.
- Save-to-gallery behavior.

## <span style="color:#0891B2;">Language</span>

- Language selection.
- Translation toggle.

The current UserSettings model already provides a broad foundation for these controls.

---

# <span style="color:#155E75;">15. AI Assistant</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

WaveChat includes an AI assistant as a product module.

### Required

- Create AI chat.
- Rename AI chat.
- Send AI messages.
- Receive AI responses.
- Persist AI history.
- Support text/image/file content types where the selected model/provider permits it.
- Track user credits.
- Display remaining credits.
- Handle insufficient credits.
- Handle provider failures.
- AI usage logging.
- AI plan/subscription system.

### Plans

The current schema defines:

- BASIC
- PRO
- PREMIUM

and tracks:

- Plan amount.
- Currency.
- Credits.
- Active state.
- Subscription status.

**TODO — Add later:** Select the final AI provider/model(s), exact credit consumption formula, streaming strategy, context-window policy, attachment limits, moderation policy, plan pricing, payment provider, webhook verification, refund policy, and subscription renewal/cancellation behavior.

---

# <span style="color:#155E75;">16. Payments</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

The AI subscription model contains payment-link/payment-ID fields, but a complete payment integration is not established by the supplied project snapshot.

### Required before production

- Payment provider.
- Checkout creation.
- Payment verification.
- Webhook verification.
- Idempotency.
- Subscription state reconciliation.
- Failed payment handling.
- Refund handling.
- Invoice/receipt strategy.
- Credit allocation rules.

**TODO — Must be added later:** Payment provider decision and production webhook contract.

---

# <span style="color:#155E75;">17. Real-Time Architecture Requirements</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Real-time events should cover:

- New message.
- Message delivered.
- Message read.
- Typing started/stopped.
- Online/offline.
- Last-seen update.
- Friend request.
- Friend request response.
- Group invite.
- Group join request.
- Notification.
- Call signaling.
- Message reaction.
- Message edit/delete.
- Story-related events where useful.

The server must remain authoritative for permissions and state.

---

# <span style="color:#155E75;">18. Reliability Requirements</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

The finished product should handle:

- Temporary network failures.
- Duplicate requests.
- Client reconnects.
- Socket reconnects.
- Expired access tokens.
- Refresh-token rotation.
- Duplicate message submission.
- Upload failure.
- Provider failure.
- Database transient errors.
- Redis outage/degraded mode where practical.

Every critical mutation should have a clear idempotency strategy.

---

# <span style="color:#155E75;">19. Performance Requirements</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Target:

- Fast first render.
- Lazy-loaded route modules.
- Paginated conversations/messages.
- Infinite scrolling without loading entire histories.
- Optimized media.
- Efficient database indexes.
- Minimal unnecessary React rerenders.
- TanStack Query for server-state caching.
- Redux only for genuine client/global UI state.
- Socket events integrated without duplicating server state unnecessarily.

---

# <span style="color:#155E75;">20. Accessibility</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

The finished UI must support:

- Keyboard navigation.
- Visible focus states.
- Semantic buttons/inputs.
- Screen-reader labels.
- Accessible dialogs.
- Accessible error messages.
- Adequate contrast.
- Reduced-motion preference.
- Responsive layouts.

---

# <span style="color:#155E75;">21. Responsive Requirements</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Existing product direction:

- Desktop: `>= 1280px`
- Tablet: `768px–1279px`
- Mobile: `< 768px`

The chat experience must be redesigned intentionally for each range rather than simply shrinking the desktop UI.

---

# <span style="color:#155E75;">22. Definition of Done</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

WaveChat is considered product-complete only when:

- All documented user flows work end-to-end.
- Authentication/session security is production-ready.
- Private and group messaging work in real time.
- Media uploads are reliable.
- Stories work with expiration/privacy.
- Calls work if included in the release.
- Notifications work.
- Search works.
- Privacy/block/report systems work.
- AI chat and subscription flow work if enabled.
- Settings persist correctly.
- Loading/error/empty states exist.
- Mobile/tablet/desktop layouts are polished.
- Unit/integration/API/e2e coverage exists for critical paths.
- No known critical/high security issue remains.
- Observability and error logging are configured.
- Production deployment is reproducible.
- Database migrations are safe and documented.
- Documentation is complete.

---

# <span style="color:#155E75;">23. Items Requiring Your Input Later</span>
<div style="height:1px;background:linear-gradient(90deg,#06B6D455,transparent);margin:10px 0 18px 0;"></div>

Create a separate `PRODUCT_DECISIONS.md` later and finalize:

1. Final WaveChat branding/logo.
2. Exact color palette.
3. Domain name.
4. Email provider.
5. Payment provider.
6. AI provider/models.
7. AI credit calculation.
8. WebRTC/STUN/TURN provider.
9. Web Push/VAPID setup.
10. Maximum file sizes.
11. Maximum group size.
12. Message deletion policy.
13. Disappearing-message policy.
14. Story "private" semantics.
15. Data retention policy.
16. Account deletion policy.
17. Moderation/admin policy.
18. Analytics policy.
19. Deployment platform.
20. Production database/Redis providers.
21. Backup and disaster-recovery policy.
22. Terms/privacy/legal content.

<div style="height:7px;border-radius:999px;background:linear-gradient(90deg,#0891B2,#06B6D4);margin:22px 0 0 0;"></div>
