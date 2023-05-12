import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js"

let data = new SlashCommandBuilder()
    .setName('flex')
    .setDescription('Replies with Pong!')
    .addNumberOption(option =>
        option
            .setName('image')
            .setDescription('number that specifies a specific image to send'))

async function execute(interaction: ChatInputCommandInteraction) {
    const number = interaction.options.getNumber('image');

    if (number !== null) {
        await interaction.reply(`Flexing: ${number}`)
    }
    else {
        await interaction.reply(`Flexing: random`)
    }
}

export { data, execute }
