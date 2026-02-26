import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const User_Role = Object.freeze({
    ADMIN: 'admin',
    USER: 'user'
})

export const User_Status = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
})

const userSchema = new Schema({
    avatar: {
        type: String
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobileNo: {
        type: String,
        required: [true, 'Phone Number must be provided'],
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
        minlength: 6,
        maxlength: 15,
        select: false
    },
    role: {
        type: String,
        enum: Object.values(User_Role),
        default: User_Role.USER
    },
    about: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        trim: true,
    },
    isEmailBinded: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: Object.values(User_Status),
        default: User_Status.INACTIVE
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    accountStatus: {
        type: Boolean,
        default: true
    },
    accountVerified: {
        type: Boolean,
        default: false
    },
    credits: {
        type: Number,
        default: 30
    },
    refreshToken: {
        type: String,
        select: false
    }
}, { timestamps: true })

userSchema.index(
    { email: 1 }, { unique: true, sparse: true })

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model('User', userSchema)