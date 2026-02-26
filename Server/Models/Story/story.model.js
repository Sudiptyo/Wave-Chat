import { model, Schema } from "mongoose";

export const Story_Privacy = Object.freeze({
    PUBLIC: 'public',
    FRIENDS_ONLY: 'friends_only',
    PRIVATE: 'private'
})

export const Story_Type = Object.freeze({
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    VOICE: 'voice'
})

const storySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(Story_Type),
        default: Story_Type.TEXT,
        required: true
    },
    mediaUrl: {
        type: String,
        required: function () {
            return this.type !== Story_Type.TEXT // Media URL is required for non-text stories
        }
    },
    textContent: {
        type: String,
        required: function () {
            return this.type === Story_Type.TEXT // Text content is required for text stories
        }
    },
    privacy: {
        type: String,
        enum: Object.values(Story_Privacy),
        default: Story_Privacy.FRIENDS_ONLY,
        required: true
    },
    excludedUserIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    allowedUserIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    viewsCount: {
        type: Number,
        default: 0
    },
    loveCount: {
        type: Number,
        default: 0
    },
    isArchived: {
        type: Boolean,
        default: false
    }, 
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to 24 hours from creation
        }
    },
}, { timestamps: true })

storySchema.index({ userId: 1, createdAt: -1 }) // To quickly find recent stories for a user
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // Automatically remove expired stories
storySchema.index({ expiresAt: 1, createdAt: -1 }) // To quickly find active stories sorted by creation time (newest first)

export const Story = model('Story', storySchema)