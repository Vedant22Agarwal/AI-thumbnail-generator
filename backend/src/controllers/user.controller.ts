import { Request, Response } from "express";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import Thumbnail from "../models/thumbnail.models.js";

// Register User
export const registerUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { name, email, password } = req.body;

        // Validate Input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Create Session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id.toString();

        return res.status(201).json({
            message: "Account Created Successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { email, password } = req.body;

        // Validate Input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required",
            });
        }

        // Find User
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or Password",
            });
        }

        // Compare Password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Email or Password",
            });
        }

        // Create Session
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();

        req.session.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to save session",
                });
            }

            return res.status(200).json({
                message: "Login Successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        });
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Logout User
export const logoutUser = async (req: Request, res: Response): Promise<Response | void> => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Internal Server Error",
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logout Successful",
        });
    });
};

export const verifyUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { userId } = req.session;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(400).json({
                message: "Invalid User"
            })
        }
        res.status(200).json({ user })
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};


// all thumnail for a user
export const getAllThumnail = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { userId } = req.session;

        const thumbnails = await Thumbnail.find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            thumbnails,
        });
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getSingleThumbnail = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        const thumbnail = await Thumbnail.findOne({
            _id: id,
            userId,
        });

        if (!thumbnail) {
            return res.status(404).json({
                message: "Thumbnail not found.",
            });
        }

        return res.status(200).json({
            thumbnail,
        });
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};
