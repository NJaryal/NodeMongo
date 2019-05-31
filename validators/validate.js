const Joi = require('@hapi/joi');
const validateNews = (newsObj)=> {
    const schema = {
        name: Joi.string().min(4).required()
    }
    return Joi.validate(newsObj, schema);
}

module.exports = validateNews;