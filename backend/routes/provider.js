import express from "express"
import auth from "../middlewares/auth.js"
import roles from "../middlewares/roles.js"
import Provider from "../models/Provider.js"

const router = express.Router()


router.get("/me", auth, roles(["provider"]), async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id })
    if (!provider) return res.status(404).json({ message: "Provider not found" })
    res.json(provider)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

export default router