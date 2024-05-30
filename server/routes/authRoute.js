let express = require("express");
const {
  registrationController,
  loginController,
  verifyController,
  logoutController,
  logoutFromAllDeviceController,
  forgetPasswordController,
} = require("../controller/authController");
const { verifyToken } = require("../helper/authToken");
let route = express.Router();

//Registration || POST
route.post("/signup", registrationController);

//Login  || POST
route.post("/signin", loginController);

//Logout || GET
route.get("/logout/:id", logoutController);

//All-Logout || GET
route.get("/all-logout/:id", logoutFromAllDeviceController);

//Forget-Password || POST
route.post("/forget-password", forgetPasswordController);

//Token || GET
route.get("/token", verifyToken, verifyController);
module.exports = { authRoute: route };
