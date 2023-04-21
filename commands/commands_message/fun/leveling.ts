import Discord from "discord.js";
import {getServer} from "../../../models/server";
import {getUserConfig} from "../../../models/user-config";

const levelRoles = new Map<number, string>([
    [5, "1032427564796493905"], // Earthling
    [10, "1068732048396783626"], // Stargazer
    [25, "1068732057926242335"], // Cosmonaut
    [50, "1068732056089145375"], // Moonwalker
    [75, "1068732053857779732"], // Galaxy Hopper
    [100, "1068732051538321459"] // Intergalactic
])

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
        const multiplier = 0.15

        user.leveling.xp += Math.floor(Math.random() * (upperBound + 1 - lowerBound)) + lowerBound
        user.leveling.level = Math.floor(multiplier * Math.sqrt(user.leveling.xp))
        user.leveling.lastMessage = message.createdTimestamp

        if (previousLevel < user.leveling.level) {
            message.channel.send(`Congrats! ${message.member} just advanced to level ${user.leveling.level}`)
        }

        for (const [level, roleId] of levelRoles) {
            if (user.leveling.level < level) {
                await message.member.roles.remove(roleId)
                continue
            }

            await message.member.roles.add(roleId)
        }
        await user.save()
    }
}
