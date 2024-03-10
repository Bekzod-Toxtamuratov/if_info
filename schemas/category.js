const { Schema, model } = require("mongoose");
const CategorySchema = new Schema(
  {
    category_name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    parent_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    
  },
  {
    versionKey: false,
  }
);

module.exports = model("Category", CategorySchema);
