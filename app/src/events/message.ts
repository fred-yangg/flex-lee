import admin from "../utils/admin/admin";
import adminConfig from '../config/admin.json'
import {Events, Message} from "discord.js";

const name = Events.MessageCreate

const once = false

function execute(message: Message) {
    if (!message.inGuild()) {
        if (message.author.id === adminConfig.admin_id) {
            admin(message)
        }
    }
}

export {name, once, execute}