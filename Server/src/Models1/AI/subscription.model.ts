import { model, Schema, Types } from "mongoose";

export const Subscription_Status = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REJECTED: "rejected",
} as const;

export type SubscriptionStatus =
  (typeof Subscription_Status)[keyof typeof Subscription_Status];

export interface IAiSubscription {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  currency: string;
  amount: number;
  credits: number;
  paymentLinkId: string;
  paymentId?: string;
  status: SubscriptionStatus;
}

const AiSubscriptionSchema = new Schema<IAiSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "AiPlan",
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Amount must be an integer",
      },
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Credits must be an integer",
      },
    },
    paymentLinkId: {
      type: String,
      required: true,
      trim: true,
    },
    paymentId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(Subscription_Status),
      default: Subscription_Status.PENDING,
    },
  },
  { timestamps: true },
);

AiSubscriptionSchema.index({ userId: 1 });
AiSubscriptionSchema.index({ paymentId: 1 }, { unique: true, sparse: true });
AiSubscriptionSchema.index({ paymentLinkId: 1 }, { unique: true });

export const AiSubscription = model<IAiSubscription>(
  "AiSubscription",
  AiSubscriptionSchema,
);
