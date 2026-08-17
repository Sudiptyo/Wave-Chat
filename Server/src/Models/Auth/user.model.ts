import { HydratedDocument, Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const User_Role = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const User_Status = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export type UserRole = (typeof User_Role)[keyof typeof User_Role];
export type UserStatus = (typeof User_Status)[keyof typeof User_Status];

export interface IUser {
  avatar?: string;
  fullName: string;
  userName: string;
  mobileNo: string;
  password: string;
  role: UserRole;
  about?: string;
  email?: string;
  emailVerified?: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastSeen: Date;
  //   accountStatus: boolean;
  //   accountVerified: boolean;
  credits: number;
  refreshToken?: string;
}

interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

type UserDocument = HydratedDocument<IUser, IUserMethods>;
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    avatar: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: [true, "Phone Number must be provided"],
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
      match: [/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
      minlength: 6,
      maxlength: 15,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(User_Role),
      default: User_Role.USER,
    },
    about: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(User_Status),
      default: User_Status.INACTIVE,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    // accountStatus: {
    //   type: Boolean,
    //   default: true,
    // },
    // accountVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    credits: {
      type: Number,
      default: 100,
      validate: {
        validator: Number.isInteger,
        message: "Credits must be an integer",
      },
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });

userSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: UserDocument): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiry = process.env.ACCESS_TOKEN_EXPIRY as StringValue;

  if (!secret) {
    throw new Error("JWT_SECRET missing");
  }

  if (!expiry) {
    throw new Error("JWT_EXPIRY missing");
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    secret,
    {
      expiresIn: expiry,
    },
  );
};

userSchema.methods.generateRefreshToken = function (
  this: UserDocument,
): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiry = process.env.REFRESH_TOKEN_EXPIRY as StringValue;

  if (!secret) {
    throw new Error("JWT_SECRET missing");
  }

  if (!expiry) {
    throw new Error("JWT_EXPIRY missing");
  }
  return jwt.sign(
    {
      _id: this._id,
    },
    secret,
    {
      expiresIn: expiry,
    },
  );
};

export const User = model<IUser, UserModel>("User", userSchema);
