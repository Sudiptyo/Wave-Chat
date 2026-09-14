import mongoose, { model, Schema, Types } from "mongoose";

export interface IAiChat {
  userId: Types.ObjectId;
  chatName?: string;
}

const AiChatSchema = new Schema<IAiChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatName: {
      type: String,
      required: true, 
      maxlength: 100,
      trim: true,
    },
  },
  { timestamps: true },
);

AiChatSchema.index({ userId: 1, updatedAt: -1 });

export const AiChat = model<IAiChat>("AiChat", AiChatSchema);
