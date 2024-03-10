const Joi = require("joi");
const user = require("../schemas/user");

// const userFullName = (parent) => {
//   return parent.author_first_name + " " + parent.author_last_name;
// };

exports.userValidation = (data)=>  {

  const schema = Joi.object({

    user_name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).min(2).max(50),
    user_email: Joi.string().email(),
    user_password: Joi.string().min(6),
    user_info: Joi.string(),
    user_photo: Joi.string().default("/author/avatar.png"),
    created_date: Joi.date().less(new Date("2000-01-01")),
    updated_date: Joi.date().less(new Date("2000-01-01")),
    user_is_active: Joi.boolean().default(false),



    // confirm_password: Joi.ref("admin_password"),
    // admin_phone: Joi.string().pattern(new RegExp(/^\d{2}-\d{3}-\d{2}-\d{2}$/)),
    // admin_is_creator: Joi.boolean().default(false),
    // author_position: Joi.string(),
    // is_expert: Joi.boolean().default(false),
    // gender: Joi.string().valid("erkak", "ayol"),
    // birth_year: Joi.number().integer().min(1980).max(2005),
    // referred: Joi.boolean().default(false),
    // refferedDetails: Joi.string().when("referred", {
    //   is: true,
    //   then: Joi.string().required(),
    //   otherwise: Joi.string().optional(),
    // }),
    // coding_lang: Joi.array().items(Joi.string(), Joi.number(), Joi.boolean()),
    // is_yes: Joi.boolean().truthy("YES", "ha").valid(true),

  });

  return schema.validate(data,{abortEarly: false });


};
