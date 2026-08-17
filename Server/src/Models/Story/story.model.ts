import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Story_Privacy = {
  PUBLIC: "public",
  CLOSE_FRIENDS: "close_friends",
  PRIVATE: "private",
} as const;

export const Story_Type = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  VOICE: "voice",
} as const;

export type StoryType = (typeof Story_Type)[keyof typeof Story_Type];
export type StoryPrivacy = (typeof Story_Privacy)[keyof typeof Story_Privacy];

export interface IStory {
  userId: Types.ObjectId;
  storyType: StoryType;
  mediaUrl?: string;
  textContent?: string;
  privacy: StoryPrivacy;
  excludedUserIds: Types.ObjectId[];
  allowedUserIds: Types.ObjectId[];
  viewsCount: number;
  loveCount: number;
  isArchived: boolean;
  expiresAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storyType: {
      type: String,
      enum: Object.values(Story_Type),
      default: Story_Type.TEXT,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: function (this: HydratedDocument<IStory>) {
        return this.storyType !== Story_Type.TEXT; // Media URL is required for non-text stories
      },
    },
    textContent: {
      type: String,
      required: function (this: HydratedDocument<IStory>) {
        return this.storyType === Story_Type.TEXT; // Text content is required for text stories
      },
    },
    privacy: {
      type: String,
      enum: Object.values(Story_Privacy),
      default: Story_Privacy.PUBLIC,
      required: true,
    },
    excludedUserIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    allowedUserIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Views count must be an integer",
      },
    },
    loveCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Love count must be an integer",
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours from creation
      },
    },
  },
  { timestamps: true },
);

storySchema.index({ userId: 1, createdAt: -1 }); // To quickly find recent stories for a user
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Automatically remove expired stories
storySchema.index({ expiresAt: 1, createdAt: -1 }); // To quickly find active stories sorted by creation time (newest first)

export const Story = model<IStory>("Story", storySchema);
