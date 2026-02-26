import mongoose, { model, Schema } from "mongoose";

export const Notification_Type = Object.freeze({
    FRIEND_REQUEST: 'friend_request',
    MESSAGE: 'message',
    CALL: 'call',
    GROUP_INVITE: 'group_invite'
})

export const Reference_Type = Object.freeze({
    FRIEND_REQUEST: 'friend_request',
    MESSAGE: 'message',
    CALL: 'call',
    CONVERSATION: 'conversation'
})

const notificationSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(Notification_Type),
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    referenceType: {
        type: String,
        enum: Object.values(Reference_Type),
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    notificationExpiresAt: {
        type: Date
    }
}, { timestamps: true })

notificationSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 }) // To quickly find unread notifications for a user, sorted by newest first
notificationSchema.index({ receiverId: 1, createdAt: -1 }) // To quickly find all notifications for a user, sorted by newest first
notificationSchema.index({ notificationExpiresAt: 1 }, { expireAfterSeconds: 0, sparse: true }) // Automatically delete expired notifications

notificationSchema.pre('validate', function (next) {
    if (this.senderId && this.receiverId && this.senderId.equals(this.receiverId)) {
        return next(new Error("Can't send notification to yourself"))
    }
    next()
})

export const Notification = model('Notification', notificationSchema)