import mongoose, { model, Schema } from "mongoose";


const groupChatSchema = new Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avatar: {
        type: String
    },
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    memberCount: {
        type: Number,
        default: 1
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    requiresApproval: {
        type: Boolean,
        default: false
    },
    adminCount: {
        type: Number,
        default: 1
    },
    lastMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

groupChatSchema.index({ createdBy: 1 }) // To quickly find all groups created by a user
groupChatSchema.index({ groupName: 1 }) // To quickly find groups by name (for search functionality)
groupChatSchema.index({ isDeleted: 1, createdAt: -1 }) // To quickly filter out deleted groups and sort by creation date when listing groups

export const GroupChat = model('GroupChat', groupChatSchema)