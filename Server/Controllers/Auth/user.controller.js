import { User } from '../../Models/Auth/user.model.js';
import { asyncHandler } from '../../Utils/asyncHandler.js';
import { uploadOnCloudinary } from '../../Utils/cloudinary.js'
import jwt from 'jsonwebtoken'

const options = {
    httpOnly: true,
    secure: false,
    sameSite: "none"
}

const generateAccessAndRefreshToken = async (userId, res) => {
    try {
        const user = await User.findById(userId);
        const AccessToken = user.generateAccessToken();
        const RefreshToken = user.generateRefreshToken()

        user.refreshToken = RefreshToken;
        user.save({ validateBeforeSave: false })

        return { AccessToken, RefreshToken }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        return null;
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, userName, mobileNo } = req.body
    console.log("Registration body received:", req.body);

    if ([fullName, userName, mobileNo].some((item) => item?.trim() === '')) {
        return res.status(400).json({
            success: false,
            message: "All fields are Required"
        })
    }

    const existedUser = await User.findOne({
        $or: [{ fullName }, { mobileNo }]
    })

    if (existedUser) {
        return res.status(409).json({
            success: false,
            message: "User already Exists"
        })
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Avatar is Required"
        })
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        return res.status(500).json({
            success: false,
            message: "Avatar Upload Failed"
        })
    }

    const user = await User.create({
        fullName,
        userName,
        mobileNo,
        avatar
    })

    const createdUser = await User.findById(user._id)
    if (!createdUser) {
        return res.status(500).json({
            success: false,
            message: "User not Created",
        })
    }

    const token = await generateAccessAndRefreshToken(user.id, res);
    if (!token) return;

    const { AccessToken, RefreshToken } = token;

    const registerUser = await User.findById(user._id).select('-password -refreshToken')
    if (!registerUser) {
        return res.status(500).json({
            success: false,
            message: "User not registered"
        });
    }

    return res.status(200)
        .cookie('AccessToken', AccessToken, options)
        .cookie('RefreshToken', RefreshToken, options)
        .json({
            success: true,
            message: "User Registered Successfully",
            data: registerUser
        })
})

const createPassword = asyncHandler(async (req, res) => {

})

const loginUser = asyncHandler(async (req, res) => {

    const { mobileNo, password } = req.body;
    console.log("Login body received:", req.body);

    if ([fullName, mobileNo].some((item) => item?.trim === '')) {
        return res.status(400).json({
            success: false,
            message: "All fields are Required"
        })
    }

    const user = await User.findOne({ mobileNo })

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not Found"
        })
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid Password"
        })
    }

    const token = await generateAccessAndRefreshToken(user._id, res)
    if (!token) return;

    const { AccessToken, RefreshToken } = token;

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')
    if (!loggedInUser) {
        return res.status(500).json({
            success: false,
            message: "User not found"
        });
    }

    return res.status(200)
        .cookie('AccessToken', AccessToken, options)
        .cookie('RefreshToken', RefreshToken, options)
        .json({
            success: true,
            message: "User logged in successfully",
            data: loggedInUser
        })
})

const loginWithEmail = asyncHandler(async (req, res) => {

    const { email } = req.body;
    console.log("Login Email received:", req.body);

    if (!email && email.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "Email is Required"
        })
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not Found"
        })
    }

    const token = await generateAccessAndRefreshToken(user._id)
    if (!token) return;

    const { AccessToken, RefreshToken } = token;

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')
    if (!loggedInUser) {
        return res.status(500).json({
            success: false,
            message: "User not found"
        });
    }

    return res.status(200)
        .cookie('AccessToken', AccessToken, options)
        .cookie('RefreshToken', RefreshToken, options)
        .json({
            success: true,
            message: "User logged in successfully",
            data: loggedInUser
        })

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .clearCookies("AccessToken", options)
        .clearCookies("RefreshToken", options)
        .json({
            success: true,
            message: "User logged out successfully"
        })

})

const getUser = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId).select('-password -refreshToken')
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    return res.status(200)
        .json({
            success: true,
            message: "User data successfully fetched",
            data: user
        })

})

const refreshAccessToken = asyncHandler(async (req, res) => {

    try {
        const incomingRefreshToken = req.cookies?.RefreshToken;
        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Request"
            })
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
        if (!user) {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid Refresh Token"
                })
            }
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh Token is Expired or Used"
            })
        }

        const token = await generateAccessAndRefreshToken(user._id, res);
        if (!token) return;

        const { AccessToken, RefreshToken } = token;

        return res.status(200)
            .cookie('AccessToken', AccessToken, options)
            .cookie('RefreshToken', RefreshToken, options)
            .json({
                success: true,
                message: "Access Token Refreshed Successfully",
                data: {
                    accessToken: AccessToken
                }
            })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Forbidden Request"
        })
    }

})

const updateUser = asyncHandler(async (req, res) => {

})

const forgotPassword = asyncHandler(async (req, res) => {

})

const changePassword = asyncHandler(async (req, res) => {

})

export { registerUser, loginUser, logoutUser, getUser, refreshAccessToken, updateUser, forgotPassword, changePassword }