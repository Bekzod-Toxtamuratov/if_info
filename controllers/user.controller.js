const { errorHandler } = require("../helpers/error.handler");
const mongoose = require("mongoose");
const { to } = require("../helpers/to_promise");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../schemas/user");

const myJwt = require("../services/jwt_service");

const { userValidation } = require("../validations/user.validation");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    console.log(value);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      user_name,
      user_email,
      user_password,
      user_info,
      user_photo,
      created_date,
      updated_date,
      user_is_active,
    } = value;

    const hashedPassword = bcrypt.hashSync(user_password, 7);

    const newUser = await User({
      user_name,
      user_email,
      user_password: hashedPassword,
      user_info,
      user_photo,
      created_date,
      updated_date,
      user_is_active,
    });
    await newUser.save();

    const payload = {
      id: newUser._id,
      user_is_active: newUser.user_is_active,
    };

    const tokens = myJwt.generateTokens(payload);
    newUser.user_token = tokens.refreshToken;
    // console.log(tokens.refreshToken);

    await newUser.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
    });

    // res.status(200).send(tokens);
    res.status(200).send({ newUser, ...tokens });
  } catch (error) {
    errorHandler(res, error);
  }
};
const loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user1 = await User.findOne({ user_email });
    if (!user1)
      return res.status(400).send({ message: "Email yoki parol notogri " });

    const validPassword = bcrypt.compareSync(
      user_password,
      user1.user_password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki parol notogri" });

    const payload = {
      id: user1._id,
      user_is_active: user1.user_is_active,
    };
    const tokens = myJwt.generateTokens(payload);

    user1.user_token = tokens.refreshToken;
    await user1.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
    });
    res.status(200).send(tokens);
  } catch (error) {
    errorHandler(res, error);
  }
};
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie reshresh topilmadi " });
    }
    let user = await User.findOneAndUpdate(
      {
        user_token: refreshToken,
      },
      { user_token: "" },
      { new: true }
    );

    if (!user) {
      return res.status(400).send({
        message: "Invalid token",
      });
    }

    res.clearCookie("refreshToken");
    res.send({ user });
  } catch (error) {
    errorHandler(res, error);
    res.status(400).send({ message: error.message });
  }
};
const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie reshresh topilmadi " });
    }

    // bu yerda tokenimizni vertifikatsiya qilyapmiz bu yerda;
    const [error, userDataFromCookie] = await to(
      myJwt.verifyReshrefToken(refreshToken)
    );

    if (error) {
      return res
        .status(403)
        .send({ message: "user  ro'yhatdan  o'tmagan (Token notog'ri ) " });
    }

    const userDataFromDB = await User.findOne({
      user_token: refreshToken,
    });

    if (!userDataFromCookie) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan  (user yo'q) " });
    }

    const payload = {
      id: userDataFromDB._id,
      is_expert: userDataFromDB.is_expert,
      userRoles: ["RED", "WRITE"],
    };

    const tokens = myJwt.generateTokens(payload);

    userDataFromDB.user_token = tokens.refreshToken;
    await userDataFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send(tokens);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const user1 = await User.find({});

    if (!user1) {
      return res.status(400).send({ message: "Birorta user toplimadi " });
    }

    res.json({ date: user1 });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user1 = await User.findOne({ _id: req.params.id });

    if (!user1) {
      return res.status(400).send({ message: " Bunday user  yo'q" });
    }

    return res.status(200).send(user1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUserByName = async (req, res) => {
  try {
    const user1 = await User.findOne().where({
      user_name: new RegExp(req.params.name, "i"),
    });
    console.log(user1);

    if (!user1) {
      return res.status(400).send({ message: "Bunday user yo'q " });
    }

    return res.status(200).send(user1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUserByid = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const user1 = await User.deleteOne({ _id: req.params.id });

    console.log(user1);

    if (!user1) {
      return res.status(400).send({ message: "Bunday user yo'q" });
    }

    res.status(200).send(user1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUserByid = async (req, res) => {
  const {
    user_name,
    user_email,
    user_password,
    user_info,
    user_photo,
    created_date,
    updated_date,
    user_is_active,
  } = req.body;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const user1 = await User.updateOne(
      { _id: req.params.id },

      {
        user_name,
        user_email,
        user_password,
        user_info,
        user_photo,
        created_date,
        updated_date,
        user_is_active,
      }
    );

    console.log(user1);

    if (!user1) {
      return res.status(400).send({ message: "Bunday admin yo'q " });
    }

    res.status(200).send(user1);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addUser,
  getAllUser,
  getUserById,
  getUserByName,
  deleteUserByid,
  updateUserByid,
  loginUser,
  logoutUser,
  refreshUserToken,
};
