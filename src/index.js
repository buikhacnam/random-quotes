import { QUOTES } from '../data/quotes'

const TOTAL_QUOTES = 3000
const RANDOM_NUM = 1
const LIMIT = 10

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
	if (event.request.method !== 'GET') {
		return new Response('Method not allowed', { status: 405 })
	}

	const requestUrl = new URL(event.request.url)
	if (requestUrl.pathname !== '/') {
		return new Response('Not found', { status: 404 })
	}
	let randomNumber = RANDOM_NUM
	const query = requestUrl.searchParams.get('num')
	if (query) {
		randomNumber = parseInt(query)
		if (isNaN(randomNumber) || randomNumber < 1) {
			randomNumber = RANDOM_NUM // default to 1 quote if the query is invalid
		} else if (randomNumber > LIMIT) {
			randomNumber = LIMIT
		}
	}

	const randomQuotes = []
	for (let i = 0; i < randomNumber; i++) {
		const randomIndex = Math.floor(Math.random() * TOTAL_QUOTES)
		randomQuotes.push(QUOTES[randomIndex.toString()])
	}

	const format = requestUrl.searchParams.get('format')
	let responseBody
	let headers

	if (format !== 'json') {
		responseBody = `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        blockquote { font-size: 1.2em; margin: 20px 0; padding: 10px 20px; border-left: 5px solid #ddd; }
        footer { font-size: 0.8em; color: #555; }
        .github-link { display: block; margin-top: 40px; }
    </style>
</head>
<body>`
		responseBody += randomQuotes
			.map(
				quote => `
            <blockquote>
                <p>"${quote.quote}"</p>
                <footer>— ${quote.by}</footer>
            </blockquote>
        `
			)
			.join('')
		responseBody += `<a href="https://github.com/buikhacnam/random-quotes" class="github-link">View on Github</a>`
		responseBody += `</body></html>`
		headers = { 'Content-Type': 'text/html;charset=UTF-8' }
	} else {
		responseBody = JSON.stringify(
			{
				data: randomQuotes,
				total: randomQuotes.length,
				source: 'https://github.com/buikhacnam/random-quotes',
			},
			null,
			2
		)
		headers = { 'Content-Type': 'application/json;charset=UTF-8' }
	}

	return new Response(responseBody, { headers: headers })
}
