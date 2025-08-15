const express = require('express');
const recommendationRouter = express.Router();
const Preference = require('./preference_controller');
const loginCheck = require('../../middlewares/auth.middleware')
const hasPermission = require('../../middlewares/rbac.middleware');
const ProductModel = require('../product/product.model');
const recommendationSvc = require('./recommendationSvc');
const UserPreferenceModel = require('./userpreferencesmodel');


// Initialize service when server starts
recommendationSvc.initialize();

recommendationRouter.get('/cart/:productIds', loginCheck, async (req, res) => {
  try {
    const productIds = req.params.productIds.split(',');
    const recommendations = await recommendationSvc.getCartRecommendations(productIds);
    res.json({ result: recommendations });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});
// recommendationRoutes.js
recommendationRouter.get('/:userId',loginCheck, Preference);

// recommendationRoutes.js
recommendationRouter.post('/interaction', loginCheck, async (req, res) => {
  try {
    const { userId, productId, interactionType } = req.body;
    
    // Validate interaction type
    if (!['view', 'add_to_cart', 'purchase'].includes(interactionType)) {
      return res.status(400).json({ message: 'Invalid interaction type' });
    }

    // Update with timestamp and proper weights
    const response = await UserPreferenceModel.findOneAndUpdate(
      { userId },
      {
        $push: {
          interactions: {
            productId,
            type: interactionType,
            timestamp: new Date(),
            weight: interactionType === 'view' ? 1 : 
                   interactionType === 'add_to_cart' ? 3 : 5
          }
        },
        $set: { lastUpdated: new Date() } // Track when preferences were last updated
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Interaction tracked successfully',
        result: response })
    
  } catch (error) {
    console.error('Interaction tracking error:', error);
    res.status(500).json({ message: 'Error tracking interaction' });
  }
});



module.exports = recommendationRouter;