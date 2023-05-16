import {Attachment, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js"
import getReadableStreamHash from "../utils/stream/getReadableStreamHash";
import query from "../db";
import vgyUpload from "../vgy/vgyUpload";
import getAttachmentReadableStream from "../utils/stream/getAttachmentReadableStream";
import adminConfig from '../config/admin.json'

let data = new SlashCommandBuilder()
    .setName('bind')
    .setDescription('Binds any image attachments in the last received DM to a specific command')
    .addStringOption(option =>
        option
            .setName('command')
            .setDescription('Command to bind ')
            .setRequired(true))
    .addAttachmentOption(option =>
        option
            .setName('image')
            .setDescription('Image attachment to bind to a command')
            .setRequired(true))

type ChecksumResponse = {error: true, response: string} | {error: false, found: false, checksum: string} | {error: false, found: true, filename: string}

async function checkChecksum(command: string, userId: string, image: Attachment): Promise<ChecksumResponse> {
    const checksum = await getReadableStreamHash(await getAttachmentReadableStream(image))
    const checksumResponse =  await query('SELECT filename FROM core_images WHERE checksum=$1', [
        checksum
    ])

    // if image was not found, return checksum
    if (checksumResponse.rowCount === 0) {
        return {
            error: false,
            found: false,
            checksum: checksum
        }
    }

    // check which commands are already bound to this image
    const filename = checksumResponse.rows.at(0).filename
    const commandBindingsResponse = await query("SELECT DISTINCT command FROM core_commands WHERE command=$1 AND (user_id='global' OR user_id=$2) AND filename=$3", [
        command,
        userId,
        filename
    ])

    // if the specified command already has this image bound, error out
    if (commandBindingsResponse.rowCount > 0) {
        return {
            error: true,
            response: `\n\`Bind Canceled: The image you uploaded was already bound to the command "${command}".\``
        }
    }
    // otherwise, provide the filename for the image
    else {
        return {
            error: false,
            found: true,
            filename: filename
        }
    }

}

async function execute(interaction: ChatInputCommandInteraction) {
    const image = interaction.options.getAttachment('image')
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
    if (image === null || command === null) {
        await interaction.reply(`Something went wrong. Please try again.`)
        return
    }

    let reply = `\`Attempting Bind: "${image.name}" => "${command}"\``
    await interaction.reply(reply)

    // check if attachment size is under the limit
    if (image.size >= 2000000) {
        await interaction.editReply(reply + `\n\`Bind Failed: "${image.name}" is larger than the 20 MB size limit\``)
        return
    }

    // check if attachment is of the right type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(image.contentType ?? 'null')) {
        await interaction.editReply(reply + `\n\`Bind Failed: "${image.name}" is not in one of the following formats: "jpeg", "png", "gif"\``)
        return
    }

    // check if command binding is global
    if (userId !== 'global') {
        const checkGlobalResult = await query("SELECT command FROM core_commands WHERE user_id='global' AND command=$1", [
            command
        ])
        if (checkGlobalResult.rowCount > 0) {
            await interaction.editReply(reply + `\n\`Bind Failed: "${command}" is a reserved global command\``)
            return
        }
    }

    // check the checksum of the attached image
    const checksumResult = await checkChecksum(command, userId, image)
    if (checksumResult.error) {
        await interaction.editReply(reply + checksumResult.response)
        return
    }

    // if image was found, set filename to the existing one
    let filename: string
    if (checksumResult.found) {
        filename = checksumResult.filename
    }
    // if image was not found, upload it to vgy and update image table
    else {
        const response = await vgyUpload(await getAttachmentReadableStream(image))
        await query('INSERT INTO core_images VALUES ($1,$2,$3,$4,$5,$6,$7)', [
            image.name,
            response.get('size'),
            response.get('filename'),
            response.get('ext'),
            response.get('image'),
            response.get('delete'),
            checksumResult.checksum
        ])
        filename = response.get('filename')
    }

    // update command table
    await query('INSERT INTO core_commands VALUES ($1,$2,$3)', [
        userId,
        command,
        filename
    ])

    // send confirmation message
    await interaction.editReply(reply + `\n\`Bind Successful: "${image.name}" => "${command}"\``)
}

export { data, execute }
