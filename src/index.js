import { QUOTES } from '../data/quotes';

const TOTAL_QUOTES = 3000;
const RANDOM_NUM = 1;
const LIMIT = 10;
const CACHE_TTL = 3600 * 24;

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
    if (event.request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    const requestUrl = new URL(event.request.url);
    if (requestUrl.pathname !== '/') {
        return new Response('Not found', { status: 404 });
    }
    let randomNumber = RANDOM_NUM
    const query = requestUrl.searchParams.get('num');
    if (query) {
        randomNumber = parseInt(query);
        if(randomNumber > LIMIT) {
            randomNumber = LIMIT;
        }
    }

    const cache = caches.default;
    let response = await cache.match(event.request);
    if (!response) {
        const randomQuotes = [];
        for (let i = 0; i < randomNumber; i++) {
            const randomIndex = Math.floor(Math.random() * TOTAL_QUOTES);
            randomQuotes.push(QUOTES[randomIndex.toString()]);
        }
        const responseBody = JSON.stringify(randomQuotes, null, 2);
        response = new Response(responseBody, {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
				'Cache-Control': `public, max-age=${CACHE_TTL}`,
            },
        });

        // event.waitUntil(cache.put(event.request, response.clone()));
    }

    return response;
}
