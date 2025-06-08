// utils/cosineSimilarity.ts
 const cosineSimilarity = (vecA, vecB) =>{
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
  
module.exports = cosineSimilarity;