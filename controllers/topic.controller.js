const { errorHandler } = require("../helpers/error.handler");
// const Joi = require("joi");
const Topic = require("../schemas/Topic.js");
const mongoose = require("mongoose");

const { TopicValidate } = require("../validations/Topic.validation.js");

const addTopic = async (req, res) => {
  try {
    const {
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_appoved,
      expert_id,
    } = req.body;

    const topic = await Topic.findOne({});

    // if (topic) {
    //   return res.status(400).send({
    //     message: "topic already exists",
    //   });
    // }
    const newTopic = await Topic({
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_appoved,
      expert_id,
    });
    await newTopic.save();
    res.status(200).send({ message: "topic qoshildi" });
  } catch (error) {
    console.log("bekzod");
    console.log("error", error);
    errorHandler(res, error);
  }
};

const getAllTopics = async (req, res) => {
  try {
    const topic = await Topic.find({});
  
    if(!topic) {
     return res.status(400).send({ message: "Birorta  topic topilmadi " });
    }
      res.json({ data: topic });
  } catch (error) {
    errorHandler(res, error);
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
  addTopic,
  getAllTopics,
};
