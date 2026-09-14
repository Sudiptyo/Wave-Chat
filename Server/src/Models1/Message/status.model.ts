import { model, Schema, Types } from "mongoose";

export const Message_Status = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
} as const;

export type MessageStatus =
  (typeof Message_Status)[keyof typeof Message_Status];

export interface IMessageStatus {
  messageId: Types.ObjectId;
  userId: Types.ObjectId;
  status: MessageStatus;
  deliveredAt?: Date;
  readAt?: Date;
}

const messageStatusSchema = new Schema<IMessageStatus>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Message_Status),
      default: Message_Status.SENT,
      required: true,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

messageStatusSchema.index({ messageId: 1, userId: 1 }, { unique: true }); // Ensure one status per user per message
messageStatusSchema.index({ userId: 1, status: 1 }); // To quickly find messages by user and status (e.g., all unread messages for a user)

export const MessageStatus = model<IMessageStatus>(
  "MessageStatus",
  messageStatusSchema,
);
