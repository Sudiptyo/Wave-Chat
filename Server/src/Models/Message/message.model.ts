import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Message_Type = {
  TEXT: "text",
  MEDIA: "media",
  VOICE: "voice",
} as const;

export type MessageType = (typeof Message_Type)[keyof typeof Message_Type];

export interface IMessage {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;

  replyTo?: Types.ObjectId;
  storyId?: Types.ObjectId;

  messageType: MessageType;

  // General text for the entire message.
  // Example:
  // "Here are the photos from today's trip."
  content?: string;

  forwardedFrom?: Types.ObjectId;
  isEdited: boolean;
  editedAt?: Date;
  deletedAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      default: null,
    },
    messageType: {
      type: String,
      enum: Object.values(Message_Type),
      default: Message_Type.TEXT,
      required: true,
    },

    // General text for the entire message.
    content: {
      type: String,
      trim: true,
      maxlength: 50000,
    },
    forwardedFrom: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Fetch messages in a conversation, newest first.
messageSchema.index({
  conversationId: 1,
  _id: -1,
});

// Fetch messages sent by a user.
messageSchema.index({
  senderId: 1,
  createdAt: -1,
});

// Fetch replies.
messageSchema.index({
  replyTo: 1,
});

// Fetch forwarded messages.
messageSchema.index({
  forwardedFrom: 1,
});

messageSchema.pre("validate", function (this: HydratedDocument<IMessage>) {
  const hasContent = Boolean(this.content?.trim());

  // TEXT
  // A text message must contain text.
  // Attachments are prevented by the service layer because
  // attachments live in a separate collection.
  if (this.messageType === Message_Type.TEXT) {
    if (!hasContent) {
      throw new Error("Text message cannot be empty");
    }

    return;
  }

  // VOICE
  // Voice messages cannot contain any general text.
  if (this.messageType === Message_Type.VOICE && hasContent) {
    throw new Error("Voice messages cannot contain text content");
  }

  // MEDIA
  // Content is optional.
  //
  // This allows:
  //
  // "Here are the photos."
  // + multiple attachments
  //
  // OR individual captions on each attachment.
  //
  // The actual attachment validation happens in the
  // MessageAttachment model + message creation service.
});

messageSchema.pre("save", function (this: HydratedDocument<IMessage>) {
  if (
    (!this.isNew &&
      this.deletedAt &&
      (this.isModified("content") ||
        this.isModified("messageType") ||
        this.isModified("replyTo") ||
        this.isModified("storyId"))) ||
        this.isModified("forwardedFrom")
  ) {
    throw new Error("Can't modify a deleted message");
  }

  if (this.isModified("content") && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
});

export const Message = model<IMessage>("Message", messageSchema);
