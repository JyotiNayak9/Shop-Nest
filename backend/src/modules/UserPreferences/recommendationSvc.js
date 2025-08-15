const natural = require('natural');
const ProductModel = require('../product/product.model');
const { TfIdf } = natural;
const tfidf = new TfIdf();

class RecommendationService {
  constructor() {
    this.productVectors = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
   const products = await ProductModel.find({}).populate({
      path: 'category',
      populate: {
        path: 'parentId',
        model: 'Category'
      }
    });    
    // Build TF-IDF vectors
    products.forEach(product => {
      const features = this.getProductFeatures(product);
      tfidf.addDocument(features);
    });
    
    // Create vector representations
    products.forEach((product, i) => {
      const vector = {};
      tfidf.listTerms(i).forEach(term => {
        vector[term.term] = term.tfidf;
      });
      this.productVectors[product._id] = vector;
    });
    
    this.initialized = true;
  }

  getProductFeatures(product) {
    const features = [
      product.name,
      product.description,
      product.brand || '',
      product.category?.name || '',
       product.category?.parentId?.name || '',
      ...(product.tags || []),
      ...(product.attributes ? Object.values(product.attributes) : [])
    ].join(' ').toLowerCase();
    
    return features;
  }

  calculateCosineSimilarity(vecA, vecB) {
    const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dot = 0, magA = 0, magB = 0;

    allKeys.forEach(key => {
      const a = vecA[key] || 0;
      const b = vecB[key] || 0;
      dot += a * b;
      magA += a * a;
      magB += b * b;
    });

    return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
  }

  async getSimilarProducts(productId, limit = 5) {
    await this.initialize();
    
    if (!this.productVectors[productId]) {
      return [];
    }

   
    const allProducts = await ProductModel.find({ 
      _id: { $ne: productId } 
    }).populate({
      path: 'category',
      populate: {
        path: 'parentId',
        model: 'Category'
      }
    });
 const currentProduct = await ProductModel.findById(productId).populate({
      path: 'category',
      populate: {
        path: 'parentId',
        model: 'Category'
      }
    });
    const scoredProducts = await Promise.all(
      allProducts.map(async product => {
        const similarity = this.calculateCosineSimilarity(
          this.productVectors[productId],
          this.productVectors[product._id] || {}
        );
        
        // Add category bonus
        let bonus = 0;
        
        if (currentProduct?.category && product.category) {
          if (currentProduct.category._id.equals(product.category._id)) {
            bonus = 0.2;
          } else if (currentProduct.category.parentId && 
                    product.category.parentId &&
                    currentProduct.category.parentId.equals(product.category.parentId)) {
            bonus = 0.1;
          }
        }

        return {
          productId: product._id,
          product,
          score: similarity + bonus
        };
      })
    );

    return scoredProducts
      .filter(item => item.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getCartRecommendations(productIds, limit = 8) {
    await this.initialize();
    
    const recommendations = await Promise.all(
      productIds.map(id => this.getSimilarProducts(id, 3))
    );

    // Flatten, deduplicate and sort
    const uniqueRecs = recommendations.flat()
      .filter(rec => !productIds.includes(rec.productId.toString()))
      .reduce((acc, current) => {
        const exists = acc.find(item => item.productId.equals(current.productId));
        if (!exists) {
          return acc.concat([current]);
        }
        return acc;
      }, [])
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return uniqueRecs.map(r => r.product);
  }
}

module.exports = new RecommendationService();