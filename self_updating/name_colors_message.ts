import Discord from "discord.js"
import {TheStarsAbove} from "../client";

const COLOR_ROLES = {
    "1️⃣": "WHITE",
    "2️⃣": "AQUA",
    "3️⃣": "GREEN",
    "4️⃣": "BLUE",
    "5️⃣": "YELLOW",
    "6️⃣": "PURPLE",
    "7️⃣": "LUMINOUS VIVID PINK",
    "8️⃣": "FUCHSIA",
    "9️⃣": "GOLD",
    "🔟": "ORANGE",
}

export async function name_colors_message(client: TheStarsAbove, channelId: string, messageId?: string) {
    const channel = await client.channels.fetch(channelId)

    if (channel?.type != Discord.ChannelType.GuildText) {
        return console.error("Invalid channel id")
    }

    let description = "React to give yourself a role OR use `/color set` for a custom color"

    for (const [key, value] of Object.entries(COLOR_ROLES)) {
        description += `\n\n${key}   ---   ${value}`
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle("Role Menu: Name Colours")
        .setDescription(description)

    if (messageId) {
        channel.messages.fetch(messageId).then(message => message.edit({embeds: [embed]}))
    } else {
        channel.send({embeds: [embed]})
    }
}
