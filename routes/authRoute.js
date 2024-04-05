import express from "express"
import { loginController, registerController } from "../controller/authController.js";
import rateLimit from "express-rate-limit";


//limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - cpassword
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of user collection
 *         firstName:
 *           type: string
 *           description: First name
 *         lastName:
 *           type: string
 *           description: Last name
 *         email:
 *           type: string
 *           description: email
 *         password:
 *           type: string
 *           description: user password greater than 8 character
 *         cpassword:
 *           type: string
 *           description: confirm password
 *         location:
 *           type: string
 *           description: user location
 *       example:
 *         id: "fjsfgdsl76d8f7s"
 *         firstName: "Albus"
 *         lastName: "Dumbledore"
 *         email: "albusdumbledore123@gmail.com"
 *         password: "12345678"
 *         cpassword: "12345678"
 *         location: "Hogwarts"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     login: 
 *       type: object
 *       required: 
 *         -email
 *         -password
 *       properties:
 *         email:
 *           type: string
 *           description: Enter your email
 *         password:
 *           type: string
 *           description: Enter your password
 */

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: authentication apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new user
 *     tags : [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref : '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref : '#/components/schemas/User'
 *       '500':
 *         description: internal server errror
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       '200':
 *         description: login successfull
 *         content:
 *           application/json:
 *             schema: 
 *               $ref : '#/components/schemas/login'
 *       '500':
 *         description: something went wrong
 *          
 */

router.post('/register', limiter, registerController)
router.post('/login', limiter, loginController)

export default router;