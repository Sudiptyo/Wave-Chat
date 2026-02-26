import { model, Schema } from "mongoose";

const pinnedMessageSchema = new Schema({
    pinnedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    messageId: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    pinnedAt: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

pinnedMessageSchema.index({ conversationId: 1, messageId: 1 }, { unique: true }) // Ensure a message can only be pinned once per conversation
pinnedMessageSchema.index({ pinnedBy: 1 }) // To quickly find all messages pinned by a user
pinnedMessageSchema.index({ conversationId: 1, pinnedAt: -1 }) // To quickly find recent pinned messages in a conversation
pinnedMessageSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0, sparse: true }) // Automatically remove expired pinned messages

export const PinnedMessage = model('PinnedMessage', pinnedMessageSchema)