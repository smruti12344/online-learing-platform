import bcrypt from "bcryptjs";
import User from "../models/userModels.js";
import verifyFirebaseToken from "../service/firebaseAuth.js";
import generateToken from "../utils/generateToken.js";

const userLogin = async (req, res) => {
  const { token, email, password } = req.body;

  try {
    if (token) {
      // Handle Google login
      const decodedToken = await verifyFirebaseToken(token);
      let user = await User.findOne({ email: decodedToken.email }).lean();

      if (!user) {
        // If user does not exist, create a new one
        const newUser = new User({
          name: decodedToken.name,
          email: decodedToken.email,
          googleId: decodedToken.uid,
          profileImage: decodedToken.picture || "",
        });

        await newUser.save();

        user = newUser.toObject(); // Convert to plain object
      }

      // Generate JWT token
      const jwtToken = generateToken(res, user, `Welcome back, ${user.name}`);
      console.log("userLogin success");
      return jwtToken;
    }

    if (email && password) {
      // Handle email/password login
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Incorrect email or password",
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect email or password",
        });
      }

      // Generate JWT token
      const jwtToken = generateToken(res, user, `Welcome user ${user.name}`);
      return jwtToken;
    
    }

    // If neither token nor email/password is provided
    return res.status(400).json({
      error: "Either token or email/password must be provided",
    });
  } catch (error) {
    console.error("Login error:", error);

    // Check if headers are already sent
    if (!res.headersSent) {
      return res.status(500).json({ error: "Error during login" });
    }
  }
};

export default userLogin;
