import mongoose, { model, Schema } from "mongoose";
import crypto from 'crypto'

export const Otp_Type = Object.freeze({
    MOBILENUMBER_VERIFICATION: 'mobileNo_verification',
    EMAIL_VERIFICATION: 'email_verification',
    PASSWORD_RESET: 'password_reset'
})

const otpSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(Otp_Type),
        required: true
    },
    otp: {
        type: String,
        required: true,
        trim: true
    },
    otpExpiresAt: {
        type: Date,
        required: true
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0
    },
    resendAvailable: {
        type: Date,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiresAt: {
        type: Date
    }
}, { timestamps: true })

otpSchema.index({ userId: 1, type: 1 }, { unique: true }) // One OTP per user per type
otpSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 })
otpSchema.index({ resetTokenExpiresAt: 1 }, { expireAfterSeconds: 0 })

otpSchema.pre('save', function () {
    if (this.isModified('otp') && this.otp) { // Hash the OTP before saving to the database for security
        this.otp = crypto.createHash('sha256').update(this.otp).digest('hex')
    }

    if (this.isModified('resetToken') && this.resetToken) { // Hash the reset token before saving to the database for security
        this.resetToken = crypto.createHash('sha256').update(this.resetToken).digest('hex')
    }
})

otpSchema.methods.isOtpCorrect = function (otp) { 

    if (!this.otpExpiresAt || this.otpExpiresAt.getTime() < Date.now()) return false; // Check if OTP is expired

    if (this.attempts > 5) return false; // Limit the number of attempts to prevent brute-force attacks

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex') // Hash the provided OTP to compare with the stored hashed OTP
    return this.otp === hashedOtp
}

otpSchema.methods.isResetTokenCorrect = function (resetToken) {
    if (!this.resetTokenExpiresAt || this.resetTokenExpiresAt.getTime() < Date.now()) return false; // Check if reset token is expired

    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex') // Hash the provided reset token to compare with the stored hashed reset token
    return this.resetToken === hashedResetToken
}

export const OTP = model('OTP', otpSchema)