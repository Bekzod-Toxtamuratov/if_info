const mongoose = require("mongoose");

const { errorHandler } = require("../helpers/error.handler");
const Author = require("../schemas/author");
const { to } = require("../helpers/to_promise");
const { authorValidation } = require("../validations/author.validation");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const myJwt = require("../services/jwt_service");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");
const author = require("../schemas/author");
const { log } = require("winston");

const addAuthor = async (req, res) => {
  console.log("addAuthor");
  try {
    const { error, value } = authorValidation(req.body);
    console.log("value :  ", value);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password,
      author_info,
      author_position,
      author_photo,
      is_expert,
      author_is_active,
    } = value;

    const hashedPassword = bcrypt.hashSync(author_password, 7);

    const author_activation_link = uuid.v4();

    const newAuthor = await Author({
      author_first_name,
      author_last_name,
      author_nick_name,
      author_email,
      author_phone,
      author_password: hashedPassword,
      author_info,
      author_position,
      author_photo,
      is_expert,
      author_is_active,
      author_activation_link,
    });

    await newAuthor.save();

    await mail_service.sendActivationMail(
      author_email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/author/activation/${author_activation_link}`
    );

    const payload = {
      id: newAuthor._id,
      is_expert: newAuthor.is_expert,
      authorRoles: ["RED", "WRITE"],
      author_is_active: newAuthor.author_is_active,
    };

    const tokens = myJwt.generateTokens(payload);

    newAuthor.author_token = tokens.refreshToken;
    console.log(tokens.refreshToken);

    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send({ payload, ...tokens });
  } catch (error) {
    console.log("catch ishladi ");
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { author_email, author_password } = req.body;
    const author = await Author.findOne({ author_email });
    if (!author) {
      return res.status(400).send({ message: "Email yoki parol notogri " });
    }

    const validPassword = bcrypt.compareSync(
      author_password, // fronerend kelgan ochiq parol;
      author.author_password // bazadan olingan hashlangan password;
    );

    if (!validPassword) {
      return res.status(400).send({ message: "Email123 yoki parol notogri" });
    }

    // const token = jwt.sign({ _id: author._id }, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenTime"), // 5d,1h  *h
    // });

    const payload = {
      id: author._id,
      is_expert: author.is_expert,
      authorRoles: ["RED", "WRITE"],
    };

    const tokens = myJwt.generateTokens(payload);

    author.author_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    // console.log(tokens);
    // uncaughtException example;


    // try {
    //   setTimeout(function () {
    //     var err = new Error("UncaughtException example");
    //     throw err;
    //   }, 1000);
    // } catch (err) {
    //   console.log("bekzod");
    //   console.log("err = ", err);
    // }

    // new Promise((_, reject) => reject(new Error("UnhandledRejection example")));

    res.status(200).send(tokens);

  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie reshresh topilmadi " });
    }
    let author = await Author.findOneAndUpdate(
      {
        author_token: refreshToken,
      },
      { author_token: "" },
      { new: true }
    );

    if (!author) {
      return res.status(400).send({
        message: "Invalid token",
      });
    }

    res.clearCookie("refreshToken");
    res.send({ author });
  } catch (error) {
    errorHandler(res, error);
    res.status(400).send({ message: error.message });
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie reshresh topilmadi " });
    }

    // bu yerda tokenimizni vertifikatsiya qilyapmiz bu yerda;
    const [error, authorDataFromCookie] = await to(
      myJwt.verifyReshrefToken(refreshToken)
    );

    if (error) {
      return res
        .status(403)
        .send({error:error.message});
    }

    const authorDataFromDB = await Author.findOne({
      author_token: refreshToken,
    });

    if (!authorDataFromCookie) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan  (Avrot yo'q) " });
    }

    const payload = {
      id: authorDataFromDB._id,
      is_expert: authorDataFromDB.is_expert,
      authorRoles: ["RED", "WRITE"],
    };

    const tokens = myJwt.generateTokens(payload);

    authorDataFromDB.author_token = tokens.refreshToken;
    await authorDataFromDB.save();

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

const getAllAuthor = async (req, res) => {
  try {
    const authors = await Author.find({});

    if (!authors) {
      return res.status(400).send({ message: "Birorta avtor toplimadi " });
    }

    res.json({ data: authors });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.author.id);

    if (req.params.id !== req.author.id) {
      return res
        .status(403)
        .send({ message: "Faqat ozimizning malumotlaringizni kora olasiz " });
    }
    const authors = await Author.findOne({ _id: req.params.id });

    if (!authors) {
      return res.status(400).send({ message: "Bunday author yoq " });
    }
    return res.status(200).send(authors);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getAuthorByName = async (req, res) => {
  try {
    const author1 = await Author.findOne().where({
      author_first_name: new RegExp(req.params.name, "i"),
    });
    console.log(author1);

    if (!author1) {
      return res.status(400).send({ message: "Bunday author yoq " });
    }

    return res.status(200).send(author1);
  } catch (error) {
    errorHandler(res, error);
  }
};
const deleteAuthorByid = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const author1 = await Author.deleteOne({ _id: req.params.id });

    console.log(author1);

    if (!author1) {
      return res.status(400).send({ message: "Bunday author yoq " });
    }

    res.status(200).send(author1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthorByid = async (req, res) => {
  const {
    author_first_name,
    author_last_name,
    author_nick_name,
    author_email,
    author_phone,
    author_password,
    author_info,
    author_position,
    author_photo,
    is_expert,
    author_is_active,
  } = req.body;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const author1 = await Author.updateOne(
      { _id: req.params.id },
      {
        author_first_name,
        author_last_name,
        author_nick_name,
        author_email,
        author_phone,
        author_password,
        author_info,
        author_position,
        author_photo,
        is_expert,
        author_is_active,
      }
    );

    console.log(author1);

    if (!author1) {
      return res.status(400).send({ message: "Bunday author yoq " });
    }

    res.status(200).send(author1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const authorActivate = async (req, res) => {
  try {
    const author = await Author.findOne({
      author_activation_link: req.params.link,
    });
    if (!author) {
      return res.status(400).send({ message: "Activation link yo'q" });
    }

    if (author.author_is_active) {
      return res.status(400).send({ message: "Author is already activated" });
    }

    author.author_is_active = true;
    await author.save();
    res.send({
      author_is_active: author.author_is_active,
      message: "Author activated",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAuthor,
  getAllAuthor,
  getAuthorById,
  getAuthorByName,
  deleteAuthorByid,
  updateAuthorByid,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
};
