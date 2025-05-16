// models/UserPreference.ts
const mongoose = require('mongoose');
const userPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interactedProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});
 
const UserPreferenceModel = mongoose.model('UserPreference', userPreferenceSchema);
module.exports = UserPreferenceModel;
