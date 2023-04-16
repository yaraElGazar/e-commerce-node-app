//& Midlleware to verify tokens
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//& for secret keys
dotenv.config();

//& Verify Token function
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  //^ check if there is header
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    //^ verify the token
    jwt.verify(token, process.env.JWT_SECRETKEY, (error, user) => {
      if (error) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Not authenticated!");
  }
};

//& Verify token and authorization function
const verifyTokenAndAuthorization = (req, res, next) => {
  //^ verify the token
  verifyToken(req, res, () => {
    //^ the user wants to update his/her info or the admon wants to update the user's info
    if (req.user.id === req.params.id || req.user.isAdmin) {
      //^ continue the root function
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
