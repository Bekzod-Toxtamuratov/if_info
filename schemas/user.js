const Joi = require("joi");

const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    user_name: {
      type: String,
      trim: true,
      required: true,
    },
    user_email: {
      type: String,
      trim: true,
      unique: true,
    },
    user_password: {
      type: String,
      trim: true,
      required: true,
    },
    user_info: {
      type: String,
      trim: true,
    },
    user_photo: {
      type: String,
      trim: true,
    },
    created_date: {
      //   type: Date(),
      //   default: Date.now,
      type: String,
      trim: true,
      required: true,
    },
    updated_date: {
      //   type: Date(),
      //   default: Date.now,
      type: String,
      trim: true,
      required: true,
    },
    user_is_active: {
      default: false,
      type: Boolean,
    },
    user_token:{
       type:String,
    }
    
  },
  {
    versionKey: false,
  }
);
module.exports = model("user", UserSchema);
