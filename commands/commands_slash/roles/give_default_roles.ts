import Discord from "discord.js";
import {getServer} from "../../../models/server";
import {getRoleResolvable} from "../../../common";

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("give_default_roles")
        .setDescription("Gives all members the default roles")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        if (!interaction.guild)
            return;

        const server = await getServer(interaction.guild.id)
        const defaultRoles = await getRoleResolvable(interaction.guild, server.roles.default)

        await interaction.deferReply()
        for (const [, member] of await interaction.guild.members.fetch()) {
            if (!member.user.bot)
                await member.roles.add(defaultRoles)
        }

        await interaction.editReply("All members given the default role")
    }
}
