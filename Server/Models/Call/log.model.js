import { model, Schema } from "mongoose";

export const Call_Type = Object.freeze({
    AUDIO: 'audio',
    VIDEO: 'video'
})

export const Call_Status = Object.freeze({
    MISSED: 'missed',
    COMPLETED: 'completed',
    REJECTED: 'rejected'
})

const callLogSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    callerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(Call_Type),
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    },
    duration: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: Object.values(Call_Status),
        required: true
    }
}, { timestamps: true })

callLogSchema.index({ callerId: 1, startedAt: -1 }) // To quickly find all calls made by a user
callLogSchema.index({ receiverId: 1, startedAt: -1 }) // To quickly find all calls involving a user
callLogSchema.index({ conversationId: 1, startedAt: -1 }) // To quickly find all calls in a conversation

callLogSchema.pre('validate', function (next) {

    if (
        this.callerId &&
        this.receiverId &&
        this.callerId.equals(this.receiverId)
    ) {
        return next(new Error('Caller and receiver cannot be the same user'))
    }

    if (this.endedAt && this.startedAt && this.endedAt < this.startedAt) {
        return next(new Error('endedAt cannot be before startedAt'))
    }

    if (this.status === Call_Status.COMPLETED && !this.endedAt) {
        return next(new Error('Completed call must have endedAt'))
    }

    if (
        (this.status === Call_Status.MISSED ||
            this.status === Call_Status.REJECTED)
        && this.endedAt
    ) {
        return next(new Error('Missed or rejected calls should not have endedAt'))
    }

    next()
})

callLogSchema.pre('save', function (next) {

    if (this.endedAt && this.startedAt) {
        const seconds = Math.floor(
            (this.endedAt - this.startedAt) / 1000
        )
        this.duration = seconds > 0 ? seconds : 0 // Ensure duration is not negative
    } else {
        this.duration = 0
    }

    next()
})

export const CallLog = model('CallLog', callLogSchema)