import mongoose from "mongoose";

//create schema for user
const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true }, // Full name of the user
      email: { type: String, required: true, unique: true }, // Email is the unique identifier
      password: { 
        type: String, 
        required: function () {
          return !this.googleId && !this.facebookId;
        } // Password is required only if not using OAuth
      },
      googleId: { type: String, unique: true, sparse: true }, // Google OAuth unique ID
      role: { type: String, enum: ["Student", "Instructor"], default: "Student" }, // User role
      profileImage: { type: String, default: '' }, // Profile picture URL
      enrolledCourses: [
        {
          courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Course reference
          progress: { type: Number, default: 0 }, // Completion percentage
          lastAccessed: { type: Date, default: Date.now }, // Last access date
        },
      ],
    },
    { timestamps: true }
  );

  const User = mongoose.model("User",userSchema);
  export default User;
