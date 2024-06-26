const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../helper/authToken");
let bcrypt = require("bcrypt");
let slugify = require("slugify");
const registration = require("../models/registrationModel");

//This is for registration
let registrationController = async (req, res, next) => {
  try {
    let { name, phone, email, password, gender, secret } = req.body;
    if (!name || !phone || !email || !password || !gender || !secret) {
      return res.status(500).send({ message: "All fields are required *" });
    } else {
      let result = await new registration({
        slug: slugify(name),
        ...req.body,
      }).save();
      if (result) {
        res
          .status(201)
          .send({ message: "Successfully Register", user: result });
      } else {
        return res.status(500).send({ message: "All fields are required *" });
      }
    }
  } catch (error) {
    next(error);
  }
};

//This is for the login
let loginController = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(500)
        .send({ message: "All field is required *", success: false });
    } else {
      let availableUser = await registration.findOne({ email: email });
      if (availableUser) {
        let validUser = await availableUser.comparePassword(
          password,
          availableUser.password
        );
        if (validUser) {
          //Access Token and Refresh Token
          let accessToken = await accessTokenGenerator(availableUser.id);
          let refreshToken = await refreshTokenGenerator(availableUser.id);
          availableUser.addToken(accessToken);
          res.status(200).send({ access: accessToken, refresh: refreshToken });
        } else {
          res
            .status(500)
            .send({ message: "Either password or email is wrong" });
        }
      } else {
        return res
          .status(200)
          .send({ message: "User is not Registered", success: false });
      }
    }
  } catch (error) {
    next(error);
  }
};

//This is for the logout
let logoutController = async (req, res, next) => {
  try {
    let { id } = req.params;
    let token = req.headers.authorization;
    if (!id || !token)
      return res
        .status(402)
        .send({ message: "Something Wrong, While Logout", success: false });
    let findUser = await registration.findOne({
      _id: id,
      token: { $in: [token] },
    });
    if (!findUser)
      return res
        .status(402)
        .send({ message: "Something Wrong, While Logout", success: false });
    let afterDelete = await findUser.removeToken(token);
    res
      .status(200)
      .send({ message: "User Logout Successfully", success: true });
  } catch (error) {
    next(error);
  }
};

//This is for logout from all devices
let logoutFromAllDeviceController = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id)
      return res.status(402).send({
        message: "Something Wrong, While All Device Logout",
        success: false,
      });
    let findUser = await registration.findOne({
      _id: id,
    });
    if (!findUser)
      return res.status(402).send({
        message: "Something Wrong ,While All Device Logout",
        success: false,
      });
    let afterDelete = await findUser.removeAllToken();
    res.status(200).send({
      message: "User Logout From All Device Successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

//This is for the forget-password
let forgetPasswordController = async (req, res, next) => {
  try {
    let { email, password, secret } = req.body;
    if (!email || !password || !secret)
      return res
        .status(400)
        .send({ success: false, message: "All fields required *" });
    let verifyUser = await registration.findOne({ email, secret });
    if (!verifyUser)
      return res
        .status(400)
        .send({ success: false, message: "User is not Registered" });
    let hashPassword = await bcrypt.hash(password, 10);
    let updateUser = await registration.findOneAndUpdate(
      { email },
      { password: hashPassword },
      { new: true }
    );
    if (!updateUser)
      return res
        .status(500)
        .send({ success: false, message: "Something wrong!" });
    res
      .status(201)
      .send({ message: "Password Update Successfully", success: true });
  } catch (err) {
    next(err);
  }
};
let verifyController = async (req, res) => {
  res.json({ ok: "done" });
};

module.exports = {
  registrationController,
  loginController,
  verifyController,
  logoutController,
  logoutFromAllDeviceController,
  forgetPasswordController,
};
