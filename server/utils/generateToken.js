import jwt from "jsonwebtoken";

const generateToken = (res, user, message) => {
  try {
    // Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set the token as an HTTP-only cookie
    res.cookie("jwtToken", jwtToken, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      sameSite: "strict", // Ensures the cookie is sent only on same-site requests
      maxAge: 24 * 60 * 60 * 1000, // Valid for 1 day
    });

    // Send response with token, user details, and success message
    return res.status(200).json({
      success: true,
      message,
      token: jwtToken, // Include token in response for optional client storage
      user,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate token",
    });
  }
};

export default generateToken;

