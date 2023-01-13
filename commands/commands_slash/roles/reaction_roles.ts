import Discord from "discord.js";
import {getServer, IReactionRole, IServer} from "../../../models/server";
import {parseId} from "../../../common";

async function add_reaction_role(
    server: IServer,
    channel: Discord.GuildTextBasedChannel,
    message: Discord.Message,
    role: Discord.Role,
    emoji: string
) {
    // Create ReactionRole
    const reactionRole: IReactionRole = {
        channelId: channel.id,
        messageId: message.id,
        roleId: role.id,
        emoji: emoji
    }
    server.reactionRoles.push(reactionRole);

    await Promise.all([
        message.react(emoji),
        server.save(),
    ])
}

async function remove_reaction_role(
    interaction: Discord.ChatInputCommandInteraction,
    server: IServer,
    channel: Discord.GuildTextBasedChannel,
    message: Discord.Message,
    emoji: string
) {
    // Find ReactionRole
    const reactionRoleIndex = server.reactionRoles.findIndex((element) => {
        return element.channelId == channel.id && element.messageId == message.id && element.emoji == emoji
    })

    if (reactionRoleIndex == -1) {
        return interaction.reply({content: "No reaction role found", ephemeral: true});
    }
    server.reactionRoles.splice(reactionRoleIndex, 1);

    const reaction = message.reactions.cache.get(emoji)
    if (!reaction) {
        return interaction.reply({content: "No reaction found", ephemeral: true});
    }

    await Promise.all([reaction.remove(), server.save()])
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("reaction_role")
        .setDescription("Reaction role commands")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Add a reaction role")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Target channel for reaction message")
                        .setRequired(true)
                        .addChannelTypes(Discord.ChannelType.GuildText))
                .addStringOption(option =>
                    option.setName("message_id")
                        .setDescription("Enter reaction message ID")
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName("role")
                        .setDescription("Set reaction role")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("emoji")
                        .setDescription("Enter emoji for reaction")
                        .setRequired(true))
        )
        .addSubcommand(subCommand =>
            subCommand.setName("remove")
                .setDescription("Remove a reaction role")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Target channel for reaction message")
                        .setRequired(true)
                        .addChannelTypes(Discord.ChannelType.GuildText))
                .addStringOption(option =>
                    option.setName("message_id")
                        .setDescription("Enter reaction message ID")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("emoji")
                        .setDescription("Enter emoji for reaction")
                        .setRequired(true))
        ),

    execute: async function (interaction: Discord.ChatInputCommandInteraction) {
        if (!interaction.guild) {
            return;
        }

        const server = await getServer(interaction.guild.id)

        const subcommand = interaction.options.getSubcommand();

        const channel = interaction.options.getChannel("channel", true);
        const messageId = parseId(interaction.options.getString("message_id", true)) || "";
        const emoji = interaction.options.getString("emoji", true)

        if (!(channel instanceof Discord.TextChannel)) {
            return interaction.reply({content: "Invalid channel type", ephemeral: true})
        }

        let message;
        try {
            message = await channel.messages.fetch(messageId)
        } catch {
            return interaction.reply({content: "Invalid message id", ephemeral: true})
        }

        if (subcommand == "add") {
            const role = interaction.options.getRole("role", true)

            if (!(role instanceof Discord.Role)) {
                return interaction.reply({content: "Invalid role", ephemeral: true})
            }

            await add_reaction_role(server, channel, message, role, emoji)
            await interaction.reply("Successfully added reaction")

        } else if (subcommand == "remove") {
            await remove_reaction_role(interaction, server, channel, message, emoji)
            await interaction.reply("Successfully removed reaction")
        }
    }
}
