import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "At least 8 characters should be provided"],
    select: false, // Do not select password by default
  },
  role: {
    type: String,
    enum: ["user", "admin", "guide", "lead-guide"],
    default: "user",
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm password is required"],
    validate: {
      validator: function (el) {
        return this.password === el; // Check if passwords match
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false, // Do not select active status by default
  },
});

// Middleware for hashing password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 15);
  this.passwordConfirm = undefined; // Clear passwordConfirm after hashing
  next();
});

// Middleware to set passwordChangedAt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // Set to current time minus 1 second
  next();
});

// Instance method to check if password has changed after a specific timestamp
userSchema.methods.changedPassword = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimeStamp; // Compare timestamps
  }
  return false; // No change if passwordChangedAt is undefined
};

// Instance method to check correct password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to create a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  return token; // Return the plain token
};

// Create and export User model
const User = mongoose.model("User", userSchema);
export default User;
