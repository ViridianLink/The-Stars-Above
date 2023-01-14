import Discord from "discord.js";
import {getServer} from "../../../models/server";
import {client} from "../../../index";

module.exports = {
    command: "name_colors_deletion",
    callback: async function (message: Discord.Message) {
        if (!message.guild || !message.member || message.member.id == client.user?.id)
            return;

        const server = await getServer(message.guild.id)

        if (message.channel.id != "1063518630261825597" || message.member.roles.cache.hasAny(...server.roles.moderationRoles))
            return;

        await message.delete()
    }
}
