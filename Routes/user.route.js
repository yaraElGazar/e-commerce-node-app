const router = require("express").Router();
const User = require("../Models/User");

//& MidlleWares
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../Middlewares/verifyToken");

//& Update user by id
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //^ check if the user updated the password => encrypt the new password
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  //^ update the user
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = router;
