const Joi = require("joi");

const { Schema, model } = require("mongoose");
const type = require("mongoose/lib/schema/operators/type");

const AdminSchema = new Schema(
  {
    admin_name: {
      type: String,
      trim: true,
      required: true,
    },

    admin_email: {
      type: String,
      trim: true,
      unique: true,
    },

    admin_phone: {
      type: String,
      trim: true,
    },
    admin_password: {
      type: String,
      trim: true,
      required: true,
    },
    admin_is_active: {
      default: false,
      type: Boolean,
    },
    admin_is_creator: {
      default: false,
      type: Boolean,
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
    admin_token:{
       type:String,
    }
  },
  {
    versionKey: false,
  }
);
module.exports = model("Admin", AdminSchema);
