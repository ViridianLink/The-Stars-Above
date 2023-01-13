import Discord from "discord.js";
import {getServer} from "../../../models/server";
import {client} from "../../../index";

module.exports = {
    command: "counting",
    callback: async function (message: Discord.Message) {
        if (!message.guild || !message.member || message.member.id == client.user?.id)
            return;

        const server = await getServer(message.guild.id)

        if (message.channel.id != server.channels.countingChannel)
            return;

        if (message.member?.id == server.counting.lastUser) {
            await message.react("❌")
            message.channel.send(`${message.member} RUINED IT AT **${server.counting.number}**!! Next number is **1**. **You can't count two numbers in a row.**`)
            server.counting.number = 0
            return server.save()
        }
        if (Number(message.content) != server.counting.number + 1) {
            await message.react("❌")
            message.channel.send(`${message.member} RUINED IT AT **${server.counting.number}**!! Next number is **1**. **Wrong Number.**`)
            server.counting.number = 0
            return server.save()
        }

        server.counting.number += 1
        server.counting.lastUser = message.member.id
        await Promise.all([message.react("✅"), server.save()])
    }
}
