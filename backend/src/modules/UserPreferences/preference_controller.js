const ProductModel = require("../product/product.model");
const { calculateCosineSimilarity, productVectors } = require("./recommendationSvc");
const UserPreferenceModel = require("./userpreferencesmodel");
const { vectorizeProduct } = require("../../utilities/vectorizeProduct");

// Preference.controller.js
const Preference = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // 1. Get user preferences with proper population
    const preferences = await UserPreferenceModel.findOne({ userId })
      .sort({ 'interactions.timestamp': -1 }) // Get most recent first

      .populate({
        path: 'interactions.productId',
        populate: {
          path: 'category',
          populate: {
            path: 'parentId'
          }
        }
      });
console.log(preferences)
    // 2. If no preferences, return trending products
    if (!preferences || preferences.interactions.length === 0) {
      const trendingProducts = await getTrendingProducts();
      return res.json({ result: trendingProducts });
    }

    // 3. Get interacted product IDs (last 50 only for performance)
    const recentInteractions = preferences.interactions.slice(0, 50);
    const interactedProductIds = recentInteractions.map(i => i.productId._id);

    // 4. Get candidate products (excluding interacted ones)
    const candidateProducts = await ProductModel.find({
      _id: { $nin: interactedProductIds },
      status: 'active' // Only active products
    }).populate({
      path: 'category',
      populate: { path: 'parentId' }
    });

    // 5. Create time-decayed user profile vector
    const userProfile = {};
    const now = new Date();
    
    for (const interaction of recentInteractions) {
      const product = interaction.productId;
      if (!product) continue;

      // Calculate time decay (more recent = higher weight)
      const hoursSinceInteraction = (now - interaction.timestamp) / (1000 * 60 * 60);
      const timeDecay = Math.max(0.5, 1 - (hoursSinceInteraction / 168)); // Decay over 1 week

      const vector = vectorizeProduct(product);
      const typeWeight = interaction.weight || 1;
      const totalWeight = typeWeight * timeDecay;

      for (const [key, value] of Object.entries(vector)) {
        userProfile[key] = (userProfile[key] || 0) + (value * totalWeight);
      }
    }

    // 6. Score all candidate products
    const scoredProducts = await Promise.all(
      candidateProducts.map(async (product) => {
        const productVector = vectorizeProduct(product);
        let score = calculateCosineSimilarity(userProfile, productVector);
        
        // Apply category boosts
        const categoryBoost = calculateCategoryBoost(product, recentInteractions);
        
        // Apply freshness boost
        const freshnessBoost = isNewProduct(product) ? 0.1 : 0;
        
        return {
          product,
          score: score + categoryBoost + freshnessBoost
        };
      })
    );

    // 7. Generate diverse recommendations
    const recommendations = selectDiverseRecommendations(scoredProducts);
    
    res.json({
      result: recommendations,
      message: "Recommendations fetched successfully",
      meta: {
        generatedAt: new Date(),
        interactionCount: preferences.interactions.length
      }
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: "Error generating recommendations" });
  }
};

// Helper functions
async function getTrendingProducts() {
  return ProductModel.aggregate([
    { $match: { status: 'active' } },
    { $sample: { size: 10 } },
    { $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' }
  ]);
}

function calculateCategoryBoost(product, interactions) {
  let boost = 0;
  const productCategoryId = product.category?._id.toString();
  const productparentIdId = product.category?.parentId?._id.toString();

  for (const interaction of interactions) {
    const interactedCategoryId = interaction.productId.category?._id.toString();
    const interactedparentIdId = interaction.productId.category?.parentId?._id.toString();

    if (productCategoryId && productCategoryId === interactedCategoryId) {
      boost = Math.max(boost, 0.2); // Highest boost for same category
    } else if (productparentIdId && productparentIdId === interactedparentIdId) {
      boost = Math.max(boost, 0.1); // Medium boost for same parent category
    }
  }
  return boost;
}

function isNewProduct(product) {
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return product.createdAt > oneMonthAgo;
}

function selectDiverseRecommendations(scoredProducts, count = 10) {
  const sorted = scoredProducts.sort((a, b) => b.score - a.score);
  const recommendations = [];
  const seenCategories = new Set();

  // First pass - get top items from different categories
  for (const item of sorted) {
    if (recommendations.length >= count) break;
    
    const categoryId = item.product.category?._id.toString();
    if (!seenCategories.has(categoryId)) {
      seenCategories.add(categoryId);
      recommendations.push(item.product);
    }
  }

  // Second pass - fill remaining slots with highest scores
  if (recommendations.length < count) {
    for (const item of sorted) {
      if (recommendations.length >= count) break;
      if (!recommendations.includes(item.product)) {
        recommendations.push(item.product);
      }
    }
  }
console.log("mnbxcjs"+recommendations);
  return recommendations;
}

module.exports = Preference;