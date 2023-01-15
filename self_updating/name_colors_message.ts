import Discord from "discord.js"
import {TheStarsAbove} from "../client";

const COLOR_ROLES = {
    "<:DarkRed:1064097282477277225>": "<@&1063471563371991131>",
    "<:Red:1064097203225890816>": "<@&1063471126682017862>",
    "<:DarkOrange:1064097343613448242>": "<@&1063471535031074857>",
    "<:Orange:1064097205692141628>": "<@&1063471105563689062>",
    "<:Gold:1064097271886651423>": "<@&1063471072932020324>",
    "<:Yellow:1064097204618399754>": "<@&1063470954363224244>",
    "<:DarkGreen:1064097342485184532>": "<@&1063471242641940511>",
    "<:Green:1064097274055098379>": "<@&1063470905625423892>",
    "<:Aqua:1064097344691376178>": "<@&1063470875673907270>",
    "<:DarkAqua:1064097339637243934>": "<@&1063471204259856384>",
    "<:Blue:1064097334293712998>": "<@&1063470929826558022>",
    "<:DarkBlue:1064097341516292116>": "<@&1063471414037975040>",
    "<:Blurple:1064097335107391540>": "<@&1063471726782074930>",
    "<:Purple:1064097200973549628>": "<@&1063470986265108521>",
    "<:DarkPink:1064097280006823996>": "<@&1063471472598843463>",
    "<:LuminousPink:1064097276454240356>": "<@&1063471017546227862>",
    "<:Fuchsia:1064097271186206771>": "<@&1063471048886071396>",
    "<:Coral:1064097337892413441>": "<@&1063960994918969384>",
    "<:LightGrey:1064097275292434452>": "<@&1063471670733582346>",
    "<:NotQuiteBlack:1064097278278766644>": "<@&1063471810160631808>"
}

async function nameColorsMessage(client: TheStarsAbove, channelId: string, messageId?: string) {
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

module.exports = async function (client: TheStarsAbove) {
    await nameColorsMessage(client, "1063518630261825597", "1063528866506887218")
}
