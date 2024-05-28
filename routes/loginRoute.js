import express from "express";
import { Login, Logout, Me, Register, deleteUser, getAllUsers, updateUser } from "../controllers/authLoginController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/refreshTokenController.js";
import { superAdminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/api/users', verifyToken, verifyUser, superAdminOnly, getAllUsers); // get all user data
router.post('/api/users', Register);  // create user
router.put("/api/users/:uuid", verifyToken, verifyUser, superAdminOnly, updateUser); // update user
router.delete("/api/users/:uuid", verifyToken, verifyUser, superAdminOnly, deleteUser); // delete user

router.post('/api/login', Login); // login 
router.get("/me", verifyToken, Me); // whoami
router.get('/api/token', refreshToken); // get refresh token
router.delete('/api/logout', verifyToken, verifyUser, Logout);

export default router;