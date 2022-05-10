const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwtExpire, jwtSecret } = require("../config/key");

exports.signupController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        errorMessage: "Email already exists"
      });
    }
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    res.json({
      successMessage: "Registration Success, Please signin"
    });
  } catch (err) {
    console.log("Controller error", err);
    res.status(500).json({
      errorMessage: "Server error"
    });
  }
};
exports.signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errorMessage: "Invalid Credentials"
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errorMessage: "Invalid Credentials"
      });
    }
    const payload = {
      user: {
        _id: user._id
      }
    };
    await jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: jwtExpire },
      (err, token) => {
        if (err) console.log("jwt error", err);
        const { _id, username, email, role } = user;

        res.json({
          token,
          user: { _id, username, email, role }
        });
      }
    );
  } catch (err) {
    console.log("Signin controller error", err);
    res.status(500).json({
      errorMessage: "Server error"
    });
  }
};
