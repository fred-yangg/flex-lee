import {Client, GatewayIntentBits, Partials} from 'discord.js'
import discordConfig from "./config/discord.json"
import handleEvents from "./core/handleEvents";
import fs from "fs";
import * as process from "process";
import path from "path";
import {exec} from "child_process"

async function main() {

	// init temp directory
	const tempDir = path.join(process.cwd(), '/temp')
	if (!fs.existsSync(tempDir)){
		fs.mkdirSync(tempDir);
	}

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

	client.login(discordConfig.api_key)
}

main()
