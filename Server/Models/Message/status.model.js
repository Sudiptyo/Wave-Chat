import { model, Schema } from "mongoose";

export const Message_Status = Object.freeze({
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read'
})

const messageStatusSchema = new Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Message_Status),
        default: Message_Status.SENT,
        required: true
    }
}, { timestamps: true })

messageStatusSchema.index({ messageId: 1, userId: 1 }, { unique: true }) // Ensure one status per user per message
messageStatusSchema.index({ userId: 1, status: 1 }) // To quickly find messages by user and status (e.g., all unread messages for a user)

export const MessageStatus = model('MessageStatus', messageStatusSchema)