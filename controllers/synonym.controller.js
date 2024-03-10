const { errorHandler } = require("../helpers/error.handler");
const Synonym = require("../schemas/synonym");
const Desciption = require("../schemas/description");
const Dictionary = require("../schemas/dictionary");

const mongoose = require("mongoose");

const addSynonym = async (req, res) => {
  try {
    const { dect_id, dict_id } = req.body;

    let check = await Desciption.findById(dect_id);
    let check2 = await Dictionary.findById(dict_id);

    if (check == null || check2 == null) {
      return res
        .status(400)
        .send(
          "Desc_id or  Dict_id is Incorrect. Balkim ikkalasi ham xatodir tekshir yaxshilab "
        );
    }
    const data = await Synonym({ dect_id, dict_id });

    // console.log(data);

    await data.save();

    res.status(200).send("Synonym is added ");
  } catch (error) {
    errorHandler(res, error);
  }
};
const getAllSynonym = async (req, res) => {
  try {
    const synonym = await Synonym.find({});
    res.status(201).send(synonym);
  } catch (error) {
    errorHandler(res, error);
  }
};
const getSynonymById = async (req, res) => {
  try {
    const id = req.params.id;

    let check = await Synonym.findById(id);

    if (check == null) {
      console.log("check", check);
      return res.status(400).send("ID is incoreect");
    }
    res.status(200).send(check);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSynonymByid = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }
    const synonyms = await Synonym.deleteOne({ _id: req.params.id });

    console.log(synonyms);

    if (!synonyms) {
      return res.status(400).send({ message: "Bunday synonym yo'q " });
    }

    res.status(200).send(synonyms);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateSynonymByid = async (req, res) => {
  const { dect_id, dict_id } = req.body;

  if (!dect_id || !dict_id) {
    return res.status(400).json({ message: "Togri kiriting " });
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect Id" });
    }

    const synonyms = await Synonym.updateOne(
      { _id: req.params.id },
      {
        dect_id,
        dict_id,
      }
    );
    console.log(synonyms);

    if (!synonyms) {
      return res.status(400).send({ message: "Bunday synonyms yo'q " });
    }

    res.status(200).send(synonyms);
  } catch (error) {}
};

module.exports = {
  addSynonym,
  getSynonymById,
  getAllSynonym,
  deleteSynonymByid,
  updateSynonymByid,
};
