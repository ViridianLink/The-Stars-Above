import Discord from "discord.js"
import {TheStarsAbove} from "../../client";

const REACTION_ROLES = {
    "Interests": {
        "Music": "",
        ":video_game:": "<@&926515717224955905>",
        "Art": "",
        "Anime": "",
        "Movies / TV": "",
        "Fitness": "",
        "Reading": "",
        "Cooking": "",
        "Sports": "",
        "Gardening": "",
        ":pray:": "<@&1034678584289267784>",
    }
}

// noinspection DuplicatedCode
async function reactionRolesMessage(client: TheStarsAbove, channelId: string, messageId?: string) {
    const channel = await client.channels.fetch(channelId)

    if (channel?.type != Discord.ChannelType.GuildText) {
        return console.error("Invalid channel id")
    }

    let description = ""
    for (const [category, value] of Object.entries(REACTION_ROLES)) {
        description += `\n\n__**${category}**__`

        for (const [emoji, role] of Object.entries(value)) {
            description += `\n${emoji}   ---   ${role}`
        }
    }

    const embed = new Discord.EmbedBuilder()
        .setDescription(description)

    if (messageId) {
        channel.messages.fetch(messageId).then(message => message.edit({embeds: [embed]}))
    } else {
        channel.send({embeds: [embed]})
    }
}

module.exports = async function (client: TheStarsAbove) {
    await reactionRolesMessage(client, "926505179514273863", "1064248648826880027")
}
