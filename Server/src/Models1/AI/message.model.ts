import { model, Schema, Types } from "mongoose";

export const Message_Role = {
  AI: "ai",
  USER: "user",
} as const;

export const Content_Type = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
} as const;

export type MessageRole = (typeof Message_Role)[keyof typeof Message_Role];
export type ContentType = (typeof Content_Type)[keyof typeof Content_Type];

export interface IAiMessage {
  chatId: Types.ObjectId;
  role: MessageRole;
  content: string;
  contentType: ContentType;
}

const AiMessageSchema = new Schema<IAiMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "AiChat",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Message_Role),
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    contentType: {
      type: String,
      enum: Object.values(Content_Type),
      default: Content_Type.TEXT,
    },
  },
  { timestamps: true },
);

AiMessageSchema.index({ chatId: 1, createdAt: -1 });

export const AiMessage = model<IAiMessage>("AiMessage", AiMessageSchema);
