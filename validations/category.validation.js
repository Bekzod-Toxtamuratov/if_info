const Joi = require("joi");
// const { schema } = require("../schemas/category");

exports.categoryValidation = (data) => {
  const schema = Joi.object({
    category_name: Joi.string()
      .min(2)
      .message("Kategoriya nomi 2ta harfadan uzun bolish kerak")
      .max(100)
      .message("Kategoriya nomi 100da harfdan kam bolishi kerak")
      .required(),
    parent_category_id: Joi.string().alphanum().message("ID notogri"),
  });
  return schema.validate(data, { abortEarly: false });
};
