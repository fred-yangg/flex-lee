import {Message} from "discord.js";

export async function scratch(message: Message) {
    await message.author.send('scratch')
}
