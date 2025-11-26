import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bio: String,
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);
