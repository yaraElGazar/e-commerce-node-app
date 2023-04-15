//& requires
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./Routes/user.route.js");
const authRoute = require("./Routes/auth.js");

//& express app
const app = express();

//& for secret keys
dotenv.config();

//& mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

//& endpoints
app.use(express.json()); //^ so that POST request will accept JSON in body
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

//& listen on PORT 5000
app.listen(process.env.PORT || 5000, () => {
  console.log("Sever running...");
});
