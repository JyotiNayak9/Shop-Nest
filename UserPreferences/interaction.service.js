const mongoose = require('mongoose');
const { UserPreferenceModel, INTERACTION_WEIGHTS } = require('./userpreferences.model');

class InteractionService {
  /**
   * Track a user interaction with a product
   * @param {string} userId - The ID of the user
   * @param {string} productId - The ID of the product
   * @param {string} interactionType - Type of interaction (VIEW, ADD_TO_CART, etc.)
   * @param {Object} metadata - Additional data about the interaction
   * @returns {Promise<Object>} Updated user preferences
   */
  static async trackInteraction(userId, productId, interactionType, metadata = {}) {
    try {
      if (!userId || !productId || !interactionType) {
        throw new Error('Missing required parameters');
      }

      if (!INTERACTION_WEIGHTS[interactionType]) {
        throw new Error(`Invalid interaction type: ${interactionType}`);
      }

      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        let userPrefs = await UserPreferenceModel.findOne({ userId }).session(session);
        
        if (!userPrefs) {
          userPrefs = new UserPreferenceModel({
            userId,
            interactions: []
          });
        }

        await userPrefs.addInteraction(productId, interactionType, metadata);
        await userPrefs.save({ session });
        
        await this.updateUserPreferences(userPrefs, productId, interactionType, session);
        
        await session.commitTransaction();
        return userPrefs;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      console.error(`Error tracking interaction (${interactionType}):`, error);
      throw new Error(`Failed to track interaction: ${error.message}`);
    }
  }

  static async updateUserPreferences(userPrefs, productId, interactionType, session = null) {
    const options = session ? { session } : {};
    
    const product = await mongoose.model('Product').findById(productId).session(session).catch(error => {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    });
    
    if (!product) {
      console.warn(`Product not found: ${productId}`);
      return;
    }

    const weightIncrement = INTERACTION_WEIGHTS[interactionType] || 1.0;
    
    if (product.category) {
      await this.updatePreference(
        userPrefs.preferredCategories,
        'categoryId',
        product.category,
        weightIncrement
      );
    }
    if (product.brand) {
      await this.updatePreference(
        userPrefs.preferredBrands,
        'brandId',
        product.brand,
        weightIncrement
      );
    }
    
    await userPrefs.save();
  }

  
  static async updatePreference(preferences, idField, itemId, increment) {
    const existingIndex = preferences.findIndex(
      item => item[idField].toString() === itemId.toString()
    );
    
    if (existingIndex >= 0) {
      preferences[existingIndex].weight += increment;
    } else {
      preferences.push({
        [idField]: itemId,
        weight: increment
      });
    }
  }
}

module.exports = InteractionService;
