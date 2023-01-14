import Discord from "discord.js";
import {getServer} from "../../../models/server";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("get_count")
        .setDescription("Get the current count"),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        if (!interaction.guild)
            return;

        const server = await getServer(interaction.guild.id)
        await interaction.reply({
            content: `Last Number: ${server.counting.number}\nLast User: <@${server.counting.lastUser}>\nNext Number: ${server.counting.number + 1}`,
            ephemeral: true
        })
    }
}
