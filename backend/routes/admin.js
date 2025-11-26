import express from "express"
import {
  listAllUsers,
  listAllServices,
  listAllBookings,
  deleteService,
} from "../controllers/adminController.js"
import auth from "../middlewares/auth.js"
import roles from "../middlewares/roles.js"

const router = express.Router()

router.use(auth, roles(["admin"]))

router.get("/users", listAllUsers)
router.get("/services", listAllServices)
router.get("/bookings", listAllBookings)
router.delete("/service/:id", deleteService)

export default router