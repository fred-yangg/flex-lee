import {Client, GatewayIntentBits} from 'discord.js'
import discordConfig from "./config/discord.json"
import handleEvents from "./utils/handleEvents";

async function main() {
	// init Client
	const client = new Client({ intents: [GatewayIntentBits.Guilds] })

	// handle Client events
	handleEvents({client})

	client.login(discordConfig.api_key)
}

main()

