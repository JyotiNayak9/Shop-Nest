const joi = require("joi")
const { StatusType } = require("../../config/constants.config")

const CategoryCreateDTO = joi.object({
    title: joi.string().min(3).max(100).required(),
    status:joi.string().valid(...Object.values(StatusType)).required(),
    parentId: joi.string(),
    brands: joi.array().items(joi.string()),
    image: joi.string().empty(null,"").optional()
});

const CategoryUpdpateDTO = joi.object({
    title: joi.string().min(3).max(100).required(),
    link: joi.string().uri().empty(null, "").optional().default(null),
    status:joi.string().valid(...Object.values(StatusType)).required(),
    parentId: joi.string(),
    brands: joi.array().items(joi.string()),
    image: joi.string().empty(null, "").optional()
});

module.exports = {
    CategoryCreateDTO,
    CategoryUpdpateDTO
}
