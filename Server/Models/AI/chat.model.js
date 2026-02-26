import mongoose, { model, Schema } from "mongoose";

const AiChatSchema = new Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    chatName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
}, { timestamps: true })

export const AiChat = model('AiChat', AiChatSchema)