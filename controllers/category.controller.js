const { errorHandler } = require("../helpers/error.handler");
// const Joi = require("joi");
const category = require("../schemas/category");
const mongoose = require("mongoose");
const { categoryValidation } = require("../validations/category.validation");

const addTCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const { category_name, parent_category_id } = value;

    const category1 = await category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (category1) {
      return res.status(400).send({
        message: "category already exists",
      });
    }
    const newCategory = await category({
      category_name,
      parent_category_id,
    });
    await newCategory.save();
    res.status(200).send({ message: "Category qoshildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await category.find({});
    res.status(201).send(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getCategoriesById = async (req, res) => {
  try {
    const categories = await category.findOne({ _id: req.params.id });

    if (!categories) {
      return res.status(400).send({ message: "Bunday category yoq " });
    }
    return res.status(200).send(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getCategoryByName = async (req, res) => {
  try {
    const categories = await category.findOne().where({
      category_name: new RegExp(req.params.name, "i"),
    });
    console.log(categories);

    if (!categories) {
      return res.status(400).send({ message: "Bunday category yoq " });
    }

    return res.status(200).send(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteCategoryByid = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }
    const categories = await category.deleteOne({ _id: req.params.id });

    console.log(categories);

    if (!categories) {
      return res.status(400).send({ message: "Bunday category yoq " });
    }

    res.status(200).send(categories);
  } catch (error) {
    errorHandler(res, error);
  }
};
const updateCategoryByid = async (req, res) => {
  const { category_name, parent_category_id } = req.body;

  if (!category_name || !parent_category_id) {
    return res.status(400).json({ message: "Togri kiriting " });
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const categories = await category.updateOne(
      { _id: req.params.id },
      {
        category_name,
        parent_category_id,
      }
    );

    console.log(categories);

    if (!categories) {
      return res.status(400).send({ message: "Bunday category yoq " });
    }

    res.status(200).send(categories);
  } catch (error) {}
};

module.exports = {
  addTCategory,
  getAllCategories,
  getCategoriesById,
  getCategoryByName,
  deleteCategoryByid,
  updateCategoryByid,
};
