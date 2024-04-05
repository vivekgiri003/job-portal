import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { createJobController, deleteJobController, getAllJobController, jobStatsController, updateJobController } from "../controller/jobController.js";

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - company
 *         - position
 *         - required Skills
 *         - eligibility
 *         - workType
 *         - workLocation
 *       properties:
 *         id: 
 *           type: string
 *           description: The auto-generated id of user collection
 *         company:
 *           type: string
 *           description: Company name
 *         position:
 *           type: string
 *           description: Position name
 *         description:
 *           type: string
 *           description: description
 *         required Skills:
 *           type: string
 *           description: skill you have
 *         eligibility:
 *           type: string
 *           description: hiring criteria
 *         status:
 *           type: string
 *           description: current status
 *           enum: ['pending','reject','interview']
 *           default: pending
 *         workType:
 *           type: string
 *           description: work type
 *           enum: ['full-time','part-time','internship']
 *           defalut: full-time
 *         workLocation:
 *           type: string
 *           description: user location
 *           default: remote
 *       example:
 *         id: "fjsfgdsl76d8f7s"
 *         company: "TCS"
 *         position: "software developer"
 *         description: "software developer for developing software"
 *         requiredSkills: "DSA, OOPs, C++/Java, Problem Solving, Development"
 *         status: "pending"
 *         workType: "internship"
 *         workLocation: " Banglore"
 */



router.post('/create-job', userAuth, createJobController)

router.get('/get-job', userAuth, getAllJobController)

router.patch("/update-job/:id", userAuth, updateJobController)

router.delete("/delete-job/:id", userAuth, deleteJobController)

router.get("/job-stats", userAuth, jobStatsController)
export default router;