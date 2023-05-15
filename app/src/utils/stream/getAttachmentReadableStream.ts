import stream from "stream";
import axios from "axios";
import {Attachment} from "discord.js";

export default async function getAttachmentReadableStream(attachment: Attachment): Promise<stream.Readable> {
    return (await axios.get(attachment.url, {
        responseType: 'stream'
    })).data
}

