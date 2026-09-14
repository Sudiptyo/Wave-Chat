import { HydratedDocument, model, Schema, Types } from "mongoose";

export const GroupMember_Role = {
  MEMBER: "member",
  ADMIN: "admin",
  OWNER: "owner",
} as const;

export const GroupMember_Status = {
  ACTIVE: "active",
  BANNED: "banned",
  LEFT: "left",
  REMOVED: "removed",
} as const;

export type GroupMemberRole =
  (typeof GroupMember_Role)[keyof typeof GroupMember_Role];

export type GroupMemberStatus =
  (typeof GroupMember_Status)[keyof typeof GroupMember_Status];

export interface IGroupMember {
  groupId: Types.ObjectId;
  userId: Types.ObjectId;

  role: GroupMemberRole;
  status: GroupMemberStatus;

  // Only applies inside this group.
  nickname?: string;

  // Ban information.
  bannedAt?: Date;
  bannedBy?: Types.ObjectId;
  banReason?: string;

  joinedAt: Date;
  leftAt?: Date;
}

const groupMemberSchema = new Schema<IGroupMember>(
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

    role: {
      type: String,
      enum: Object.values(GroupMember_Role),
      default: GroupMember_Role.MEMBER,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(GroupMember_Status),
      default: GroupMember_Status.ACTIVE,
      required: true,
    },

    nickname: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    bannedAt: {
      type: Date,
    },

    bannedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    banReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    leftAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// One membership record per user per group.
groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

// Find members of a group by status.
groupMemberSchema.index({
  groupId: 1,
  status: 1,
});

// Find groups belonging to a user.
groupMemberSchema.index({
  userId: 1,
  status: 1,
});

// Find admins/owners of a group.
groupMemberSchema.index({
  groupId: 1,
  role: 1,
});

groupMemberSchema.pre(
  "validate",
  function (this: HydratedDocument<IGroupMember>) {
    // Owner must always be active.
    if (
      this.role === GroupMember_Role.OWNER &&
      this.status !== GroupMember_Status.ACTIVE
    ) {
      throw new Error("Group owner must be active");
    }

    // Banned members must have ban information.
    if (this.status === GroupMember_Status.BANNED) {
      if (!this.bannedAt) {
        this.bannedAt = new Date();
      }

      if (!this.bannedBy) {
        throw new Error("bannedBy is required for banned members");
      }
    }

    // Remove ban information when the member is no longer banned.
    if (this.status !== GroupMember_Status.BANNED) {
      this.bannedAt = undefined;
      this.bannedBy = undefined;
      this.banReason = undefined;
    }

    // LEFT / REMOVED members should have a left date.
    if (
      this.status === GroupMember_Status.LEFT ||
      this.status === GroupMember_Status.REMOVED
    ) {
      if (!this.leftAt) {
        this.leftAt = new Date();
      }
    }

    // Active members haven't left.
    if (this.status === GroupMember_Status.ACTIVE) {
      this.leftAt = undefined;
    }
  },
);

export const GroupMember = model<IGroupMember>(
  "GroupMember",
  groupMemberSchema,
);
