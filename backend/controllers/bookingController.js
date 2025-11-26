import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";
import Service from "../models/Service.js";

export const createBooking = async (req, res) => {
  try {
    const { serviceId, date, address } = req.body;

    if (!serviceId || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = new Booking({
      user: req.user._id,
      service: serviceId,
      date,
      address,
      provider: service.provider,
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role === "provider") {
      const provider = await Provider.findOne({ user: req.user._id });
      const mismatch =
        !provider ||
        provider._id.toString() !== booking.provider.toString();

      if (mismatch) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listUserBookings = async (req, res) => {
  try {
    const list = await Booking.find({ user: req.user._id })
      .populate("service")
      .populate("provider");

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(400).json({ message: "No provider profile found" });
    }

    const list = await Booking.find({ provider: provider._id })
      .populate("service")
      .populate("user");

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    booking.rating = rating;
    booking.review = review;
    await booking.save();

    const provider = await Provider.findById(booking.provider);
    provider.rating =
      (provider.rating * provider.ratingsCount + rating) /
      (provider.ratingsCount + 1);
    provider.ratingsCount += 1;

    await provider.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
