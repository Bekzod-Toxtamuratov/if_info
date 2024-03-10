const Joi = require("joi");

const topic = require("../schemas/Topic");

// const userFullName = (parent) => {
//   return parent.author_first_name + " " + parent.author_last_name;
// };

exports.topicValidation = (data) => {
  const schema = Joi.object({
    // author_id:Joi.integer(data.author_id),
    expert_id:Joi.string(),

    topic_title: Joi.string().min(6),
    topic_text: Joi.string(),
    user_photo: Joi.string().default("/topic/avatar.png"),
    created_date: Joi.date().less(new Date("2000-01-01")),
    updated_date: Joi.date().less(new Date("2000-01-01")),
    is_checked: Joi.boolean().default(false),
    is_appoved: Joi.boolean().default(false),
  });
  return schema.validate(data, { abortEarly: false });
//   return schema.validate(data, { abortEarly: false });
};
