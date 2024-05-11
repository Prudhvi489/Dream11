const Joi = require("joi");
const responseHandlers = require("../responseHandler");
const validationMessage = {
  "any.required": `The field {#label} is required.`,
  "string.base": `The field {#label} datatype wrong`,
  "number.base": `The field {#label} must be a number`,
  "number.integer": `The field {#label} must be an integer`,
};

const errorHandling = async (schema, req, res, next) => {
  let { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    const message = error.details[0].message;
    return responseHandlers.badRequest(res, message);
  }
  return next();
};

const teamvalidation = {
  validateaddteam: async (req, res, next) => {
    try {
      // Define schema for individual player object
      const playerSchema = Joi.object({
        Player: Joi.string().required(),
        Team: Joi.string().required(),
        Role: Joi.string().required(),
      });
      const schema = Joi.object({
        teamname: Joi.string().required(),
        players: Joi.array()
          .min(9)
          .max(9)
          .unique(
            (a, b) =>
              a.Player === b.Player && a.Team === b.Team && a.Role === b.Role
          )
          .items(playerSchema)
          .required(),
        captain: playerSchema.required(),
        vicecaptain: playerSchema.required(),
      })
        .unknown(true)
        .messages(validationMessage);
      return errorHandling(schema, req, res, next);
    } catch (err) {}
  },
};
module.exports = teamvalidation;
