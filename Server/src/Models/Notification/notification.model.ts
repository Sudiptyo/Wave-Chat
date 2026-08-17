import mongoose, { HydratedDocument, model, Schema, Types } from "mongoose";

export const Notification_Type = {
  FRIEND_REQUEST: "friend_request",
  MESSAGE: "message",
  MENTION: "mention",
  CALL: "call",
  GROUP_INVITE: "group_invite",
} as const;

export const Reference_Type = {
  FRIEND_REQUEST: "friend_request",
  GROUP_INVITE: "group_invite",
  MESSAGE: "message",
  CALL: "call",
  CONVERSATION: "conversation",
} as const;

export type NotificationType =
  (typeof Notification_Type)[keyof typeof Notification_Type];
export type ReferenceType =
  (typeof Reference_Type)[keyof typeof Reference_Type];

export interface INotification {
  senderId?: Types.ObjectId;
  receiverId: Types.ObjectId;
  notificationType: NotificationType;
  referenceId: Types.ObjectId;
  referenceType: ReferenceType;
  isRead: boolean;
  notificationExpiresAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notificationType: {
      type: String,
      enum: Object.values(Notification_Type),
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    referenceType: {
      type: String,
      enum: Object.values(Reference_Type),
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    notificationExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 }); // To quickly find unread notifications for a user, sorted by newest first
notificationSchema.index({ receiverId: 1, createdAt: -1 }); // To quickly find all notifications for a user, sorted by newest first
notificationSchema.index(
  { notificationExpiresAt: 1 },
  { expireAfterSeconds: 0, sparse: true },
); // Automatically delete expired notifications

notificationSchema.pre(
  "validate",
  function (this: HydratedDocument<INotification>) {
    if (
      this.senderId &&
      this.receiverId &&
      this.senderId.equals(this.receiverId)
    ) {
      throw new Error("Can't send notification to yourself");
    }
  },
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
