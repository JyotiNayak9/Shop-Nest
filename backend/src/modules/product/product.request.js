const joi = require("joi")
const { StatusType, ProductStatus } = require("../../config/constants.config");
const { description } = require("../auth/auth.request");

const ProductCreateDTO = joi.object({
    title: joi.string().min(3).max(100).required(),
    slug: joi.string(),
    description: joi.string().required(),
    quantity : joi.number().required(),
    price: joi.number().required(),
    category : joi.string(),
    brand: joi.string(),
    ratings: [{
        star: joi.number(),
        postedBy: joi.string()
    }
    ],
    status: joi.string().valid(...Object.values(ProductStatus)).required(),
    image: joi.array()
});

const ProductUpdateDTO = joi.object({
    title: joi.string().min(3).max(100),
    slug: joi.string(),
    description: joi.string(),
    quantity : joi.number(),
    price: joi.number(),
    category : joi.string(),
    brand: joi.string(),
    ratings: [{
        star: joi.number(),
        postedBy: joi.string()
    }
    ],
    status: joi.string().valid(...Object.values(ProductStatus)),
    image: joi.array()
});

module.exports = {
    ProductCreateDTO,
    ProductUpdateDTO
}
