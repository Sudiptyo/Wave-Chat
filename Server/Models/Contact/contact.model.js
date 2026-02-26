import mongoose, { model, Schema } from "mongoose"

export const Contact_Status = Object.freeze({
    ACCEPTED: 'accepted',
    BLOCKED: 'blocked',
})

const contactSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Contact_Status),
        default: Contact_Status.ACCEPTED,
        required: true
    }
}, { timestamps: true })

contactSchema.index({ userId: 1, contactedId: 1 }, { unique: true }) // Prevent duplicate contacts between the same users
contactSchema.index({ userId: 1, status: 1 }) // To quickly find contacts of a user by status
contactSchema.index({ contactedId: 1, status: 1 }) // To quickly find contacts of a user by status

contactSchema.pre('validate', function (next) {
    if (this.userId && this.contactedId && this.userId.equals(this.contactedId)) {
        return next(new Error("Can't add yourself as a contact"))
    }
    next()
})

export const Contact = model('Contact', contactSchema)