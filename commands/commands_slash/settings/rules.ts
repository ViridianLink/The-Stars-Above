import Discord from "discord.js";
import {getServer} from "../../../models/server";

async function rules_add(interaction: Discord.ChatInputCommandInteraction) {
    if (!interaction.guild)
        return;

    const server = await getServer(interaction.guild.id)

    const rule = interaction.options.getString("rule", true).replace(/\\n/g, "\n")

    server.serverRules.push(rule)
    await server.save()
}

async function rules_edit(interaction: Discord.ChatInputCommandInteraction) {
    if (!interaction.guild)
        return;

    const server = await getServer(interaction.guild.id)

    const ruleIndex = interaction.options.getInteger("rule_index", true)
    server.serverRules[ruleIndex - 1] = interaction.options.getString("rule", true).replace(/\\n/g, "\n")

    await server.save()
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("rules")
        .setDescription("Manage the server rules")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addSubcommand(subCommand =>
            subCommand.setName("add")
                .setDescription("Add a server rule")
                .addStringOption(x =>
                    x.setName("rule")
                        .setDescription("Rule to add. Don't include a number index")
                        .setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("edit")
                .setDescription("Edit an existing server rule")
                .addIntegerOption(x =>
                    x.setName("rule_index")
                        .setDescription("The rule number you wish to update")
                        .setRequired(true))
                .addStringOption(x =>
                    x.setName("rule")
                        .setDescription("New rule to replace current number. Don't include a number index")
                        .setRequired(true))),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const subCommand = interaction.options.getSubcommand()

        if (subCommand == "add")
            await rules_add(interaction);
        else if (subCommand == "edit")
            await rules_edit(interaction)

        await interaction.reply("Rules successfully updated")

        const rulesMessage = require("../../../self_updating/rules_message")
        await rulesMessage(interaction.client)
    }
}
