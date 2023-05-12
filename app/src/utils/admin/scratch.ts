import {Message} from "discord.js";

export default async function scratch(message: Message) {
    await message.author.send('scratch')
}
