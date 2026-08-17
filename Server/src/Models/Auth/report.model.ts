import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Report_Status = {
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
} as const;

export const Report_type = {
  SPAM: "spam",
  SCAM: "scam",
  HARASSMENT: "harassment",
  INSULT: "insult",
  ABUSE: "abuse",
  INAPPROPRIATE_CONTENT: "inappropriate",
  OTHER: "other",
} as const;

export type ReportStatus = (typeof Report_Status)[keyof typeof Report_Status];
export type ReportType = (typeof Report_type)[keyof typeof Report_type];

export interface IReport {
  reporterId: Types.ObjectId;
  reportedUserId: Types.ObjectId;
  messageId?: Types.ObjectId;
  conversationId?: Types.ObjectId;
  groupId?: Types.ObjectId;
  storyId?: Types.ObjectId;
  reason: ReportType;
  description?: string;
  status: ReportStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "GroupChat",
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
    },
    reason: {
      type: String,
      default: null,
      required: true,
    },
    description: {
      type: String,
      required: function (this: HydratedDocument<IReport>): boolean {
        return this.reason === Report_type.OTHER;
      },
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: Object.values(Report_Status),
      default: Report_Status.PENDING,
    },
  },
  { timestamps: true },
);

reportSchema.index({
  status: 1,
  createdAt: -1,
});

reportSchema.index({
  reportedUserId: 1,
  createdAt: -1,
});

reportSchema.index({
  reporterId: 1,
  createdAt: -1,
});

reportSchema.pre("validate", function (this: HydratedDocument<IReport>) {
  if (
    this.reporterId &&
    this.reportedUserId &&
    this.reporterId.equals(this.reportedUserId)
  ) {
    throw new Error("You cannot report yourself");
  }

  const targets = [
    this.messageId,
    this.conversationId,
    this.groupId,
    this.storyId,
  ].filter(Boolean);

  if (targets.length === 0) {
    throw new Error("A report must have at least one target");
  }

  if (targets.length > 1) {
    throw new Error("A report can only target one entity");
  }
});

export const Report = model<IReport>("Report", reportSchema);
