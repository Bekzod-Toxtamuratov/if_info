const { Schema, model } = require("mongoose");

const dictSchema = new Schema(
  {
    term: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    letter:{
      type: String,
      uppercase: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Dictionary", dictSchema);
