import { model, Schema, Types } from "mongoose";

export interface IMention {
  conversationId: Types.ObjectId;
  messageId: Types.ObjectId;
  userId: Types.ObjectId;
}

const messageMentionSchema = new Schema<IMention>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
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
  },
  { timestamps: true },
);

messageMentionSchema.index({ conversationId: 1, messageId: 1 });
import { model, Schema, Types } from "mongoose";

export interface IMention {
  conversationId: Types.ObjectId;
  messageId: Types.ObjectId;
  userId: Types.ObjectId;
}

const messageMentionSchema = new Schema<IMention>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
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
  },
  { timestamps: true },
);

messageMentionSchema.index({ messageId: 1, userId: 1 }, { unique: true });
messageMentionSchema.index({
  userId: 1,
  createdAt: -1,
});

export const MessageMention = model<IMention>(
  "MessageMention",
  messageMentionSchema,
);
