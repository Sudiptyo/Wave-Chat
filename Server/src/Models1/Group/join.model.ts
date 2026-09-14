import { HydratedDocument, model, Schema, Types } from "mongoose";

export const GroupJoinRequest_Status = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type GroupJoinRequestStatus =
  (typeof GroupJoinRequest_Status)[keyof typeof GroupJoinRequest_Status];

export interface IGroupJoinRequest {
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  status: GroupJoinRequestStatus;
  requestedAt: Date;
  expiresAt: Date;
}

const groupJoinRequestSchema = new Schema<IGroupJoinRequest>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "GroupChat",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GroupJoinRequest_Status),
      default: GroupJoinRequest_Status.PENDING,
      required: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

groupJoinRequestSchema.index(
  { groupId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: GroupJoinRequest_Status.PENDING },
  },
); // Ensure a user can only have one pending join request per group
groupJoinRequestSchema.index({ userId: 1, status: 1 }); // To quickly find pending join requests for a user
groupJoinRequestSchema.index({ groupId: 1, status: 1 }); // To quickly find pending join requests for a group
groupJoinRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Automatically remove expired join requests

groupJoinRequestSchema.pre(
  "validate",
  function (this: HydratedDocument<IGroupJoinRequest>) {
    if (this.expiresAt.getTime() <= Date.now()) {
      throw new Error("Join request expiration must be in the future");
    }
  },
);

export const GroupJoinRequest = model<IGroupJoinRequest>(
  "GroupJoinRequest",
  groupJoinRequestSchema,
);
