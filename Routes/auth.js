const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

//& for secret keys
dotenv.config();

//& Register
router.post("/register", async (req, res) => {
  //^ using model to create new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  //^ save new user to DB
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

//& Login
router.post("/login", async (req, res) => {});

module.exports = router;
