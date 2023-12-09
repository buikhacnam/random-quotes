const fs = require('fs').promises;
const { JSDOM } = require('jsdom');

const API_URL = 'https://www.goodreads.com/quotes?format=json';
const QUOTES_PER_PAGE = 30;
const DATA_FILE = './data/data.json';
const TOTAL_PAGES = 5; // can be maximum 1000

async function fetchQuotes(page = 1) {
    const url = `${API_URL}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
        throw new Error(`Failed to fetch quotes for page ${page}`);
    }

    return data;
}

function parseQuotes(data, page) {
    const dom = new JSDOM(data.content_html);
    const articles = dom.window.document.querySelectorAll('article');
    return Array.from(articles).map((article, index) => {
        const id = (page - 1) * QUOTES_PER_PAGE + index + 1;
        const quote = article.querySelector('blockquote')?.textContent.trim();
        const by = article.querySelector('.quoteAuthor')?.textContent.trim() || 'Unknown';

        return quote ? { [id]: { quote, by } } : null;
    }).filter(Boolean);
}

async function readExistingQuotes() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        return {};
    }
}

async function writeQuotesToFile(quotes) {
    await fs.writeFile(DATA_FILE, JSON.stringify(quotes, null, 2));
}

async function updateJsonFile(newQuotes) {
    const existingQuotes = await readExistingQuotes();
    let hasUpdated = false;

    newQuotes.forEach(newQuote => {
        const [id, quoteData] = Object.entries(newQuote)[0];
        if (!existingQuotes[id]) {
            existingQuotes[id] = quoteData;
            hasUpdated = true;
        }
    });

    if (hasUpdated) {
        await writeQuotesToFile(existingQuotes);
        console.log('Quotes updated.');
    } else {
        console.log('No new quotes to update.');
    }
}

async function main() {
    try {
        for (let page = 1; page <= TOTAL_PAGES; page++) {
            console.log(`Fetching quotes for page ${page}...`);
            const data = await fetchQuotes(page);
            const quotes = parseQuotes(data, page);
            if (quotes.length > 0) {
                await updateJsonFile(quotes);
            } else {
                console.log(`No quotes found on page ${page}.`);
                break; // Break the loop if a page has no quotes
            }
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

main();
