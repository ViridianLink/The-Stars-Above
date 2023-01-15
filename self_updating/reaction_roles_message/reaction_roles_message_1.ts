import Discord from "discord.js"
import {TheStarsAbove} from "../../client";

const REACTION_ROLES = {
    "DM Status": {
        "📪": "<@&926502756347445299>",
        "❓": "<@&926502675988742185>",
        "📂": "<@&926502720326750228>"
    },
    "Age": {
        "👶": "<@&960395315184275546>",
        "👧": "<@&960395411158343690>",
        "👦": "<@&960395484046975057>",
        "‍👩‍🦰": "<@&960395560148414505>",
        "👱": "<@&960395619090989106>",
        "🧔‍♂️": "<@&960395706894544966>",
        "🧓": "<@&960395876172451850>"
    },
    "Pronouns": {
        "♂️": "<@&926594640000475208>",
        "♀️": "<@&926594602700509194>",
        "⚧": "<@&926594696556449803>",
        "🙃": "<@&926594739485151304>"
    },
    "Relationship Status": {
        "😜": "<@&927231812684636231>",
        "😎": "<@&927231856888393758>",
        "😕": "<@&927231940896104518>",
        "👀": "<@&927232115400130630>",
        "🚷": "<@&927232156185554985>",
        "💍": "<@&927231886210777159>"
    }
}

async function reactionRolesMessage(client: TheStarsAbove, channelId: string, messageId?: string) {
    const channel = await client.channels.fetch(channelId)

    if (channel?.type != Discord.ChannelType.GuildText) {
        return console.error("Invalid channel id")
    }

    let description = "React to give yourself a role. Some roles will give you access to additional channels on this server."
    for (const [category, value] of Object.entries(REACTION_ROLES)) {
        description += `\n\n__**${category}**__`

        for (const [emoji, role] of Object.entries(value)) {
            description += `\n${emoji}   ---   ${role}`
        }
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle("Custom Roles")
        .setDescription(description)

    if (messageId) {
        channel.messages.fetch(messageId).then(message => message.edit({embeds: [embed]}))
    } else {
        channel.send({embeds: [embed]})
    }
}

module.exports = async function (client: TheStarsAbove) {
    await reactionRolesMessage(client, "926505179514273863", "1064248647350497280")
}
