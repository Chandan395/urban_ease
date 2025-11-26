import express from "express";
import {
  listServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import auth from "../middlewares/auth.js";
import roles from "../middlewares/roles.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", listServices);
router.get("/:id", getService);

router.post("/", auth, roles(["provider", "admin"]), upload.single("image"), createService);

router.patch("/:id", auth, roles(["provider", "admin"]), upload.single("image"), updateService);

router.delete("/:id", auth, roles(["provider", "admin"]), deleteService);

export default router;
