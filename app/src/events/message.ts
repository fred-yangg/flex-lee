import {Client, Events, Message} from 'discord.js'
import admin from '../config/admin.json'
import {scratch} from "../utils/admin";

const name = Events.MessageCreate

const once = false

function execute(message: Message) {
    if (!message.inGuild()) {
        if (message.author.id === admin.admin_id) {
            scratch(message)
        }
    }
}

export {name, once, execute}