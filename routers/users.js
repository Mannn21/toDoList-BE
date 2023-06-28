import express from "express";
import usersController from "../controllers/usersController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, usersController.getUsers);
router.post("/find", verifyToken, usersController.getUserByEmail);
router.post("/", usersController.createUser);
router.put("/", verifyToken, usersController.updateUser);
router.post("/delete", verifyToken, usersController.deleteUser);

router.get("/refresh", usersController.getRefreshToken);
router.post("/login", usersController.login);
router.delete("/logout", verifyToken, usersController.logout);

export default router;
