import bcrypt from "bcryptjs";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

// User Register Controller
const userRegister = async (req, res) => {
  const { name, email, password, googleId, profileImage } = req.body; // Removed facebookId

  // Manual Validation for required fields
  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be at least 3 characters long",
    });
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }

  if (!googleId && !password) {
    return res.status(400).json({
      success: false,
      message: "Password is required and must be at least 6 characters long if not using Google login",
    });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create a new user instance
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
        profileImage: profileImage || "",
      });
    } else if (googleId) {
      user = new User({
        name,
        email,
        googleId: googleId,
        profileImage: profileImage || "",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Either password or Google ID is required",
      });
    }

    // Save the user to the database
    await user.save();

    // Convert the Mongoose document to a plain object to avoid circular references
    const plainUser = user.toObject();

    // Generate JWT token
    const token = generateToken(res, plainUser, `Welcome user ${plainUser.name}`);

    // Send a success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: plainUser._id,
        name: plainUser.name,
        email: plainUser.email,
        profileImage: plainUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);

    // Send a single error response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Something went wrong while registering the user",
      });
    }
  }
};

export default userRegister;
