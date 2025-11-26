import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";

export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

export const listAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate({
      path: "provider",
      populate: {
        path: "user",
        model: "User",
        select: "-password",
      },
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: err.message,
    });
  }
};

export const listAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "-password")
      .populate({
        path: "provider",
        populate: {
          path: "user",
          model: "User",
          select: "-password",
        },
      })
      .populate("service");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Service.findByIdAndDelete(id);

    if (!removed) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete service",
      error: err.message,
    });
  }
};
