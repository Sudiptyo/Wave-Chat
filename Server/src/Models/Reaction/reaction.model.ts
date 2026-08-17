import { model, Schema, Types } from "mongoose";

export interface IReaction {
  userId: Types.ObjectId;
  messageId: Types.ObjectId;
  emoji: string;
}

const reactionSchema = new Schema<IReaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    emoji: {
      type: String,
      required: true,
      trim: true,
      maxlength: 16,
    },
  },
  { timestamps: true },
);

reactionSchema.index({ messageId: 1, userId: 1 }, { unique: true }); // Ensure a user can only react once per message
reactionSchema.index({ messageId: 1 }); // To quickly find all reactions for a message

export const Reaction = model<IReaction>("Reaction", reactionSchema);
