import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js"
import adminConfig from '../config/admin.json'
import query from "../db";

let data = new SlashCommandBuilder()
    .setName('unbind')
    .setDescription('Unbinds all images from a command')
    .addStringOption(option =>
        option
            .setName('command')
            .setDescription('Command to unbind images from')
            .setRequired(true))

async function execute(interaction: ChatInputCommandInteraction) {
    const command = interaction.options.getString('command')

    // get userId
    let userId: string
    if (interaction.user.id === adminConfig.admin_id && !interaction.inGuild()) {
        userId = 'global'
    }
    else {
        userId = interaction.user.id
    }

    // invalid preconditions
    if (command === null) {
        await interaction.reply(`Something went wrong. Please try again.`)
        return
    }

    let reply = `\`Attempting Unbind: "${command}"\``
    await interaction.reply(reply)

    // check if command binding is global
    if (userId !== 'global') {
        const checkGlobalResult = await query("SELECT command FROM core_commands WHERE user_id='global' AND command=$1", [
            command
        ])
        if (checkGlobalResult.rowCount > 0) {
            await interaction.editReply(reply + `\n\`Unbind Failed: "${command}" is a reserved global command\``)
            return
        }
    }

    // unbind images from command
    const unbindQuery  = await query("DELETE FROM core_commands WHERE command=$1 AND (user_id='global' OR user_id=$2)", [
        command,
        userId
    ])
    const deleted = unbindQuery.rowCount

    if (deleted > 0) {
        // send confirmation message
        await interaction.editReply(reply + `\n\`Unbind Successful: ${deleted} ${deleted === 1 ? 'image' : 'images'} unbound from "${command}"\``)
    }
    else {
        await interaction.editReply(reply + `\n\`Unbind Failed: No images are bound to "${command}"\``)
    }
}

export { data, execute }
