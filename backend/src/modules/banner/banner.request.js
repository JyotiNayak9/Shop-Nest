const joi = require("joi")
const { StatusType } = require("../../config/constants.config")

const BannerCreateDTO = joi.object({
    title: joi.string().min(3).max(100).required(),
    link: joi.string().uri().empty(null, "").optional().default(null),
    status:joi.string().valid(...Object.values(StatusType)).required(),
    image: joi.string().required()
});

const BannerUpdpateDTO = joi.object({
    title: joi.string().min(3).max(100).required(),
    link: joi.string().uri().empty(null, "").optional().default(null),
    status:joi.string().valid(...Object.values(StatusType)).required(),
    image: joi.string().optional()
});

module.exports = {
    BannerCreateDTO,
    BannerUpdpateDTO
}
