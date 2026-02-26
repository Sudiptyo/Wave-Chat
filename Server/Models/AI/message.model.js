import mongoose, { model, Schema } from "mongoose";

export const Chat_Type = Object.freeze({
    AI: 'ai',
    USER: 'user'
})

const AiMessageSchema = new Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: AiChat,
        required: true
    },
    isImage: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(Chat_Type),
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

AiMessageSchema.index({ chatId: 1, createdAt: -1 })

export const AiMessage = model('AiMessage', AiMessageSchema)