import { model, Schema } from "mongoose"


const reactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageId: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    emoji: {
        type: String,
        required: true
    }
}, { timestamps: true })

reactionSchema.index({ messageId: 1, userId: 1 }, { unique: true }) // Ensure a user can only react once per message
reactionSchema.index({ messageId: 1 }) // To quickly find all reactions for a message

export const Reaction = model('Reaction', reactionSchema)