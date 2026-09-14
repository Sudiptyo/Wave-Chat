import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Pinned_Type = {
  TWO4HOURS: "24hours",
  FOUR8HOURS: "48hours",
  ALWAYS: "always",
  CUSTOM: "custom",
} as const;

export type PinnedType = (typeof Pinned_Type)[keyof typeof Pinned_Type];

export interface IPinned {
  pinnedBy: Types.ObjectId;
  conversationId?: Types.ObjectId;
  messageId?: Types.ObjectId;
  pinnedType: PinnedType;
  pinnedAt: Date;
  expireAt?: Date;
}

const pinnedSchema = new Schema<IPinned>(
  {
    pinnedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    pinnedType: {
      type: String,
      enum: Object.values(Pinned_Type),
      default: Pinned_Type.TWO4HOURS,
      required: true,
    },
    pinnedAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
      type: Date,
      default: null,
      required: function (this: HydratedDocument<IPinned>): boolean {
        return this.pinnedType === Pinned_Type.CUSTOM;
      },
    },
  },
  { timestamps: true },
);

pinnedSchema.index({ conversationId: 1, pinnedAt: -1 }); // To quickly find recent pinned messages in a conversation
pinnedSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0, sparse: true }); // Automatically remove expired pinned messages

pinnedSchema.index(
  { pinnedBy: 1, conversationId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      messageId: { $exists: false },
    },
  },
);

pinnedSchema.index(
  { pinnedBy: 1, messageId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      messageId: { $exists: true },
    },
  },
);

pinnedSchema.pre("validate", function (this: HydratedDocument<IPinned>) {
  const now = new Date();

  // Validate pin target
  const hasConversation = !!this.conversationId;
  const hasMessage = !!this.messageId;

  if (!hasConversation && !hasMessage) {
    throw new Error("Either conversationId or messageId is required");
  }

  if (hasConversation && hasMessage) {
    throw new Error("A pin cannot target both a conversation and a message");
  }

  // Handle expiration
  switch (this.pinnedType) {
    case Pinned_Type.TWO4HOURS:
      this.expireAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      break;

    case Pinned_Type.FOUR8HOURS:
      this.expireAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      break;

    case Pinned_Type.ALWAYS:
      this.expireAt = undefined;
      break;

    case Pinned_Type.CUSTOM:
      if (!this.expireAt) {
        throw new Error("Expiration date is required for custom pin duration");
      }

      if (this.expireAt.getTime() <= now.getTime()) {
        throw new Error("Expiration date must be in the future");
      }

      break;
  }
});

export const Pinned = model<IPinned>("Pinned", pinnedSchema);
