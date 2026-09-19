import { HydratedDocument, model, Schema, Types } from "mongoose";

export const Call_Type = Object.freeze({
    AUDIO: "audio",
    VIDEO: "video",
});

export const Call_Status = Object.freeze({
    MISSED: "missed",
    COMPLETED: "completed",
    REJECTED: "rejected",
});

interface ICallLog {
    conversationId: Types.ObjectId;
    callerId: Types.ObjectId;
    receiverId: Types.ObjectId;
    type: keyof typeof Call_Type;
    startedAt: Date;
    endedAt?: Date;
    duration: number;
    status: (typeof Call_Status)[keyof typeof Call_Status];
}

const callLogSchema = new Schema<ICallLog>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        callerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(Call_Type),
            required: true,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        endedAt: {
            type: Date,
        },
        duration: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: Object.values(Call_Status),
            required: true,
        },
    },
    { timestamps: true },
);

callLogSchema.index({ callerId: 1, startedAt: -1 });
callLogSchema.index({ receiverId: 1, startedAt: -1 });
callLogSchema.index({ conversationId: 1, startedAt: -1 });

callLogSchema.pre("validate", function () {
    if (
        this.callerId &&
        this.receiverId &&
        this.callerId.equals(this.receiverId)
    ) {
        throw new Error("Caller and receiver cannot be the same user");
    }

    if (this.endedAt && this.startedAt && this.endedAt < this.startedAt) {
        throw new Error("endedAt cannot be before startedAt");
    }

    if (this.status === Call_Status.COMPLETED && !this.endedAt) {
        throw new Error("Completed call must have endedAt");
    }

    if (
        (this.status === Call_Status.MISSED ||
            this.status === Call_Status.REJECTED) &&
        this.endedAt
    ) {
        throw new Error("Missed or rejected calls should not have endedAt");
    }
});

callLogSchema.pre("save", function () {
    if (this.endedAt && this.startedAt) {
        const seconds = Math.floor(
            (this.endedAt.getTime() - this.startedAt.getTime()) / 1000,
        );

        this.duration = seconds > 0 ? seconds : 0;
    } else {
        this.duration = 0;
    }
});

export const CallLog = model<ICallLog>("CallLog", callLogSchema);