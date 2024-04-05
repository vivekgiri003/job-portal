import express from "express"
import testController from "../controller/testController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/testPost', userAuth, testController)

export default router;