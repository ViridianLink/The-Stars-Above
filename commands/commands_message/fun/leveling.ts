import Discord from "discord.js";
import {getServer} from "../../../models/server";
import {getUserConfig} from "../../../models/user-config";

module.exports = {
    command: "leveling",
    callback: async function (message: Discord.Message) {
        if (!message.guild || !message.member || message.member.user.bot)
            return;

        const server = await getServer(message.guild.id)

        if (server.leveling.ignoredChannels.includes(message.channel.id))
            return;

        const user = await getUserConfig(message.member.id)

        if (message.createdTimestamp - user.leveling.lastMessage < 60000) {
            return
        }

        const lowerBound = 15
        const upperBound = 25

        user.leveling.xp += Math.floor(Math.random() * (upperBound + 1 - lowerBound)) + lowerBound
        user.leveling.level = Math.floor(0.15 * Math.sqrt(user.leveling.xp))
        user.leveling.lastMessage = message.createdTimestamp
        await user.save()
    }
}
