import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js"
import query from "../db";

let data = new SlashCommandBuilder()
    .setName('ls')
    .setDescription('Lists all available commands')

async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user
    const userId = user.id

    await interaction.deferReply()

    const lsQuery = await query(
        "SELECT user_id, command, COUNT(filename) FROM core_commands WHERE user_id='global' OR user_id=$1 GROUP BY user_id, command ORDER BY user_id DESC, command ASC",
        [
            userId
        ]
    )

    const scopes: string[] = lsQuery.rows.map(row => row.user_id === 'global' ? 'Global' : 'User' )
    const commands: string[] = lsQuery.rows.map(row => row.command)
    const bindings: number[] = lsQuery.rows.map(row => row.count)

    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .addFields(
            { name: 'Scope', value: scopes.join('\n'), inline: true },
            { name: 'Command', value: commands.join('\n'), inline: true },
            { name: 'Bindings', value: bindings.join('\n'), inline: true }
        )

    await interaction.editReply({content: '', embeds: [exampleEmbed]})
}

export { data, execute }
