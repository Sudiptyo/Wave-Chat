import mongoose, { model, Schema } from "mongoose";

export const Group_Role = Object.freeze({
    ADMIN: 'admin',
    MEMBER: 'member'
})

const groupMemberSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupChat',
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Group_Role),
        default: Group_Role.MEMBER,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    muteUntil: {
        type: Date,
        default: null
    }
}, { timestamps: true })

groupMemberSchema.index({ groupId: 1 }) // To quickly find all members of a group
groupMemberSchema.index({ userId: 1 }) // To quickly find all groups a user is part of
groupMemberSchema.index({ userId: 1, groupId: 1 }, { unique: true }) // Ensure a user can only be a member of a group once

export const GroupMember = model('GroupMember', groupMemberSchema)