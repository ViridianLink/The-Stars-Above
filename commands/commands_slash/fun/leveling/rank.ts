import Discord from "discord.js";
import {getUserConfig} from "../../../../models/user-config";
import Canvas from "canvas";
import fs from "fs";

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
        const [member, userConfig] = await Promise.all([
            interaction.guild.members.fetch(userId),
            getUserConfig(userId)
        ])

        const level = userConfig.leveling.level
        const xpToNextLevel = Math.round(((level + 1) / 0.1) ** 2)

        const canvas = Canvas.createCanvas(1400, 319)
        const ctx = canvas.getContext("2d")
        ctx.textBaseline = "top"
        ctx.textAlign = "start"

        const background = new Canvas.Image()
        fs.readFile("./media/rank_banner_background.jpg", (err, data) => {
            if (err)
                throw err

            background.src = data;
        })

        background.onload = () => ctx.drawImage(background, 0, 0, 1400, 319);

        const avatar = await Canvas.loadImage(member.user.avatarURL({forceStatic: true, size: 256, extension: "png"})!)
        ctx.save()

        ctx.beginPath()
        ctx.arc(107 + 25, 107 + 25, 107, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(avatar, 25, 25, 214, 214)
        ctx.restore()

        ctx.font = "bold 72px sans-serif"
        ctx.fillStyle = "white"
        ctx.fillText(member.user.username, 276, 25)

        ctx.font = "56px sans-serif"
        ctx.fillText(`#${member.user.discriminator}`, 276, 100)

        ctx.fillRect(25, 252, 878, 42)

        ctx.fillStyle = "purple"
        ctx.fillRect(25, 252, 878 * (userConfig.leveling.xp / xpToNextLevel), 42)

        ctx.fillStyle = "white"
        ctx.font = "42px sans-serif"
        ctx.textBaseline = "bottom"
        ctx.fillText("Rank: ", 260, 238)

        ctx.textAlign = "right"
        ctx.fillText(`Level ${level}`, 882, 238)

        ctx.font = "16px sans-serif"
        ctx.fillStyle = "grey"
        ctx.textBaseline = "middle"
        ctx.fillText(`${userConfig.leveling.xp} / ${xpToNextLevel} EXP`, 881, 273)

        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer())
        await interaction.reply({files: [attachment]})
    }
}
