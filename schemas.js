const Joi = require('joi');

module.exports.occasionSchema = Joi.object({
   occasion: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      participants: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      // image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required()
   }).required(),
   deleteImages: Joi.array()
});
 
module.exports.reviewSchema = Joi.object({
   review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required()
   }).required()
});