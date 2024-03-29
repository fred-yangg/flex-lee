process.chdir('./app/build')

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { client_id, api_key } = require('../app/src/config/discord.json')

const commands = [];

// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(process.cwd(), '/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(path.join(process.cwd(), `/commands/${file}`));
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(api_key);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(client_id),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();