import Discord from "discord.js";
import {getServer} from "../../../models/server";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("add_default_role")
        .setDescription("Adds a role to the default list")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addRoleOption(x =>
            x.setName("role")
                .setDescription("Counting channel")
                .setRequired(true)),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        if (!interaction.guild)
            return;

        const role = interaction.options.getRole("role", true)
        const server = await getServer(interaction.guild.id)

        server.roles.default.push(role.id)
        await server.save()
        return interaction.reply({content: `Default role ${role} added`, ephemeral: true})
    }
}
