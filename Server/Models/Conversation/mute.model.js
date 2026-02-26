import { model, Schema } from "mongoose";


const muteConversationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    muteUntil: {
        type: Date,
        default: null
    }
}, { timestamps: true })

muteConversationSchema.index({ userId: 1, conversationId: 1 }, { unique: true }) // Ensure a user can only mute a conversation once
muteConversationSchema.index({ userId: 1, muteUntil: 1 }) // To quickly find all mutes for a user and when they expire
muteConversationSchema.index({ muteUntil: 1 }, { expireAfterSeconds: 0 }) // Automatically remove expired mutes

export const MuteConversation = model('MuteConversation', muteConversationSchema)