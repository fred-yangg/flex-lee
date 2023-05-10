import * as fs from 'fs'
import * as path from 'path'
import {Client, Collection, Events, GatewayIntentBits} from 'discord.js'
import Command from "interfaces/Command"

// init Client
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

// load commands
const commands:Collection<string, Command> = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	import(filePath)
		.then(command => {
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				commands.set(command.data.name, command)
			} 
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		})
}


// log ready
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})


// handle interaction
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) {
		return
	}

	const command = commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await command.execute(interaction)
	} 
	catch (error) {
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
})

// @ts-ignore
import * as discordConfig from '../config/discord.json'

client.login(discordConfig.api_key)
