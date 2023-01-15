import Discord from "discord.js";

async function color_set(interaction: Discord.ChatInputCommandInteraction) {
    if (!interaction.guild || !interaction.member || !(interaction.member instanceof Discord.GuildMember))
        return;

    let colorInput = interaction.options.getString("color", true).toUpperCase().replace("#", "")

    let color;
    if (colorInput == "RANDOM") {
        colorInput = Math.floor(Math.random() * 16777215).toString(16).toUpperCase()
    }

    if (!colorInput.startsWith("#")) {
        colorInput = "#" + colorInput;
    }

    color = parseInt(colorInput.substring(1), 16);

    if (isNaN(color)) {
        return interaction.reply({content: "Invalid color option", ephemeral: true});
    }

    const existingRole = interaction.guild.roles.cache.find(r => r.name === colorInput)
    if (existingRole) {
        await interaction.member.roles.add(existingRole)
        return interaction.reply({content: "Successfully added role", ephemeral: true})
    }

    const colorHeaderRole = await interaction.guild.roles.fetch("1063419860056559666")

    const role = await interaction.guild.roles.create({
        name: colorInput,
        color: color,
        position: colorHeaderRole?.position
    })

    await interaction.member.roles.add(role)
    return interaction.reply({content: "Successfully added role", ephemeral: true})
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("color")
        .setDescription("Change your custom color role")
        .addSubcommand(option =>
            option.setName("set")
                .setDescription("Changes color to provided hex color code. (Enter \"random\" for a random color)")
                .addStringOption(option =>
                    option.setName("color")
                        .setDescription("Hex color code OR \"random\"")
                        .setRequired(true)
                )),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "set") {
            await color_set(interaction)
        }
    }
}
