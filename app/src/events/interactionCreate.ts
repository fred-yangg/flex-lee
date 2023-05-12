import {CacheType, Events, Interaction} from 'discord.js'
import loadCommands from "../utils/loadCommands";

const name = Events.InteractionCreate

const once = false

async function execute(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) {
        return
    }

    // load commands
    const commands = await loadCommands();

    const command = commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
    }

    try {
        await command.execute(interaction)
        console.log(`Successfully executed command "${command.data.name}"`)
    }
    catch (error) {
        console.error(`Error while executing command "${command.data.name}:"`, error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    }
}

export {name, once, execute}