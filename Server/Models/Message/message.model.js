import mongoose, { model, Schema } from "mongoose";

export const Message_Type = Object.freeze({
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    VOICE: 'voice'
})

const messageSchema = new Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        default: null
    },
    messageType: {
        type: String,
        enum: Object.values(Message_Type),
        default: Message_Type.TEXT,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: function () {
            return this.messageType === Message_Type.TEXT;
        }
    },
    attachmentUrl: {
        type: String,
        required: function () {
            return this.messageType !== Message_Type.TEXT;
        },
        validate: {
            validator: function (v) {
                if (this.messageType !== Message_Type.TEXT) {
                    return typeof v === 'string' && v.length > 0;
                }
                return true;
            },
            message: "Attachment URL required for media messages"
        }
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true })

messageSchema.index({ conversationId: 1, _id: -1 }) // Index for efficient retrieval of messages in a conversation, sorted by message ID (newest first)
messageSchema.index({ senderId: 1, createdAt: -1 }) // Index for efficient retrieval of messages by a sender, sorted by creation time
messageSchema.index({ replyTo: 1 }) // Index for efficient retrieval of replies to a message

messageSchema.pre('save', function (next) {

    if (!this.isNew && this.deletedAt && this.isModified('content')) {
        return next(new Error("Can't edit a deleted message"))
    }

    if (this.isModified('content') && !this.isNew) {
        this.isEdited = true;
        this.editedAt = new Date();
    }

    next();

})

export const Message = model('Message', messageSchema)