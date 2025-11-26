import Service from "../models/Service.js";
import Provider from "../models/Provider.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

export const createService = async (req, res) => {
  try {
    const { title, category, description, price } = req.body;

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(400).json({ message: "Provider profile not found" });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file?.path) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename || null;
    }

    const service = new Service({
      title,
      category,
      description,
      price,
      image: imageUrl,
      image_public_id: imagePublicId,
      provider: provider._id,
    });

    await service.save();
    provider.services.push(service._id);
    await provider.save();

    res.status(201).json({
      message: "Service created successfully",
      service: {
        _id: service._id,
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        image: service.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const id = req.params.id;

    const updates = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      price: Number(req.body.price),
    };

    if (!updates.title || !updates.category || !updates.price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (req.file) {
      updates.image = req.file.path;
    }

    const updated = await Service.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update service",
      error: err.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(id).populate("provider");
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const provider = await Provider.findOne({ user: req.user._id });
    const isOwner =
      provider &&
      provider._id.toString() === service.provider._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (service.image_public_id) {
      await cloudinary.uploader.destroy(service.image_public_id).catch(() => {});
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const listServices = async (req, res) => {
  try {
    const { lat, lng, radius = 10, category } = req.query;
    const query = {};

    if (category) query.category = category;

    if (lat && lng) {
      const meters = parseFloat(radius) * 1000;
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: meters,
        },
      };
    }

    const services = await Service.find(query).populate({
      path: "provider",
      populate: { path: "user", model: "User" },
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing service ID" });
    }

    const service = await Service.findById(id).populate({
      path: "provider",
      populate: { path: "user", model: "User" },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
