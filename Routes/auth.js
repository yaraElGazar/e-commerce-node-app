const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

//& for secret keys
dotenv.config();

//& Register
router.post("/register", async (req, res) => {
  //^ using model to create new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,

    //^ hashing the password using CryptoJS
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
router.post("/login", async (req, res) => {
  try {
    //^ Get the user from the DB
    const user = await User.findOne({ username: req.body.username });

    //! if user doesnot exist
    !user && res.status(401).send("Wrong credentials!");

    //^ decrypt the password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    //^ stringify the password
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    //! if password not correct
    originalPassword !== req.body.password &&
      res.status(401).send("Wrong credentials!");

    //** If everything is good, return the user without the password ang give them JWT */
    //^ JWT
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRETKEY,
      { expiresIn: "3d" }
    );

    //^ destructure the user to eliminate the password
    const { password, ...others } = user._doc;

    //^ send user info with access token
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    // res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
