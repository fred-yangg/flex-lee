import {Client, GatewayIntentBits, Partials} from 'discord.js'
import discordConfig from "./config/discord.json"
import handleEvents from "./core/handleEvents";

async function main() {

	// init Client
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.DirectMessages
		],
		partials: [
			Partials.Channel
		]
	})

	// handle Client events
	handleEvents({client})

	// Client login
	client.login(discordConfig.api_key)
}

main()
