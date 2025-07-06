// utils/embed.js

async function generateEmbeddingFromText(text) {
  // 🔧 TEMPORARY: return dummy embedding until API quota is fixed
  return Array(1536).fill(0); 
}

module.exports = generateEmbeddingFromText;
