import { model, Schema, Types } from "mongoose";

export interface IBlock {
  blockerId: Types.ObjectId;
  blockedId: Types.ObjectId;
}

const blockSchema = new Schema<IBlock>(
  {
    blockerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true }); // Ensure a user can only block another user once
blockSchema.index({ blockerId: 1 }); // To quickly find all users blocked by a user
blockSchema.index({ blockedId: 1 }); // To quickly find all users who have blocked a user

blockSchema.pre("validate", function () {
  if (
    this.blockerId &&
    this.blockedId &&
    this.blockerId.equals(this.blockedId)
  ) {
    throw new Error("You cannot block yourself");
  }
});

export const Block = model<IBlock>("Block", blockSchema);
