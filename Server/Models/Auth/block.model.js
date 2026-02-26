import { model, Schema } from "mongoose"

const blockSchema = new Schema({
    blockerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blockedId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        default: ''
    }
}, { timestamps: true })

blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true }) // Ensure a user can only block another user once
blockSchema.index({ blockerId: 1 }) // To quickly find all users blocked by a user
blockSchema.index({ blockedId: 1 }) // To quickly find all users who have blocked a user

blockSchema.pre('validate', function (next) {
    if (this.blockerId && this.blockedId && this.blockerId.equals(this.blockedId)) {
        return next(new Error("You cannot block yourself"))
    }
    next()
})

export const Block = model('Block', blockSchema)