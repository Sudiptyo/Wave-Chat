-- CreateEnum
CREATE TYPE "AiMessageRole" AS ENUM ('ai', 'user');

-- CreateEnum
CREATE TYPE "AiContentType" AS ENUM ('text', 'image', 'file');

-- CreateEnum
CREATE TYPE "AiPlanType" AS ENUM ('basic', 'pro', 'premium');

-- CreateEnum
CREATE TYPE "AiSubscriptionStatus" AS ENUM ('pending', 'paid', 'failed', 'rejected');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'resolved', 'rejected');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('spam', 'scam', 'harassment', 'insult', 'abuse', 'inappropriate', 'other');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('public', 'contacts', 'private');

-- CreateEnum
CREATE TYPE "LastSeenVisibility" AS ENUM ('everyone', 'contacts', 'nobody');

-- CreateEnum
CREATE TYPE "CallPrivacy" AS ENUM ('everyone', 'contacts', 'nobody');

-- CreateEnum
CREATE TYPE "GroupAddPermission" AS ENUM ('everyone', 'contacts', 'nobody');

-- CreateEnum
CREATE TYPE "ThemeType" AS ENUM ('system', 'light', 'dark');

-- CreateEnum
CREATE TYPE "FontSize" AS ENUM ('small', 'medium', 'large', 'extra_large');

-- CreateEnum
CREATE TYPE "MediaAutoDownload" AS ENUM ('never', 'wifi', 'wifi_and_mobile');

-- CreateEnum
CREATE TYPE "UploadQuality" AS ENUM ('standard', 'hd');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('audio', 'video');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('missed', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('private', 'group');

-- CreateEnum
CREATE TYPE "MuteType" AS ENUM ('24hours', '48hours', 'always', 'custom');

-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "GroupInviteStatus" AS ENUM ('pending', 'accepted', 'declined');

-- CreateEnum
CREATE TYPE "GroupJoinRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "GroupMemberRole" AS ENUM ('member', 'admin', 'owner');

-- CreateEnum
CREATE TYPE "GroupMemberStatus" AS ENUM ('active', 'banned', 'left', 'removed');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('image', 'video', 'voice', 'file');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'media', 'voice');

-- CreateEnum
CREATE TYPE "PinnedType" AS ENUM ('24hours', '48hours', 'always', 'custom');

-- CreateEnum
CREATE TYPE "MessageStatusType" AS ENUM ('sent', 'delivered', 'read');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('friend_request', 'message', 'mention', 'call', 'group_invite');

-- CreateEnum
CREATE TYPE "NotificationReferenceType" AS ENUM ('friend_request', 'group_invite', 'message', 'call', 'conversation');

-- CreateEnum
CREATE TYPE "StoryPrivacy" AS ENUM ('public', 'close_friends', 'private');

-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('text', 'image', 'video', 'voice');

-- CreateTable
CREATE TABLE "ai_chats" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "chatName" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" UUID NOT NULL,
    "chatId" UUID NOT NULL,
    "role" "AiMessageRole" NOT NULL,
    "content" VARCHAR(5000) NOT NULL,
    "contentType" "AiContentType" NOT NULL DEFAULT 'text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_plans" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "planType" "AiPlanType" NOT NULL,
    "description" VARCHAR(500),
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "amount" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_subscriptions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "amount" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "paymentLinkId" TEXT NOT NULL,
    "paymentId" TEXT,
    "status" "AiSubscriptionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "userAgent" VARCHAR(1000),
    "ipAddress" TEXT,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "lastActiveAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRevoked" BOOLEAN NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" UUID NOT NULL,
    "blockerId" UUID NOT NULL,
    "blockedId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "reporterId" UUID NOT NULL,
    "reportedUserId" UUID NOT NULL,
    "messageId" UUID,
    "conversationId" UUID,
    "groupId" UUID,
    "storyId" UUID,
    "reason" "ReportType" NOT NULL,
    "description" VARCHAR(1000),
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "loginAlerts" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorAuthentication" BOOLEAN NOT NULL DEFAULT false,
    "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'public',
    "lastSeenVisibility" "LastSeenVisibility" NOT NULL DEFAULT 'contacts',
    "onlineStatus" BOOLEAN NOT NULL DEFAULT true,
    "readReceipts" BOOLEAN NOT NULL DEFAULT true,
    "typingIndicator" BOOLEAN NOT NULL DEFAULT true,
    "profilePhotoVisibility" "ProfileVisibility" NOT NULL DEFAULT 'contacts',
    "aboutVisibility" "ProfileVisibility" NOT NULL DEFAULT 'contacts',
    "statusVisibility" "ProfileVisibility" NOT NULL DEFAULT 'contacts',
    "callsPrivacy" "CallPrivacy" NOT NULL DEFAULT 'contacts',
    "groupsAddPermission" "GroupAddPermission" NOT NULL DEFAULT 'contacts',
    "enterToSend" BOOLEAN NOT NULL DEFAULT true,
    "sendWithCtrlEnter" BOOLEAN NOT NULL DEFAULT false,
    "linkPreviews" BOOLEAN NOT NULL DEFAULT true,
    "saveToGallery" BOOLEAN NOT NULL DEFAULT true,
    "disappearingMessages" BOOLEAN NOT NULL DEFAULT false,
    "archiveChats" BOOLEAN NOT NULL DEFAULT false,
    "theme" "ThemeType" NOT NULL DEFAULT 'system',
    "accentColor" TEXT NOT NULL DEFAULT '#7C3AED',
    "fontSize" "FontSize" NOT NULL DEFAULT 'medium',
    "chatWallpaper" TEXT,
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "animations" BOOLEAN NOT NULL DEFAULT true,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "messageNotifications" BOOLEAN NOT NULL DEFAULT true,
    "groupNotifications" BOOLEAN NOT NULL DEFAULT true,
    "friendRequestNotifications" BOOLEAN NOT NULL DEFAULT true,
    "callNotifications" BOOLEAN NOT NULL DEFAULT true,
    "storyNotifications" BOOLEAN NOT NULL DEFAULT true,
    "aiNotifications" BOOLEAN NOT NULL DEFAULT true,
    "sound" BOOLEAN NOT NULL DEFAULT true,
    "vibration" BOOLEAN NOT NULL DEFAULT true,
    "desktopNotifications" BOOLEAN NOT NULL DEFAULT true,
    "showPreview" BOOLEAN NOT NULL DEFAULT true,
    "notificationTone" TEXT,
    "mobileDataAutoDownload" "MediaAutoDownload" NOT NULL DEFAULT 'wifi',
    "wifiAutoDownload" "MediaAutoDownload" NOT NULL DEFAULT 'wifi_and_mobile',
    "roamingAutoDownload" "MediaAutoDownload" NOT NULL DEFAULT 'never',
    "uploadQuality" "UploadQuality" NOT NULL DEFAULT 'standard',
    "downloadMediaAutomatically" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'en',
    "translationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "avatar" TEXT,
    "fullName" TEXT NOT NULL,
    "userName" VARCHAR(100) NOT NULL,
    "mobileNo" VARCHAR(15) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "about" TEXT,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'inactive',
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credits" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_logs" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "callerId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,
    "type" "CallType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "status" "CallStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "contactedId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archives" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "archivedBy" UUID NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "createdBy" UUID NOT NULL,
    "conversationType" "ConversationType" NOT NULL DEFAULT 'private',
    "privateParticipantKey" TEXT,
    "lastMessageId" UUID,
    "lastMessageAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_mutes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "muteType" "MuteType" NOT NULL DEFAULT '24hours',
    "muteUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_mutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_requests" (
    "id" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,
    "conversationId" UUID,
    "message" VARCHAR(500) NOT NULL DEFAULT 'Hey 👋 I''d like to connect with you on WaveChat',
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'pending',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_chats" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "createdBy" UUID NOT NULL,
    "avatar" TEXT,
    "groupName" TEXT NOT NULL,
    "description" TEXT,
    "memberCount" INTEGER NOT NULL DEFAULT 1,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "requiresJoiningApproval" BOOLEAN NOT NULL DEFAULT false,
    "adminCount" INTEGER NOT NULL DEFAULT 1,
    "lastMessageId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "trackReadStatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_invites" (
    "id" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "invitedBy" UUID NOT NULL,
    "invitedUserId" UUID NOT NULL,
    "status" "GroupInviteStatus" NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_join_requests" (
    "id" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "GroupJoinRequestStatus" NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "GroupMemberRole" NOT NULL DEFAULT 'member',
    "status" "GroupMemberStatus" NOT NULL DEFAULT 'active',
    "nickname" VARCHAR(50),
    "bannedAt" TIMESTAMP(3),
    "bannedBy" UUID,
    "banReason" VARCHAR(500),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachments" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "attachmentType" "AttachmentType" NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" VARCHAR(255),
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "caption" VARCHAR(5000),
    "duration" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_mentions" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "replyToId" UUID,
    "storyId" UUID,
    "messageType" "MessageType" NOT NULL DEFAULT 'text',
    "content" VARCHAR(50000),
    "forwardedFromId" UUID,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pinned_items" (
    "id" UUID NOT NULL,
    "pinnedBy" UUID NOT NULL,
    "conversationId" UUID,
    "messageId" UUID,
    "pinnedType" "PinnedType" NOT NULL DEFAULT '24hours',
    "pinnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pinned_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_statuses" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "MessageStatusType" NOT NULL DEFAULT 'sent',
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "senderId" UUID,
    "receiverId" UUID NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "referenceId" UUID NOT NULL,
    "referenceType" "NotificationReferenceType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "notificationExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "storyType" "StoryType" NOT NULL DEFAULT 'text',
    "mediaUrl" TEXT,
    "textContent" TEXT,
    "privacy" "StoryPrivacy" NOT NULL DEFAULT 'public',
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "loveCount" INTEGER NOT NULL DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '24 hours',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_excluded_users" (
    "id" UUID NOT NULL,
    "storyId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "story_excluded_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_allowed_users" (
    "id" UUID NOT NULL,
    "storyId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "story_allowed_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_views" (
    "id" UUID NOT NULL,
    "storyId" UUID NOT NULL,
    "viewerId" UUID NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isLoved" BOOLEAN NOT NULL DEFAULT false,
    "lovedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_chats_userId_updatedAt_idx" ON "ai_chats"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "ai_messages_chatId_createdAt_idx" ON "ai_messages"("chatId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ai_plans_name_key" ON "ai_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ai_plans_planType_key" ON "ai_plans"("planType");

-- CreateIndex
CREATE UNIQUE INDEX "ai_subscriptions_paymentLinkId_key" ON "ai_subscriptions"("paymentLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_subscriptions_paymentId_key" ON "ai_subscriptions"("paymentId");

-- CreateIndex
CREATE INDEX "ai_subscriptions_userId_idx" ON "ai_subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_sessionId_key" ON "auth_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "auth_sessions_sessionId_idx" ON "auth_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "auth_sessions_isRevoked_idx" ON "auth_sessions"("isRevoked");

-- CreateIndex
CREATE INDEX "auth_sessions_expiresAt_idx" ON "auth_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "blocks_blockerId_idx" ON "blocks"("blockerId");

-- CreateIndex
CREATE INDEX "blocks_blockedId_idx" ON "blocks"("blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_blockerId_blockedId_key" ON "blocks"("blockerId", "blockedId");

-- CreateIndex
CREATE INDEX "reports_status_createdAt_idx" ON "reports"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "reports_reportedUserId_createdAt_idx" ON "reports"("reportedUserId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "reports_reporterId_createdAt_idx" ON "reports"("reporterId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobileNo_key" ON "users"("mobileNo");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_lastSeen_idx" ON "users"("lastSeen");

-- CreateIndex
CREATE INDEX "call_logs_callerId_startedAt_idx" ON "call_logs"("callerId", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "call_logs_receiverId_startedAt_idx" ON "call_logs"("receiverId", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "call_logs_conversationId_startedAt_idx" ON "call_logs"("conversationId", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "contacts_userId_idx" ON "contacts"("userId");

-- CreateIndex
CREATE INDEX "contacts_contactedId_idx" ON "contacts"("contactedId");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_userId_contactedId_key" ON "contacts"("userId", "contactedId");

-- CreateIndex
CREATE INDEX "archives_archivedBy_archivedAt_idx" ON "archives"("archivedBy", "archivedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "archives_conversationId_archivedBy_key" ON "archives"("conversationId", "archivedBy");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_privateParticipantKey_key" ON "conversations"("privateParticipantKey");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_lastMessageId_key" ON "conversations"("lastMessageId");

-- CreateIndex
CREATE INDEX "conversations_isDeleted_lastMessageAt_idx" ON "conversations"("isDeleted", "lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "conversation_participants_userId_conversationId_idx" ON "conversation_participants"("userId", "conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participants_conversationId_userId_key" ON "conversation_participants"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "conversation_mutes_userId_muteUntil_idx" ON "conversation_mutes"("userId", "muteUntil");

-- CreateIndex
CREATE INDEX "conversation_mutes_muteUntil_idx" ON "conversation_mutes"("muteUntil");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_mutes_userId_conversationId_key" ON "conversation_mutes"("userId", "conversationId");

-- CreateIndex
CREATE INDEX "friend_requests_senderId_status_idx" ON "friend_requests"("senderId", "status");

-- CreateIndex
CREATE INDEX "friend_requests_receiverId_status_idx" ON "friend_requests"("receiverId", "status");

-- CreateIndex
CREATE INDEX "friend_requests_senderId_receiverId_idx" ON "friend_requests"("senderId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "group_chats_conversationId_key" ON "group_chats"("conversationId");

-- CreateIndex
CREATE INDEX "group_chats_createdBy_idx" ON "group_chats"("createdBy");

-- CreateIndex
CREATE INDEX "group_chats_groupName_idx" ON "group_chats"("groupName");

-- CreateIndex
CREATE INDEX "group_chats_isDeleted_createdAt_idx" ON "group_chats"("isDeleted", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "group_invites_groupId_invitedUserId_status_idx" ON "group_invites"("groupId", "invitedUserId", "status");

-- CreateIndex
CREATE INDEX "group_invites_invitedUserId_status_idx" ON "group_invites"("invitedUserId", "status");

-- CreateIndex
CREATE INDEX "group_invites_expiresAt_idx" ON "group_invites"("expiresAt");

-- CreateIndex
CREATE INDEX "group_join_requests_groupId_userId_status_idx" ON "group_join_requests"("groupId", "userId", "status");

-- CreateIndex
CREATE INDEX "group_join_requests_userId_status_idx" ON "group_join_requests"("userId", "status");

-- CreateIndex
CREATE INDEX "group_join_requests_groupId_status_idx" ON "group_join_requests"("groupId", "status");

-- CreateIndex
CREATE INDEX "group_join_requests_expiresAt_idx" ON "group_join_requests"("expiresAt");

-- CreateIndex
CREATE INDEX "group_members_groupId_status_idx" ON "group_members"("groupId", "status");

-- CreateIndex
CREATE INDEX "group_members_userId_status_idx" ON "group_members"("userId", "status");

-- CreateIndex
CREATE INDEX "group_members_groupId_role_idx" ON "group_members"("groupId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_groupId_userId_key" ON "group_members"("groupId", "userId");

-- CreateIndex
CREATE INDEX "message_attachments_messageId_createdAt_idx" ON "message_attachments"("messageId", "createdAt");

-- CreateIndex
CREATE INDEX "message_mentions_conversationId_messageId_idx" ON "message_mentions"("conversationId", "messageId");

-- CreateIndex
CREATE INDEX "message_mentions_userId_createdAt_idx" ON "message_mentions"("userId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "message_mentions_messageId_userId_key" ON "message_mentions"("messageId", "userId");

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "messages_senderId_createdAt_idx" ON "messages"("senderId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "messages_replyToId_idx" ON "messages"("replyToId");

-- CreateIndex
CREATE INDEX "messages_forwardedFromId_idx" ON "messages"("forwardedFromId");

-- CreateIndex
CREATE INDEX "pinned_items_conversationId_pinnedAt_idx" ON "pinned_items"("conversationId", "pinnedAt" DESC);

-- CreateIndex
CREATE INDEX "pinned_items_pinnedBy_conversationId_idx" ON "pinned_items"("pinnedBy", "conversationId");

-- CreateIndex
CREATE INDEX "pinned_items_pinnedBy_messageId_idx" ON "pinned_items"("pinnedBy", "messageId");

-- CreateIndex
CREATE INDEX "pinned_items_expireAt_idx" ON "pinned_items"("expireAt");

-- CreateIndex
CREATE INDEX "message_statuses_userId_status_idx" ON "message_statuses"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "message_statuses_messageId_userId_key" ON "message_statuses"("messageId", "userId");

-- CreateIndex
CREATE INDEX "notifications_receiverId_isRead_createdAt_idx" ON "notifications"("receiverId", "isRead", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "notifications_receiverId_createdAt_idx" ON "notifications"("receiverId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "notifications_notificationExpiresAt_idx" ON "notifications"("notificationExpiresAt");

-- CreateIndex
CREATE INDEX "reactions_messageId_idx" ON "reactions"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_messageId_userId_key" ON "reactions"("messageId", "userId");

-- CreateIndex
CREATE INDEX "stories_userId_createdAt_idx" ON "stories"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "stories_expiresAt_createdAt_idx" ON "stories"("expiresAt", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "story_excluded_users_storyId_userId_key" ON "story_excluded_users"("storyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "story_allowed_users_storyId_userId_key" ON "story_allowed_users"("storyId", "userId");

-- CreateIndex
CREATE INDEX "story_views_storyId_viewedAt_idx" ON "story_views"("storyId", "viewedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "story_views_storyId_viewerId_key" ON "story_views"("storyId", "viewerId");

-- AddForeignKey
ALTER TABLE "ai_chats" ADD CONSTRAINT "ai_chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ai_chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_subscriptions" ADD CONSTRAINT "ai_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_subscriptions" ADD CONSTRAINT "ai_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ai_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contactedId_fkey" FOREIGN KEY ("contactedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archives" ADD CONSTRAINT "archives_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archives" ADD CONSTRAINT "archives_archivedBy_fkey" FOREIGN KEY ("archivedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_mutes" ADD CONSTRAINT "conversation_mutes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_mutes" ADD CONSTRAINT "conversation_mutes_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_chats" ADD CONSTRAINT "group_chats_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_chats" ADD CONSTRAINT "group_chats_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_chats" ADD CONSTRAINT "group_chats_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_invites" ADD CONSTRAINT "group_invites_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_join_requests" ADD CONSTRAINT "group_join_requests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_join_requests" ADD CONSTRAINT "group_join_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_bannedBy_fkey" FOREIGN KEY ("bannedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_mentions" ADD CONSTRAINT "message_mentions_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_mentions" ADD CONSTRAINT "message_mentions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_mentions" ADD CONSTRAINT "message_mentions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_forwardedFromId_fkey" FOREIGN KEY ("forwardedFromId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinned_items" ADD CONSTRAINT "pinned_items_pinnedBy_fkey" FOREIGN KEY ("pinnedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinned_items" ADD CONSTRAINT "pinned_items_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinned_items" ADD CONSTRAINT "pinned_items_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_statuses" ADD CONSTRAINT "message_statuses_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_statuses" ADD CONSTRAINT "message_statuses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_excluded_users" ADD CONSTRAINT "story_excluded_users_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_excluded_users" ADD CONSTRAINT "story_excluded_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_allowed_users" ADD CONSTRAINT "story_allowed_users_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_allowed_users" ADD CONSTRAINT "story_allowed_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
