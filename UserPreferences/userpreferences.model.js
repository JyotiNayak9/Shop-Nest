const mongoose = require('mongoose');

const INTERACTION_WEIGHTS = {
  VIEW: 0.5,
  ADD_TO_CART: 1.0,
  PURCHASE: 2.0,
  RATING: 1.5,
  SAVE_FOR_LATER: 0.7,
};

const interactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  interactionType: { 
    type: String, 
    enum: Object.keys(INTERACTION_WEIGHTS),
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  metadata: {
    rating: { type: Number, min: 1, max: 5 },
    quantity: { type: Number, min: 1 }
  }
});

const userPreferenceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  interactions: [interactionSchema],
  preferredCategories: [{
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    weight: { type: Number, default: 0, min: 0 }
  }],
  preferredBrands: [{
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    weight: { type: Number, default: 0, min: 0 }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
userPreferenceSchema.methods.addInteraction = function(productId, interactionType, metadata = {}) {
  this.interactions.push({
    productId,
    interactionType,
    metadata,
    timestamp: new Date()
  });
    this.lastUpdated = new Date();
    return this.save();
};
userPreferenceSchema.methods.getWeightedInteractions = function() {
  return this.interactions.map(interaction => ({
    ...interaction.toObject(),
    weight: INTERACTION_WEIGHTS[interaction.interactionType] || 1.0
  }));
};
userPreferenceSchema.methods.getRecentInteractions = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days); 
  return this.interactions.filter(
    interaction => interaction.timestamp >= cutoffDate
  );
};
const UserPreferenceModel = mongoose.model('UserPreference', userPreferenceSchema);
module.exports = {
  UserPreferenceModel,
  INTERACTION_WEIGHTS
};
