import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js"
import react from "../utils/commands/react";

let data = new SlashCommandBuilder()
    .setName('head')
    .setDescription('Alias for "/r head"')
    // .addNumberOption(option =>
    //     option
    //         .setName('image')
    //         .setDescription('number that specifies a specific image to send'))

async function execute(interaction: ChatInputCommandInteraction) {
    await react('head', interaction)
}

export { data, execute }
