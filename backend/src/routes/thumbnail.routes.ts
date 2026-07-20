import {Router} from 'express';
import { deleteThumbnail, generateThumbnail, updateThumbnail } from '../controllers/thumbnial.controller.js';
import protectUser from '../middleware/auth.middleware.js';
const router = Router();


router.route("/generate").post(protectUser,generateThumbnail);
router.route(
  "/:id"
).put(protectUser,updateThumbnail);
router.route("/delete/:id").delete(protectUser,deleteThumbnail);



export default router;