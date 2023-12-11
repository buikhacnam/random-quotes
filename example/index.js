const GenerateQuote = require('../libs/generateQuote');
const quoteGenerator = new GenerateQuote();

const randomQuotes = quoteGenerator.getRandom(5); // Get 5 random quotes
console.log(randomQuotes);
