import { model, Schema, Types } from "mongoose";

// export const Contact_Status = {
//   ACCEPTED: "accepted",
//   BLOCKED: "blocked",
// } as const;

// export type Contact_Status =
//   (typeof Contact_Status)[keyof typeof Contact_Status];

export interface IContact {
  userId: Types.ObjectId;
  contactedId: Types.ObjectId;
}

const contactSchema = new Schema<IContact>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactedId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

contactSchema.index({ userId: 1, contactedId: 1 }, { unique: true }); // Prevent duplicate contacts between the same users
contactSchema.index({ userId: 1, status: 1 }); // To quickly find contacts of a user by status
contactSchema.index({ contactedId: 1, status: 1 }); // To quickly find contacts of a user by status

contactSchema.pre("validate", function () {
  if (this.userId && this.contactedId && this.userId.equals(this.contactedId)) {
    throw new Error("Can't add yourself as a contact");
  }
});

export const Contact = model<IContact>("Contact", contactSchema);
