import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Mute_Type = {
  TWO4HOURS: "24hours",
  FOUR8HOURS: "48hours",
  ALWAYS: "always",
  CUSTOM: "custom",
} as const;

export type MuteType = (typeof Mute_Type)[keyof typeof Mute_Type];

export interface IMute {
  userId: Types.ObjectId;
  conversationId: Types.ObjectId;
  muteType: MuteType;
  muteUntil?: Date;
}

const muteConversationSchema = new Schema<IMute>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    muteType: {
      type: String,
      enum: Object.values(Mute_Type),
      default: Mute_Type.TWO4HOURS,
      required: true,
    },
    muteUntil: {
      type: Date,
      default: null,
      required: function (this: HydratedDocument<IMute>): boolean {
        return this.muteType === Mute_Type.CUSTOM;
      },
    },
  },
  { timestamps: true },
);

muteConversationSchema.index(
  { userId: 1, conversationId: 1 },
  { unique: true },
); // Ensure a user can only mute a conversation once
muteConversationSchema.index({ userId: 1, muteUntil: 1 }); // To quickly find all mutes for a user and when they expire
muteConversationSchema.index({ muteUntil: 1 }, { expireAfterSeconds: 0 }); // Automatically remove expired mutes

muteConversationSchema.pre(
  "validate",
  function (this: HydratedDocument<IMute>) {
    const now = new Date();

    switch (this.muteType) {
      case Mute_Type.TWO4HOURS:
        this.muteUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;

      case Mute_Type.FOUR8HOURS:
        this.muteUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        break;

      case Mute_Type.ALWAYS:
        this.muteUntil = undefined;
        break;

      case Mute_Type.CUSTOM:
        if (!this.muteUntil) {
          throw new Error("Mute until date is required for custom mutes");
        }

        if (this.muteUntil.getTime() <= now.getTime()) {
          throw new Error("Mute until date cannot be in the past");
        }
        break;
    }
  },
);

export const MuteConversation = model<IMute>(
  "MuteConversation",
  muteConversationSchema,
);
