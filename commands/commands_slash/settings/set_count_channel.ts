import Discord from "discord.js";
import {getServer} from "../../../models/server";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("set_count_channel")
        .setDescription("Sets the counting channel")
        .addChannelOption(x => x.setName("channel")
            .setDescription("Counting channel")
            .setRequired(true)
            .addChannelTypes(Discord.ChannelType.GuildText)),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        if (!interaction.guild)
            return;

        const channel = interaction.options.getChannel("channel", true)

        const server = await getServer(interaction.guild.id)
        server.channels.countingChannel = channel.id
        await server.save()
        return interaction.reply({content: "Count channel set", ephemeral: true})
    }
}
