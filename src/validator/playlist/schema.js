const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
  songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema };
