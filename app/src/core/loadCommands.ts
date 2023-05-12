import {Collection} from "discord.js";
import Command from "../interfaces/Command";
import path from "path";
import fs from "fs";

const commands: Collection<string, Command> = new Collection()

export default async function loadCommands() {
    if (commands.size === 0) {
        const commandsPath = path.join(__dirname, '../commands')
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command: Command = await import(filePath)

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                commands.set(command.data.name, command)
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    return commands;
}
