import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

let data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!')
}

export { data, execute }
