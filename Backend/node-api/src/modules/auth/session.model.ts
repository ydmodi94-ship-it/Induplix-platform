import { Schema, model } from "mongoose";

export interface ISession {
  _id: string; // Opaque session ID token
  userId: Schema.Types.ObjectId;
  role: string;
  csrfSecret: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    csrfSecret: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB TTL index to auto-expire documents
    },
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false,
  }
);

export const Session = model<ISession>("Session", sessionSchema);

