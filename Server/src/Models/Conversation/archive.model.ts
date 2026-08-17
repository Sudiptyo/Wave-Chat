import { model, Schema, Types } from "mongoose";

export interface IArchive {
  conversationId: Types.ObjectId;
  archivedBy: Types.ObjectId;
  archivedAt: Date;
}

const archiveSchema = new Schema<IArchive>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    archivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

archiveSchema.index({ conversationId: 1, archivedBy: 1 }, { unique: true }); // Ensure a user can only archive a conversation once
archiveSchema.index({ archivedBy: 1, archivedAt: -1 }); // To quickly find recent archives by a user

export const Archive = model<IArchive>("Archive", archiveSchema);
