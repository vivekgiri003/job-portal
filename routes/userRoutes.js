import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { updateUserController } from "../controller/userController.js";

const router = express.Router();



//update user
router.put('/update-user', userAuth, updateUserController)

export default router;