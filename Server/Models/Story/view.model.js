import mongoose, { model, Schema } from "mongoose";


const storyViewSchema = new Schema({
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    viewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now
    },
    isLoved: {
        type: Boolean,
        default: false
    },
    lovedAt: {
        type: Date,
    }
}, { timestamps: true })

storyViewSchema.index({ storyId: 1, viewerId: 1 }, { unique: true }) // Ensure a user can only have one view record per story
storyViewSchema.index({ storyId: 1, viewedAt: -1 }) // To quickly find recent views for a story

export const StoryView = model('StoryView', storyViewSchema)