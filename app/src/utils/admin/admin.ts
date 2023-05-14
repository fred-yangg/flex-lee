import {Message} from "discord.js";
import scratch from "./scratch";
import uploadFlex from "./commands/upload-flex";

export default async function admin(message: Message) {
    if (await scratch(message)) {
        return
    }

    if (message.content === 'upload-flex') {
        await uploadFlex(message)
    }
}