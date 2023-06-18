import express from 'express'
import activitiesController from "../controllers/activitiesController.js"
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.get("/", activitiesController.getActivities)

router.post('/', activitiesController.createActivity)
router.post('/search', activitiesController.getActivitiesByQuery)

router.put('/', activitiesController.updateActivity)
router.put('/status', activitiesController.updateStatusCompleted)

router.delete('/', activitiesController.deleteActivity)

export default router