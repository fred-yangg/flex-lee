import path from "path";
import fs from "fs";
import {Client} from "discord.js";

interface ClientWrapper {
    client: Client
}

export default function handleEvents(clientWrapper: ClientWrapper) {
    const client = clientWrapper.client
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    console.log('Registering event handlers:')
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args: any[]) => event.execute(...args));
        } else {
            client.on(event.name, (...args: any[]) => event.execute(...args));
        }
        console.log(`\t${event.name}`)
    }
}

