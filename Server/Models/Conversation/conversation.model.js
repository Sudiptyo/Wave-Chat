import { Schema } from "mongoose";

export const Conversation_Type = Object.freeze({
    PRIVATE: 'private',
    GROUP: 'group',
})

const conversationSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(Conversation_Type),
        default: Conversation_Type.PRIVATE,
        required: true
    },
    participantIds: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    lastMessageId: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    lastMessageAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

conversationSchema.index({ participantIds: 1 }, { unique: true, partialFilterExpression: { type: Conversation_Type.PRIVATE } }) // To quickly find private conversations for a user
conversationSchema.index({ participantIds: 1, isDeleted: 1, lastMessageAt: -1 }) // To quickly find conversations for a user, sorted by last message date, and filter out deleted conversations when listing conversations for a user

conversationSchema.pre('validate', function (next) {

    if (this.participantIds?.length) { // Ensure participantIds are unique and sorted to maintain consistency for indexing

        const uniqueSortedStrings = [
            ...new Set(this.participantIds.map(id => id.toString())) // Convert ObjectId to string
        ].sort()  // Sort as strings to maintain consistent order for indexing

        this.participantIds = uniqueSortedStrings.map(
            id => new Schema.Types.ObjectId(id)
        ) // Store as ObjectId array after ensuring uniqueness and sorting
    }

    if (!this.participantIds.some(
        id => id.toString() === this.createdBy.toString() // Ensure the creator is included in the participants
    )) {
        return next(new Error(
            'Creator must be included in participants'
        ))
    }

    if (this.type === Conversation_Type.PRIVATE && // Private conversations must have exactly 2 participants (the creator and one other user)
        this.participantIds.length !== 2) {
        return next(new Error(
            'Private conversation must have exactly 2 participants'
        ))
    }

    if (this.type === Conversation_Type.GROUP && // Group conversations must have at least 2 participants (including the creator)
        this.participantIds.length < 2) {
        return next(new Error(
            'Group conversation must have at least 2 participants'
        ))
    }

    next()
})

export const Conversation = model('Conversation', conversationSchema)