import mongoose, { model, Schema } from "mongoose";

export const Subscription_Status = Object.freeze({
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REJECTED: 'rejected'
})

const AiSubscriptionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        default: 'INR',
    },
    amount: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true,
        min: 1
    },
    paymentLinkId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(Subscription_Status),
        default: Subscription_Status.PENDING
    }
}, { timestamps: true })

AiSubscriptionSchema.index({ userId: 1 })
AiSubscriptionSchema.index({ paymentId: 1 }, { unique: true, sparse: true })
AiSubscriptionSchema.index({ paymentLinkId: 1 }, { unique: true })

export const AiSubscription = model('AiSubscription', AiSubscriptionSchema)