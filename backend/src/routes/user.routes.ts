import { Router } from 'express';
import { getAllThumnail, getSingleThumbnail, loginUser, logoutUser, registerUser, verifyUser } from '../controllers/user.controller.js';
import protectUser from '../middleware/auth.middleware.js';
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").get(protectUser, verifyUser);
router.route("/logout").get(protectUser, logoutUser);

// thumbnail routes 
router.route("/thumbnails").get(protectUser, getAllThumnail);
router.route("/thumbnail/:id").get(protectUser, getSingleThumbnail);





export default router;