import { SlashCommandBuilder } from "discord.js";

let data = new SlashCommandBuilder()

data.setName('ping')
    .setDescription('Replies with Pong!')

async function execute(interaction: any) {
    await interaction.reply('Pong!');
}

export { data, execute }
