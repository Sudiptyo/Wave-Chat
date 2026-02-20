import { asyncHandler } from "../../Utils/asyncHandler.js";
import { User } from "../../Models/Auth/user.model.js";
import jwt from 'jsonwebtoken'

const verifyJwt = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.AccessToken
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        req.user = user;

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access",
            error: err.message
        })
    }

})

export { verifyJwt }