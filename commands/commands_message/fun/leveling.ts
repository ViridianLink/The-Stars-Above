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

        const previousLevel = user.leveling.level

        const lowerBound = 15
        const upperBound = 25
        const multiplier = message.member.roles.cache.has("1032427564796493905") ? 0.15 : 0.1

        user.leveling.xp += Math.floor(Math.random() * (upperBound + 1 - lowerBound)) + lowerBound
        user.leveling.level = Math.floor(multiplier * Math.sqrt(user.leveling.xp))
        user.leveling.lastMessage = message.createdTimestamp

        if (previousLevel < user.leveling.level) {
            message.channel.send(`Congrats! ${message.member} just advanced to level ${user.leveling.level}`)
        }

        if (user.leveling.level >= 5) {
            await message.member.roles.add("1032427564796493905")
        }
        await user.save()
    }
}
