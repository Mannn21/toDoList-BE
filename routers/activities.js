import express from 'express'
import activitiesController from "../controllers/activitiesController.js"
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.get("/", activitiesController.getActivities)

export default router