import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    mobile: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
    verified: { type: Boolean, default: false },
    otp: {
      code: String,
      expiresAt: Date,
    },
    resetToken: {
      code: String,
      expiresAt: Date,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
