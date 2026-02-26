import { Schema } from "mongoose"

export const GroupInvite_Status = Object.freeze({
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined'
})

const groupInviteSchema = new Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'GroupChat',
        required: true
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invitedUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(GroupInvite_Status),
        default: GroupInvite_Status.PENDING,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

groupInviteSchema.index({ groupId: 1, invitedUserId: 1 }, { unique: true, partialFilterExpression: { status: GroupInvite_Status.PENDING } }) // To quickly find invites for a user in a group
groupInviteSchema.index({ invitedUserId: 1, status: 1 }) // To quickly find pending invites for a user
groupInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // Automatically remove expired invites

export const GroupInvite = model('GroupInvite', groupInviteSchema)