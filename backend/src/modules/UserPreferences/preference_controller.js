
const UserPreferenceModel = require('./userpreferences.model');
const cosineSimilarity = require('../../utilities/cosineSimilarity')
const vectorizeProduct = require('../../utilities/vectorizeProduct');
const ProductModel = require('../product/product.model');

const Preference = async (req, res) => {
  const userId = req.params.userId;

  const preferences = await UserPreferenceModel.findOne({ userId }).populate('interactedProductIds');
  const allProducts = await ProductModel.find();

  if (!preferences) return res.json([]);

  // Wait for all product vectors
  const userVectors = await Promise.all(preferences.interactedProductIds.map(vectorizeProduct));

  const userProfile = {};
  userVectors.forEach(vec => {
    Object.entries(vec).forEach(([key, val]) => {
      userProfile[key] = (userProfile[key] || 0) + val;
    });
  });

  Object.keys(userProfile).forEach(key => {
    userProfile[key] /= userVectors.length;
  });

  const productsToScore = allProducts.filter(p =>
    !preferences.interactedProductIds.some(ip => ip._id.equals(p._id))
  );

  const scoredProducts = await Promise.all(productsToScore.map(async (product) => {
    const vector = await vectorizeProduct(product);
    return {
      product,
      score: cosineSimilarity(userProfile, vector),
    };
  }));

  const sorted = scoredProducts.sort((a, b) => b.score - a.score).slice(0, 10);

  res.json({
    result: sorted.map(p => p.product),
    message: "Recommendations fetched successfully",
    meta: null
  });
};

module.exports = Preference;