import { HydratedDocument, model, Schema, Types } from "mongoose";

export interface IGroupChat {
  conversationId: Types.ObjectId;
  createdBy: Types.ObjectId;
  avatar?: string;
  groupName: string;
  description?: string;
  memberCount: number;
  isPrivate?: boolean;
  requiresJoiningApproval: boolean;
  adminCount: number;
  lastMessageId?: Types.ObjectId;
  isDeleted: boolean;
  trackReadStatus: boolean;
}

const groupChatSchema = new Schema<IGroupChat>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avatar: {
      type: String,
    },
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
    requiresJoiningApproval: {
      type: Boolean,
      default: false,
      required: function (this: HydratedDocument<IGroupChat>): boolean {
        return Boolean(this.isPrivate);
      },
    },
    adminCount: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    trackReadStatus: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true },
);

groupChatSchema.index({ createdBy: 1 }); // To quickly find all groups created by a user
groupChatSchema.index({ groupName: 1 }); // To quickly find groups by name (for search functionality)
groupChatSchema.index({ isDeleted: 1, createdAt: -1 }); // To quickly filter out deleted groups and sort by creation date when listing groups

export const GroupChat = model<IGroupChat>("GroupChat", groupChatSchema);
