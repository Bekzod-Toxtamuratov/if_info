const { Schema, model, SchemaType } = require("mongoose");

const TopicSchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "author",
    },
    topic_title: {
      type: String,
      required: true,
      trim: true,
    },
    topic_text: {
      type: String,
      required: true,
      trim: true,
    },
    created_date: {
      type: String,
    },
    updated_date: {
      type: String,
    },
    is_checked: {
      type: Boolean,
    },
    is_appoved: {
      type: Boolean,
    },
    expert_id: {
      type: Schema.Types.ObjectId,
      ref: "author",
    },
  },
  { versionKey: false }
);
module.exports = model("Topic", TopicSchema);
