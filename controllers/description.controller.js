const { errorHandler } = require("../helpers/error.handler");
// const Joi = require("joi");
const Description = require("../schemas/description");
const mongoose = require("mongoose");

const {
  descriptionValidate,
} = require("../validations/description.validation.js");

const addDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidate(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const { description, category_id } = value;

    const description1 = await Description.findOne({
      description: { $regex: description, $options: "i" },
    });
    if (description1) {
      return res.status(400).send({
        message: "description already exists",
      });
    }
    const newDescription = await Description({
      description,
      category_id,
    });
    await newDescription.save();
    res.status(200).send({ message: "description qoshildi" });
  } catch (error) {
    console.log("bekzod");
    console.log(error);
    errorHandler(res, error);
  }
};
const getAlldescription = async (req, res) => {
  try {
    const description1 = await Description.find({});
    res.status(201).send(description1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getdescriptionById = async (req, res) => {
  try {
    const description1 = await Description.findOne({ _id: req.params.id });

    if (!description1) {
      return res.status(400).send({ message: "Bunday description yoq " });
    }
    return res.status(200).send(description1);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getdescriptionByName = async (req, res) => {
  try {
    const description1 = await Description.findOne().where({
      description: new RegExp(req.params.name, "i"),
    });
    console.log(description1);

    if (!description1) {
      return res.status(400).send({ message: "Bunday description yo'q " });
    }

    return res.status(200).send(description1);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deletedescriptionByid = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }
    const description1 = await Description.deleteOne({ _id: req.params.id });

    console.log(description1);

    if (!description1) {
      return res.status(400).send({ message: "Bunday description yo'q " });
    }

    res.status(200).send(description1);
  } catch (error) {
    errorHandler(res, error);
  }
};
const updatedescriptionByid = async (req, res) => {
  const { description, category_id } = req.body;

  if (!description || !category_id) {
    return res.status(400).json({ message: "Togri kiriting " });
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const description1 = await Description.updateOne(
      { _id: req.params.id },
      {
        description,
        category_id,
      }
    );

    console.log(description1);

    if (!description1) {
      return res.status(400).send({ message: "Bunday description yo'q " });
    }

    res.status(200).send(description1);
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: message.error });
  }
};

module.exports = {
  addDescription,
  getAlldescription,
  getdescriptionById,
  getdescriptionByName,
  updatedescriptionByid,
  deletedescriptionByid,
};
