const GenerateQuote = require('../index');
const quoteGenerator = new GenerateQuote();

const randomQuotes = quoteGenerator.getRandom(5); // Get 5 random quotes
console.log(randomQuotes);
