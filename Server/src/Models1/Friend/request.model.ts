import mongoose, { HydratedDocument, model, Schema, Types } from "mongoose";

export const Friend_Request_Status = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type FriendRequestStatus =
  (typeof Friend_Request_Status)[keyof typeof Friend_Request_Status];

export interface IFriendRequest {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  conversationId?: Types.ObjectId;
  message: string;
  status: FriendRequestStatus;
  respondedAt?: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "Hey 👋 I'd like to connect with you on WaveChat",
    },
    status: {
      type: String,
      enum: Object.values(Friend_Request_Status),
      default: Friend_Request_Status.PENDING,
      required: true,
    },
    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

friendRequestSchema.index(
  { senderId: 1, receiverId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: Friend_Request_Status.PENDING },
  },
); // Prevent duplicate friend requests between the same users
friendRequestSchema.index({ senderId: 1, status: 1 }); // To quickly find pending requests sent by a user
friendRequestSchema.index({ receiverId: 1, status: 1 }); // To quickly find pending requests received by a user

friendRequestSchema.pre(
  "validate",
  function (this: HydratedDocument<IFriendRequest>) {
    if (
      this.senderId &&
      this.receiverId &&
      this.senderId.equals(this.receiverId)
    ) {
      // Prevent users from sending friend requests to themselves
      throw new Error("Can't send friend request to yourself");
    }
  },
);

export const FriendRequest = model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema,
);
