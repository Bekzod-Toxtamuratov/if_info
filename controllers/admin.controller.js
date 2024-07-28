const { errorHandler } = require("../helpers/error.handler");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../schemas/admin");
const { to } = require("../helpers/to_promise");

const myJwt = require("../services/jwt_service");

const { adminValidation } = require("../validations/admin.validation");

const jwt = require("jsonwebtoken");
const config = require("config");

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    console.log(value);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      admin_name,
      admin_email,
      admin_phone,
      admin_password,
      admin_is_active,
      admin_is_creator,
      created_date,
      updated_date,
    } = value;
    const hashedPassword = bcrypt.hashSync(admin_password,7);

    const newAdmin = await Admin({
      admin_name,
      admin_email,
      admin_phone,
      admin_password: hashedPassword,
      admin_is_active,
      admin_is_creator,
      created_date,
      updated_date,
    });
    await newAdmin.save();

    const payload = {
      id: newAdmin._id,
      admin_is_creator: newAdmin.admin_is_creator,
    };

    const tokens = myJwt.generateTokens(payload);

    newAdmin.admin_token = tokens.refreshToken;

    await newAdmin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
    });

    res.status(200).send({ newAdmin, ...tokens });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;

    const admin1 = await Admin.findOne({ admin_email });
    if (!admin1)
      return res.status(400).send({ message: "Email yoki parol notogri " });

    const validPassword = bcrypt.compareSync(
      admin_password,
      admin1.admin_password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki parol notogri" });

    const payload = {
      id: admin1._id,
      admin_is_creator: admin1.admin_is_creator,
    };

    const tokens = myJwt.generateTokens(payload);

    admin1.admin_token = tokens.refreshToken;
    await admin1.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
    });
    res.status(200).send(tokens);
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie reshresh topilmadi " });
    }
    let admin = await Admin.findOneAndUpdate(
      {
        admin_token: refreshToken,
      },
      { admin_token: "" },
      { new: true }
    );

    if (!admin) {
      return res.status(400).send({
        message123: "Invalid token",
      });
    }

    res.clearCookie("refreshToken");
    res.send({ admin });
  } catch (error) {
    errorHandler(res, error);
    res.status(400).send({ message: error.message });
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie reshresh topilmadi " });
    }

    // bu yerda tokenimizni vertifikatsiya qilyapmiz bu yerda;
    const [error, adminDataFromCookie] = await to(
      myJwt.verifyReshrefToken(refreshToken)
    );

    if (error) {
      return res
        .status(403)
        .send({ message: "Admin  ro'yhatdan  o'tmagan (Token notog'ri ) " });
    }

    const adminDataFromDB = await Admin.findOne({
      admin_token: refreshToken,
    });

    if (!adminDataFromCookie) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan  (Admin yo'q) " });
    }

    const payload = {
      id: adminDataFromDB._id,
      is_expert: adminDataFromDB.is_expert,
      adminRoles: ["RED", "WRITE"],
    };

    const tokens = myJwt.generateTokens(payload);

    adminDataFromDB.admin_token = tokens.refreshToken;
    await adminDataFromDB.save();

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

const getAllAdmin = async (req, res) => {
  try {
    const admin1 = await Admin.find({});

    if (!admin1) {
      return res.status(400).send({ message: " Birorta admin topilmadi " });
    }

    res.json({ date: admin1 });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin1 = await Admin.findOne({ _id: req.params.id });

    if (!admin1) {
      return res.status(400).send({ message: "Bunday admin yo'q " });
    }
    return res.status(200).send(admin1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdminByName = async (req, res) => {
  try {
    const admin1 = await Admin.findOne().where({
      admin_name: new RegExp(req.params.name, "i"),
    });
    console.log(admin1);

    if (!admin1) {
      return res.status(400).send({ message: "Bunday admin yoq " });
    }

    return res.status(200).send(admin1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdminByid = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const admin1 = await Admin.deleteOne({ _id: req.params.id });

    console.log(admin1);

    if (!admin1) {
      return res.status(400).send({ message: "Bunday admin yo'q " });
    }

    res.status(200).send(admin1);
  } catch (error) {
    errorHandler(res, error);
  }
};
const updateAdminByid = async (req, res) => {
  const {
    admin_name,
    admin_email,
    admin_phone,
    admin_password,
    admin_is_active,
    admin_is_creator,
    created_date,
    updated_date,
  } = req.body;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const admin1 = await Admin.updateOne(
      { _id: req.params.id },

      {
        admin_name,
        admin_email,
        admin_phone,
        admin_password,
        admin_is_active,
        admin_is_creator,
        created_date,
        updated_date,
      }
    );

    console.log(admin1);

    if (!admin1) {
      return res.status(400).send({ message: "Bunday admin yo'q " });
    }

    res.status(200).send(admin1);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAdmin,
  getAllAdmin,
  getAdminById,
  getAdminByName,
  deleteAdminByid,
  updateAdminByid,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
};
