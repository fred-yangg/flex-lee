import {Client, Events} from 'discord.js'

const name = Events.ClientReady

const once = true

function execute(client: Client<true>) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
}

export {name, once, execute}