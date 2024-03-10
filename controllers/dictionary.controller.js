const { errorHandler } = require("../helpers/error.handler");
const Dictionary = require("../schemas/dictionary");
const mongoose = require("mongoose");

const addTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const dict1 = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });
    if (dict1) {
      return res.status(400).send({
        message: "Term already exists",
      });
    }
    const newTerm = await Dictionary({
      term,
      letter: term[0],
    });
    await newTerm.save();
    res.status(200).send({ message: "Term qoshildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllTerms = async (req, res) => {
  try {
    const dictionaries = await Dictionary.find({});

    if (!dictionaries) {
      return res.status(400).send({ message: "Birorta  lug'at (topilmadi) topilmadi"});
    }
     return res.json({ data: dictionaries });
    // res.status(201).send(dictionaries);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTermsById = async (req, res) => {
  try {
    const dictionaries = await Dictionary.findOne({ _id: req.params.id });

    if (!dictionaries) {
      return res.status(400).send({ message: "Bunday terms yoq " });
    }
    return res.status(200).send(dictionaries);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getTermsByletter = async (req, res) => {
  try {
    const letter = req.params.letter;
    const terms = await Dictionary.find({ letter });
    if (!terms) {
      return res.status(400).send({ message: "Birorta termil topilmadi" });
    }
    res.json({ terms });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTermByTerm = async (req, res) => {
  try {
    const { term } = req.params;
    const dict = await Dictionary.find({
      term: { $regex: term, $options: "i" },
    });
    if (!dict) {
      return res.status(400).json({
        message: "Term not found",
      });
    } else {
      return res.status(200).json({ dict });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};
const getTermByTermSearch = async (req, res) => {
  try {
    const { term } = req.params;
    const dict = await Dictionary.find({
      term: { $regex: req.query.term, $options: "i" },
    });
    if (!dict) {
      return res.status(400).json({
        message: "Term not found",
      });
    } else {
      return res.status(200).json({ dict });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDictionaryByid = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const dictionary = await Dictionary.deleteOne({ _id: req.params.id });

    console.log(dictionary);

    if (!dictionary) {
      return res.status(400).send({ message: "Bunday admin yo'q " });
    }

    res.status(200).send(dictionary);
  } catch (error) {
    errorHandler(res, error);
  }
};


const updateDictionaryByid = async (req, res) => {
  const { term, letter } = req.body;

  if (!term || !letter) {
    return res.status(400).json({ message: "Togri kiriting " });
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }
    const dictionary = await Dictionary.updateOne(
      { _id: req.params.id },
      {
        term,
        letter,
      }
    );
    console.log(dictionary);
    if (!dictionary) {
      return res.status(400).send({ message: "Bunday dictionary yo'q " });
    }

    res.status(200).send(dictionary);
  } catch (error) {
    console.log(error);
    console.log("update catch metodi ishladi ");
    errorHandler(res, error);
  }
};

module.exports = {
  addTerm,
  getAllTerms,
  getTermsById,
  getTermsByletter,
  getTermByTerm,
  getTermByTermSearch,
  deleteDictionaryByid,
  updateDictionaryByid,
};
