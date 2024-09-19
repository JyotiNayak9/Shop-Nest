const joi = require("joi")
const { StatusType } = require("../../config/constants.config")

const BrandCreateDTO = joi.object({
    title: joi.string().min(3).max(100).required(),
    status:joi.string().valid(...Object.values(StatusType)).required(),
    image: joi.string().required()
});

const BrandUpdpateDTO = joi.object({
    title: joi.string().min(3).max(100).required(),
    link: joi.string().uri().empty(null, "").optional().default(null),
    status:joi.string().valid(...Object.values(StatusType)).required(),
    image: joi.string().optional()
});

module.exports = {
    BrandCreateDTO,
    BrandUpdpateDTO
}
