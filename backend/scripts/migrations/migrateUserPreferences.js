const mongoose = require('mongoose');
require('dotenv').config();
const { UserPreferenceModel } = require('../../src/modules/UserPreferences/userpreferences.model');

async function migrateUserPreferences() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get all existing user preferences
    const oldPreferences = await mongoose.connection.db.collection('userpreferences').find({}).toArray();
    
    console.log(`Found ${oldPreferences.length} user preferences to migrate`);

    let migratedCount = 0;
    
    // Process each old preference
    for (const oldPref of oldPreferences) {
      // Skip if already migrated
      if (oldPref.interactions) {
        console.log(`Skipping already migrated user preference for user ${oldPref.userId}`);
        continue;
      }

      // Create new preference with interactions
      const newPref = {
        userId: oldPref.userId,
        interactions: (oldPref.interactedProductIds || []).map(productId => ({
          productId,
          interactionType: 'VIEW', // Default to VIEW for old interactions
          timestamp: new Date()
        })),
        lastUpdated: new Date()
      };

      // Update the document
      await UserPreferenceModel.updateOne(
        { _id: oldPref._id },
        { $set: newPref }
      );

      migratedCount++;
      console.log(`Migrated preference for user ${oldPref.userId}`);
    }

    console.log(`Migration complete. Migrated ${migratedCount} user preferences.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserPreferences();
