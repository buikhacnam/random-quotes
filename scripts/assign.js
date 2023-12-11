const fs = require('fs').promises
const DATA_FILE = 'data/data.json'
const ASSIGN_FILE = 'data/quotes.js'

async function readJsonFile() {
	try {
		const data = await fs.readFile(DATA_FILE, 'utf8')
		return JSON.parse(data)
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
		return {}
	}
}
const main = async () => {
	const jsonFile = await readJsonFile()

	const quotesFile = `export const QUOTES = ${JSON.stringify(
		jsonFile,
		null,
		2
	)}`
	await fs.writeFile(ASSIGN_FILE, quotesFile)
	console.log('Quotes assigned!')
}

main()
