
const UserPreferenceModel = require('./userpreferences.model');
const cosineSimilarity = require('../../utilities/cosineSimilarity')
const vectorizeProduct = require('../../utilities/vectorizeProduct');
const ProductModel = require('../product/product.model');
const Preference = require('./preference_controller');
const recommendationRouter = require("express").Router();

recommendationRouter.get('/:userId', Preference)
module.exports =  recommendationRouter;
