// utils/vectorizeProduct.ts
const vectorizeProduct = (product) =>{
    const vector= {};
  
   
    vector[`brand_${product.brand}`] = 1;
    vector[`category_${product.category}`] = 1;
    // Tag-based features
    if (product.fetures) {
      product.feqtures.forEach((feature) => {
        vector[`feature_${feature}`] = 1;
      });
    }
  
    return vector;
  }
  
  module.exports = vectorizeProduct;