import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js"
import query from "../db";
import react from "../utils/commands/react";

let data = new SlashCommandBuilder()
    .setName('r')
    .setDescription('Reacts using images bound to the input command')
    .addStringOption(option =>
        option
            .setName('command')
            .setDescription('The command to get bound images from')
            .setRequired(true))

async function execute(interaction: ChatInputCommandInteraction) {
    const command = interaction.options.getString('command')

    // invalid preconditions
    if (command === null) {
        await interaction.reply('Something went wrong. Please try again.')
        return
    }

    await react(command, interaction)
}

export { data, execute }
