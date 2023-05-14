import {Message} from "discord.js";
import uploadCoreImage from "../../image/uploadCoreImage";
import axios from "axios";
import stream from "stream";

export default async function uploadFlex(message: Message) {
    if (message.attachments.size === 0) {
        await message.author.send('You must attach an image to upload it.')
        return
    }

    message.attachments.each(async (value, key, collection) => {
        await message.author.send(`file: ${value.name}, url: ${value.url}, type: ${value.contentType}`)

        const getImageStream: () => Promise<stream.Readable> = async () => (await axios.get(value.url, {
            responseType: 'stream'
        })).data

        const response = await uploadCoreImage('flex', getImageStream)

        await message.author.send(response)
    })
}