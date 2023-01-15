import Discord from "discord.js"
import {TheStarsAbove} from "../../client";

const REACTION_ROLES = {
    "Region": {
        "🐧": "<@&926597197972267059>",
        "🦅": "<@&926596893142822974>",
        "🐱": "<@&926596940513300491>",
        "🐦": "<@&926597017881411615>",
        "🦒": "<@&926597362904883200>",
        "🐉": "<@&926596974835277835>",
        "🐨": "<@&926597265039171675>"
    },
    "Server Pings": {
        "⌨️": "<@&926514236719530086>",
        "🎙️": "<@&926514273188991017>",
        "❔": "<@&926514202506579989>",
        "📸": "<@&951002600893980702>",
        "🤫": "<@&927233369455087656>"
    },
    "Interests": {
        "🥵": "<@&1064206034694049822>",
        "😆": "<@&1064206262146957393>",
        "🎮": "<@&926515717224955905>",
        "🙏": "<@&1034678584289267784>"
    }
}

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
        // .setTitle("Custom Roles")
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
