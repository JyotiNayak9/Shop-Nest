const { UserPreferenceModel, INTERACTION_WEIGHTS } = require('./userpreferences.model');
const cosineSimilarity = require('../../utilities/cosineSimilarity');
const vectorizeProduct = require('../../utilities/vectorizeProduct');
const ProductModel = require('../product/product.model');
const mongoose = require('mongoose');

const RECOMMENDATION_LIMIT = 10;
const RECENT_DAYS = 30; 
const POPULARITY_WEIGHT = 0.2;
const DIVERSITY_FACTOR = 0.3;

const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    
   
    const userPrefs = await UserPreferenceModel.findOne({ userId })
      .populate({
        path: 'interactions.productId',
        model: 'Product',
        populate: [
          { path: 'brand', model: 'Brand' },
          { path: 'category', model: 'Category' }
        ]
      })
      .populate('preferredCategories.categoryId')
      .populate('preferredBrands.brandId');

    console.log(`[Recommendation] Found user preferences for user ${userId}:`, 
      userPrefs ? 'exists' : 'not found');

    if (!userPrefs || userPrefs.interactions.length === 0) {
      const popularProducts = await getPopularProducts(RECOMMENDATION_LIMIT);
      return res.json({
        result: popularProducts,
        message: 'Popular products (new user)',
        meta: { isFallback: true }
      });
    }

    const recentInteractions = userPrefs.getRecentInteractions(RECENT_DAYS);
    const weightedInteractions = userPrefs.getWeightedInteractions();

    console.log(`[Recommendation] Found ${recentInteractions.length} recent interactions`);
    console.log(`[Recommendation] Found ${weightedInteractions.length} weighted interactions`);

    const interactedProductIds = new Set(
      recentInteractions
        .map(i => i.productId?._id?.toString())
        .filter(Boolean) // Filter out any undefined/null values
    );

    console.log(`[Recommendation] Found ${interactedProductIds.size} unique interacted product IDs`);

    const allProducts = await ProductModel.find({
      _id: { $nin: [...interactedProductIds] },
      status: 'active' // Only recommend active products
    })
    .populate('brand')
    .populate('category')
    .lean();

    console.log(`[Recommendation] Found ${allProducts.length} candidate products for recommendation`);

    if (allProducts.length === 0) {
      return res.json({
        result: [],
        message: 'No new products to recommend',
        meta: null
      });
    }

    const contentScores = await calculateContentScores(
      recentInteractions.filter(i => i.productId), // Only include interactions with valid products
      allProducts,
      userPrefs
    );

    console.log(`[Recommendation] Calculated content scores for ${Object.keys(contentScores).length} products`);

    const popularityScores = await calculatePopularityScores(allProducts);

    const recommendations = allProducts
      .map(product => {
        const contentScore = contentScores[product._id] || 0;
        const popularityScore = popularityScores[product._id] || 0;
        

        const combinedScore = 
          (1 - POPULARITY_WEIGHT) * contentScore +
          POPULARITY_WEIGHT * popularityScore;

        return {
          ...product,
          score: combinedScore,
          contentScore,
          popularityScore
        };
      })
      .sort((a, b) => b.score - a.score);


    const diverseRecommendations = applyDiversity(
      recommendations, 
      DIVERSITY_FACTOR,
      RECOMMENDATION_LIMIT
    );

    res.json({
      result: diverseRecommendations,
      message: 'Recommendations fetched successfully',
      meta: {
        interactionCount: recentInteractions.length,
        consideredProducts: allProducts.length
      }
    });

  } catch (error) {
    console.error('Error in recommendation engine:', error);
    res.status(500).json({
      result: [],
      message: 'Error generating recommendations',
      error: error.message
    });
  }
};


async function calculateContentScores(interactions, products, userPrefs) {
  const scores = {};
  console.log(`[Content Scoring] Starting content scoring for ${interactions.length} interactions and ${products.length} products`);
  
  // If no interactions, return empty scores
  if (interactions.length === 0) {
    console.log('[Content Scoring] No interactions found, returning empty scores');
    return scores;
  }

  // Get user's interaction vectors with error handling
  const interactionVectors = [];
  for (const interaction of interactions) {
    if (!interaction.productId) {
      console.log('[Content Scoring] Skipping interaction with missing productId');
      continue;
    }

    try {
      console.log(`[Content Scoring] Vectorizing product ${interaction.productId._id || interaction.productId}`);
      const vector = await vectorizeProduct(interaction.productId, { populateRefs: true });
      
      if (!vector || Object.keys(vector).length === 0) {
        console.log(`[Content Scoring] Empty vector for product ${interaction.productId._id || interaction.productId}`);
        continue;
      }
      
      interactionVectors.push({
        vector,
        weight: interaction.weight || 1.0
      });
      console.log(`[Content Scoring] Added vector with ${Object.keys(vector).length} features`);
    } catch (error) {
      console.error(`[Content Scoring] Error vectorizing product ${interaction.productId._id || interaction.productId}:`, error.message);
    }
  }

  console.log(`[Content Scoring] Generated ${interactionVectors.length} valid interaction vectors`);

  // If no valid interaction vectors, return empty scores
  if (interactionVectors.length === 0) {
    console.log('[Content Scoring] No valid interaction vectors, returning empty scores');
    return scores;
  }

  // Calculate weighted average user vector
  console.log('[Content Scoring] Calculating weighted average user vector');
  const userVector = {};
  let totalWeight = 0;
  
  for (const { vector, weight } of interactionVectors) {
    if (!vector) continue;
    
    for (const [key, value] of Object.entries(vector)) {
      userVector[key] = (userVector[key] || 0) + (value * weight);
    }
    totalWeight += weight;
  }

  // Normalize by total weight
  if (totalWeight > 0) {
    for (const key of Object.keys(userVector)) {
      userVector[key] /= totalWeight;
    }
      const brandBoost = userPrefs.preferredBrands
        .filter(pb => pb.brandId && pb.brandId._id.toString() === product.brand.toString())
        .reduce((sum, pb) => sum + (pb.weight || 0), 0);
      
      scores[product._id] += brandBoost * 0.3; 
    }
     return scores;
  }

 



async function calculatePopularityScores(products) {
  const scores = {};
  

  for (const product of products) {
    let score = 0;
    
    if (product.ratings && product.ratings.average) {
      score += product.ratings.average / 5;
    }
    
    if (product.viewCount) {
      score += Math.min(product.viewCount / 100, 1);
    }
    
    scores[product._id] = score / 2; 
  
  return scores;
}


async function getPopularProducts(limit) {
  return ProductModel.find({ status: 'active' })
    .sort({ 'ratings.average': -1, 'viewCount': -1 })
    .limit(limit)
    .lean();
}


function applyDiversity(recommendations, diversityFactor, limit) {
  if (recommendations.length <= limit) return recommendations;
  
  const result = [];
  const selectedCategories = new Set();
  
  for (const item of recommendations) {
    const categoryId = item.category?.toString();
    
    if (categoryId && selectedCategories.has(categoryId) && 
        Math.random() < diversityFactor) {
      continue;
    }
    
    result.push(item);
    if (categoryId) selectedCategories.add(categoryId);
    
    if (result.length >= limit) break;
  }
  
  return result;
}
}
module.exports = getRecommendations;