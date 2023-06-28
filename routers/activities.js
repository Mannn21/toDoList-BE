import express from "express";
import activitiesController from "../controllers/activitiesController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, activitiesController.getActivitiesByDateNow);
router.get("/all", verifyToken, activitiesController.getActivitiesByUser)

router.post("/", activitiesController.createActivity);
router.post("/search", verifyToken, activitiesController.getActivitiesByQuery);

router.put("/", verifyToken, activitiesController.updateActivity);
router.put("/status", verifyToken, activitiesController.updateStatusCompleted);

router.delete(
	"/:userId/:id/:category",
	verifyToken,
	activitiesController.deleteActivity
);

export default router;
