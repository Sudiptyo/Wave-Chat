import { model, Schema, Types } from "mongoose";

export interface IStoryView {
  storyId: Types.ObjectId;
  viewerId: Types.ObjectId;
  viewedAt: Date;
  isLoved: boolean;
  lovedAt?: Date;
}

const storyViewSchema = new Schema<IStoryView>(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    viewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
    isLoved: {
      type: Boolean,
      default: false,
    },
    lovedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

storyViewSchema.index({ storyId: 1, viewerId: 1 }, { unique: true }); // Ensure a user can only have one view record per story
storyViewSchema.index({ storyId: 1, viewedAt: -1 }); // To quickly find recent views for a story

export const StoryView = model<IStoryView>("StoryView", storyViewSchema);
