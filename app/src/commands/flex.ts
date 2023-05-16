import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js"
import react from "../utils/commands/react";

let data = new SlashCommandBuilder()
    .setName('flex')
    .setDescription('Alias for "/r flex"')
    // .addNumberOption(option =>
    //     option
    //         .setName('image')
    //         .setDescription('number that specifies a specific image to send'))

async function execute(interaction: ChatInputCommandInteraction) {
    await react('flex', interaction)
}

export { data, execute }
