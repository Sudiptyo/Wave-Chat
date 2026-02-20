import { Router } from "express";
import { changePassword, forgotPassword, getUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUser } from "../../Controllers/Auth/user.controller.js";
import { verifyJwt } from "../../Middleware/Auth/user.middleware.js";
import { upload } from '../../Middleware/Upload/multer.middleware.js'

const router = Router();

router.route('/register').post(upload.single(
    {
        name: 'avatar',
        maxCount: 1
    }
), registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt, logoutUser)
router.route('/get').get(verifyJwt, getUser)
router.route('/refresh-accessToken').post(refreshAccessToken)
router.route('/update').post(verifyJwt, updateUser)
router.route('/forgot-password').post(verifyJwt, forgotPassword)
router.route('/change-password').post(verifyJwt, changePassword)

export default router;