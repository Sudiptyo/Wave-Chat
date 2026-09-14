import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Conversation_Type = {
  PRIVATE: "private",
  GROUP: "group",
} as const;

export type ConversationType =
  (typeof Conversation_Type)[keyof typeof Conversation_Type];

export interface IConversation {
  createdBy: Types.ObjectId;
  conversationType: ConversationType;
  participantIds: Types.ObjectId[];
  privateParticipantKey?: string;
  lastMessageId?: Types.ObjectId;
  lastMessageAt?: Date;
  isDeleted: boolean;
}

const conversationSchema = new Schema<IConversation>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversationType: {
      type: String,
      enum: Object.values(Conversation_Type),
      default: Conversation_Type.PRIVATE,
      required: true,
    },

    participantIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: (ids: Types.ObjectId[]) => ids.length >= 1,
        message: "Conversation must have at least 1 participants",
      },
    },

    privateParticipantKey: {
      type: String,
      default: null,
    },

    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Query conversations for a user, sorted by recent activity.
conversationSchema.index({
  participantIds: 1,
  isDeleted: 1,
  lastMessageAt: -1,
});

// Prevent duplicate private conversations.
conversationSchema.index(
  { privateParticipantKey: 1 },
  { unique: true, sparse: true },
);

conversationSchema.pre(
  "validate",
  function (this: HydratedDocument<IConversation>) {
    if (this.participantIds?.length) {
      const uniqueSortedStrings = [
        ...new Set(this.participantIds.map((id) => id.toString())),
      ].sort();

      this.participantIds = uniqueSortedStrings.map(
        (id) => new Types.ObjectId(id),
      );

      if (this.conversationType === Conversation_Type.PRIVATE) {
        this.privateParticipantKey = uniqueSortedStrings.join("_");
      } else {
        this.privateParticipantKey = undefined;
      }
    }

    if (
      !this.participantIds.some(
        (id) => id.toString() === this.createdBy.toString(),
      )
    ) {
      throw new Error("Creator must be included in participants");
    }

    if (
      this.conversationType === Conversation_Type.PRIVATE &&
      this.participantIds.length !== 1 &&
      this.participantIds.length !== 2
    ) {
      throw new Error("Private conversation must have 1 or 2 participants");
    }

    if (
      this.conversationType === Conversation_Type.GROUP &&
      this.participantIds.length < 2
    ) {
      throw new Error("Group conversation must have at least 2 participants");
    }
  },
);

export const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema,
);
