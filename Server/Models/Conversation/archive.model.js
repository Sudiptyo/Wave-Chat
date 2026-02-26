import { model, Schema } from "mongoose"


const archiveSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    archivedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    archivedAt: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


archiveSchema.index({ conversationId: 1, archivedBy: 1 }, { unique: true }) // Ensure a user can only archive a conversation once
archiveSchema.index({ archivedBy: 1, archivedAt: -1 }) // To quickly find recent archives by a user

export const Archive = model('Archive', archiveSchema)