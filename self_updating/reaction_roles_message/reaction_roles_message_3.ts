import Discord from "discord.js"
import {TheStarsAbove} from "../../client";

const REACTION_ROLES = {
    "Interests": {
        "🎵": "<@&1066093359027998882>",
        "🎮": "<@&926515717224955905>",
        "🎨": "<@&1066093839040921620>",
        "👹": "<@&1066094191802843257>",
        "🎥": "<@&1066094299550318633>",
        "🏋️": "<@&1066094621148586035>",
        "📚": "<@&1066094685296275548>",
        "🍳": "<@&1066094768255414312>",
        "🏀": "<@&1066094926955290705>",
        "🌻": "<@&1066094996299710585>",
        "🙏": "<@&1034678584289267784>",
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
    await reactionRolesMessage(client, "926505179514273863", "1065642184633753640")
}
