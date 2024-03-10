const { required } = require("joi");
const { Schema, model } = require("mongoose");
const type = require("mongoose/lib/schema/operators/type");

const AuthorSchema = new Schema(
  {
    author_first_name: {
      type: String,
      trim: true,
      required: true,
    },
    author_last_name: {
      type: String,
      trim: true,
    },
    author_nick_name: {
      type: String,
      trim: true,
      required: true,
    },
    author_email: {
      type: String,
      trim: true,
      unique: true,
    },
    author_phone: {
      type: String,
      trim: true,
    },
    author_password: {
      type: String,
      trim: true,
      required: true,
    },
    author_info: {
      type: String,
      trim: true,
    },
    author_position: {
      type: String,
      trim: true,
    },
    author_photo: {
      type: String,
      trim: true,
    },
    is_expert: {
      default: false,
      type: Boolean,
    },
    author_is_active: {
      default: false,
      type: Boolean,
    },
    author_token: {
      type: String,
    },
    author_activation_link:{
        type:String,
    }
  },
  {
    versionKey: false,
  }
);
module.exports = model("Author", AuthorSchema);
