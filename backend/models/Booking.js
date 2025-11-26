import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    address: String,
    status: {
      type: String,
      enum: ["scheduled", "on_the_way", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    rating: Number,
    review: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
