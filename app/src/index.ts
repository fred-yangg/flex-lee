import * as secret from './secret/secret.json'
import { Client, Events, GatewayIntentBits } from 'discord.js'

const API_TOKEN = secret.API_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.login(API_TOKEN)
