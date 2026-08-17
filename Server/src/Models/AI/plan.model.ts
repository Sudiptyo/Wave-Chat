import { model, Schema } from "mongoose";

export const Plan_Type = {
  BASIC: "basic",
  PRO: "pro",
  PREMIUM: "premium",
} as const;

export type PlanType = (typeof Plan_Type)[keyof typeof Plan_Type];

export interface IAiPlan {
  name: string;
  planType: PlanType;
  description?: string;
  currency: string;
  amount: number;
  credits: number;
  isActive: boolean;
}

const AiPlanSchema = new Schema<IAiPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },
    planType: {
      type: String,
      enum: Object.values(Plan_Type),
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const AiPlan = model<IAiPlan>("AiPlan", AiPlanSchema);
