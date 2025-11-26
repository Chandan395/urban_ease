import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    price: Number,
    image: String,
    image_public_id: String,
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { timestamps: true }
);

serviceSchema.index({ location: "2dsphere" });

export default mongoose.model("Service", serviceSchema);
