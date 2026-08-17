import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Attachment_Type = {
  IMAGE: "image",
  VIDEO: "video",
  VOICE: "voice",
  FILE: "file",
} as const;

export type AttachmentType =
  (typeof Attachment_Type)[keyof typeof Attachment_Type];

export interface IMessageAttachment {
  messageId: Types.ObjectId;
  attachmentType: AttachmentType;

  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;

  // Optional text specifically associated with this attachment.
  caption?: string;

  // Useful for voice/video.
  duration?: number;

  // Useful for image/video.
  width?: number;
  height?: number;
}

const messageAttachmentSchema = new Schema<IMessageAttachment>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    attachmentType: {
      type: String,
      enum: Object.values(Attachment_Type),
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    fileSize: {
      type: Number,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "File size must be an integer",
      },
    },

    mimeType: {
      type: String,
      trim: true,
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    duration: {
      type: Number,
      min: 0,
    },

    width: {
      type: Number,
      min: 1,
    },

    height: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true },
);

// Retrieve all attachments of a message in their creation order.
messageAttachmentSchema.index({
  messageId: 1,
  createdAt: 1,
});

// A message can contain only ONE voice attachment.
// Images, videos and files can appear multiple times.
messageAttachmentSchema.index(
  { messageId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      attachmentType: Attachment_Type.VOICE,
    },
  },
);

messageAttachmentSchema.pre(
  "validate",
  function (this: HydratedDocument<IMessageAttachment>) {
    const hasDuration = this.duration !== undefined;
    const hasWidth = this.width !== undefined;
    const hasHeight = this.height !== undefined;

    switch (this.attachmentType) {
      // IMAGE
      case Attachment_Type.IMAGE:
        if (!hasWidth || !hasHeight) {
          throw new Error("Image attachment requires width and height");
        }

        if (hasDuration) {
          throw new Error("Image attachment cannot have duration");
        }

        if (this.mimeType && !this.mimeType.startsWith("image/")) {
          throw new Error("Invalid MIME type for image attachment");
        }

        break;

      // VIDEO
      case Attachment_Type.VIDEO:
        if (!hasWidth || !hasHeight) {
          throw new Error("Video attachment requires width and height");
        }

        if (!hasDuration) {
          throw new Error("Video attachment requires duration");
        }

        if (this.mimeType && !this.mimeType.startsWith("video/")) {
          throw new Error("Invalid MIME type for video attachment");
        }

        break;

      // VOICE
      case Attachment_Type.VOICE:
        if (!hasDuration) {
          throw new Error("Voice attachment requires duration");
        }

        if (hasWidth || hasHeight) {
          throw new Error("Voice attachment cannot have width or height");
        }

        // Voice is never allowed to have a caption.
        if (this.caption?.trim()) {
          throw new Error("Voice attachment cannot have a caption");
        }

        if (this.mimeType && !this.mimeType.startsWith("audio/")) {
          throw new Error("Invalid MIME type for voice attachment");
        }

        break;

      // FILE
      case Attachment_Type.FILE:
        if (hasWidth || hasHeight || hasDuration) {
          throw new Error("File attachment cannot have media metadata");
        }

        break;
    }
  },
);

export const MessageAttachment = model<IMessageAttachment>(
  "MessageAttachment",
  messageAttachmentSchema,
);
