const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  type: { type: String, enum: ['view', 'add_to_cart', 'purchase'], required: true },
  timestamp: { type: Date, default: Date.now },
  weight: { type: Number, default: 1 } // Default weight, will be set based on type
});

const userPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  interactions: [interactionSchema],
  lastUpdated: { type: Date, default: Date.now }
});

// Add index for faster queries
userPreferenceSchema.index({ userId: 1, 'interactions.productId': 1 });

const UserPreferenceModel = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = UserPreferenceModel;