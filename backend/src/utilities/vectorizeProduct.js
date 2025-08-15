const natural = require('natural');
const { TfIdf } = natural;
const tfidf = new TfIdf();

const vectorizeProduct = (product) => {
  const vector = {};
  
  // 1. Text Features
  const name = product.name?.toLowerCase() || '';
  const description = product.description?.toLowerCase() || '';
  const featuresText = Array.isArray(product.features) 
    ? product.features.join(' ').toLowerCase() 
    : '';
  
  const allText = `${name} ${description} ${featuresText}`;
  
  // Add to TF-IDF and get weights
  tfidf.addDocument(allText);
  const terms = tfidf.listTerms(tfidf.documents.length - 1);
  terms.forEach(term => {
    vector[`term_${term.term}`] = term.tfidf;
  });

  // 2. Categorical Features (weighted)
  if (product.brand) {
    vector[`brand_${product.brand}`] = 1.5;
  }
  
  if (product.category) {
    // Main category
    vector[`category_${product.category.name || product.category}`] = 2.0;
    
    // Parent category if exists
    if (product.category.parentId) {
      vector[`parentcat_${product.category.parentId.name || product.category.parentId}`] = 1.2;
    }
  }

  // 3. Numerical Features (normalized)
  if (product.price) {
    vector['price'] = Math.min(product.price / 10000, 1);
  }

  return vector;
}

module.exports = {vectorizeProduct};