import Discord from "discord.js";
import {getServer} from "../models/server";
import {TheStarsAbove} from "../client";

async function update_rules_message(client: TheStarsAbove, channelId: string, messageId?: string) {
    const channel = await client.channels.fetch(channelId)
    if (channel?.type != Discord.ChannelType.GuildText)
        return console.error("Invalid channel id");

    const serverConfig = await getServer(channel.guild.id)

    let serverRules = ""
    serverConfig.serverRules
    for (let i = 0; i < serverConfig.serverRules.length; i++) {
        serverRules += `**${i + 1}.** ${serverConfig.serverRules[i]}\n\n`
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle("The Stars Above\n\n__**ꜱᴇʀᴠᴇʀ ʀᴜʟᴇꜱ**__")
        .setDescription(serverRules)

    if (messageId) {
        channel.messages.fetch(messageId).then(message => message.edit({embeds: [embed]}))
    } else {
        channel.send({embeds: [embed]})
    }
}

module.exports = async function (client: TheStarsAbove) {
    await update_rules_message(client, "926490495415382086", "1064184561669505027")
}
