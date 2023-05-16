import query from "../../db";
import {ChatInputCommandInteraction, Interaction} from "discord.js";


export default async function react(command: string, interaction: ChatInputCommandInteraction){
    const userId = interaction.user.id

    await interaction.reply('...')

    // query image filename
    const imageQuery = await query("SELECT image_url FROM core_commands a JOIN core_images b ON a.filename = b.filename WHERE command=$1 AND (user_id='global' OR user_id=$2) ORDER BY random() LIMIT 1", [
        command,
        userId
    ])

    // error if no image found
    if (imageQuery.rowCount === 0) {
        await interaction.editReply(`You have no images bound to "${command}"`)
        return
    }

    // send image
    const image_url = imageQuery.rows.at(0).image_url
    await interaction.editReply(image_url)
}