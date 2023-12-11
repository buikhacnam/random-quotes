const fs = require('fs')

class GenerateQuote {
	filePath = 'data/data.json'
	limit = 10
	totalQuotes = 0

	constructor() {
		this.quotes = {}
		this.loadQuotes()
	}

	loadQuotes() {
		try {
			const data = fs.readFileSync(this.filePath, 'utf8')
			this.quotes = JSON.parse(data)
			this.totalQuotes = Object.keys(this.quotes).length
		} catch (err) {
			console.error('Error reading file:', err)
		}
	}

	getRandom(numQuotes) {
		if (numQuotes > this.limit) {
			numQuotes = this.limit
		}

		const randomQuotes = []
		for (let i = 0; i < numQuotes; i++) {
			const randomIndex = Math.floor(Math.random() * this.totalQuotes) + 1
			randomQuotes.push(this.quotes[randomIndex.toString()])
		}
		return randomQuotes
	}
}

module.exports = GenerateQuote
