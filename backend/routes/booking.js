import express from "express"
import {
  createBooking,
  listUserBookings,
  listProviderBookings,
  updateStatus,
  rateBooking,
} from "../controllers/bookingController.js"
import auth from "../middlewares/auth.js"
import roles from "../middlewares/roles.js"

const router = express.Router()

router.post("/", auth, roles(["user"]), createBooking)
router.get("/me", auth, roles(["user"]), listUserBookings)
router.get("/provider", auth, roles(["provider"]), listProviderBookings)
router.patch("/:id/status", auth, roles(["provider", "admin"]), updateStatus)
router.post("/:id/rate", auth, roles(["user"]), rateBooking)

export default router