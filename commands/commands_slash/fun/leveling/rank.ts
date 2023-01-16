import Discord from "discord.js";
import {getUserConfig} from "../../../../models/user-config";
import Canvas from "canvas";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("rank")
        .setDescription("View your rank or the rank of someone else")
        .addUserOption(x =>
            x.setName("user")
                .setDescription("User you want to view the rank of")),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        if (!interaction.member || !interaction.guild)
            return;

        const userId = interaction.options.getUser("user")?.id ?? interaction.member.user.id
        const user = await interaction.client.users.fetch(userId)
        const userConfig = await getUserConfig(userId)

        const level = Math.floor(0.15 * Math.sqrt(userConfig.leveling.xp))
        const xpToNextLevel = Math.round(((level + 1) / 0.15) ** 2)

        const canvas = Canvas.createCanvas(1400, 319)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#242424";
        ctx.fillRect(0, 0, 1400, 319);

        const avatar = await Canvas.loadImage(user.avatarURL({forceStatic: true, size: 256, extension: "png"})!)
        ctx.drawImage(avatar, 40, 40, 200, 200)

        ctx.font = "72px sans-serif"
        ctx.fillStyle = "white"
        ctx.textAlign = "left"
        ctx.fillText(user.username, 270, 100)

        ctx.fillRect(30, 260, 900, 50)

        ctx.fillStyle = "purple"
        ctx.fillRect(30, 260, 900 * (userConfig.leveling.xp / xpToNextLevel), 50)

        ctx.fillStyle = "white"
        ctx.font = "36px sans-serif"
        ctx.fillText("Rank: WIP", 260, 250)

        ctx.textAlign = "right"
        ctx.fillText(`Level ${level}`, 875, 250)

        ctx.fillStyle = "black"
        ctx.fillText(`${userConfig.leveling.xp} / ${xpToNextLevel} EXP`, 875, 300)

        const serverIcon = await Canvas.loadImage(interaction.guild.iconURL({
            forceStatic: true,
            size: 256,
            extension: "png"
        })!)

        ctx.drawImage(serverIcon, 1000, (canvas.height - serverIcon.height) / 2, serverIcon.width, serverIcon.height)

        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer())

        await interaction.reply({files: [attachment]})
    }
}
