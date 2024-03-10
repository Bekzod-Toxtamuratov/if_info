const Joi = require("joi");
// const { schema } = require("../schemas/category");

exports.descriptionValidate = (data) => {
  const schema = Joi.object({
    description: Joi.string()
      .min(2)
      .message("Kategoriya nomi 2ta harfadan uzun bolish kerak")
      .max(100)
      .message("Kategoriya nomi 100da harfdan kam bolishi kerak")
      .required(),
    // category_id: Joi.number().integer().message("ID notogri"),
    category_id: Joi.string().alphanum().message("ID notogri"),
  });
  return schema.validate(data, { abortEarly: false });
};
