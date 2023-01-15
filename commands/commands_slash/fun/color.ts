import Discord from "discord.js";

const VALID_COLORS: Record<string, string> = {
    "DEFAULT": "0x000000",
    "WHITE": "0xffffff",
    "AQUA": "0x1abc9c",
    "GREEN": "0x57f287",
    "BLUE": "0x3498db",
    "YELLOW": "0xfee75c",
    "PURPLE": "0x9b59b6",
    "LUMINOUS VIVID PINK": "0xe91e63",
    "FUCHSIA": "0xeb459e",
    "GOLD": "0xf1c40f",
    "ORANGE": "0xe67e22",
    "RED": "0xed4245",
    "GREY": "0x95a5a6",
    "NAVY": "0x34495e",
    "DARK AQUA": "0x11806a",
    "DARK GREEN": "0x1f8b4c",
    "DARK BLUE": "0x206694",
    "DARK PURPLE": "0x71368a",
    "DARK VIVID PINK": "0xad1457",
    "DARK GOLD": "0xc27c0e",
    "DARK ORANGE": "0xa84300",
    "DARK RED": "0x992d22",
    "DARK GREY": "0x979c9f",
    "DARKER GREY": "0x7f8c8d",
    "LIGHT GREY": "0xbcc0c0",
    "DARK NAVY": "0x2c3e50",
    "BLURPLE": "0x5865f2",
    "GREYPLE": "0x99aab5",
    "DARK BUT NOT BLACK": "0x2c2f33",
    "NOT QUITE BLACK": "0x23272a",
}

async function color_set(interaction: Discord.ChatInputCommandInteraction) {
    if (!interaction.guild || !interaction.member || !(interaction.member instanceof Discord.GuildMember))
        return;

    let colorInput = interaction.options.getString("color", true).toUpperCase()

    let color = Number(colorInput)

    if (colorInput in VALID_COLORS) {
        color = Number(VALID_COLORS[colorInput])
    } else if (colorInput == "RANDOM") {
        colorInput = "0x" + Math.floor(Math.random() * 16777215).toString(16).toUpperCase()
    } else if (isNaN(color)) {
        return interaction.reply({content: "Invalid color option", ephemeral: true});
    }

    colorInput = colorInput.replace("0x", "#")

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
                .setDescription("Changes color to provided hex color code OR valid color name. (Enter \"random\" for a random color)")
                .addStringOption(option =>
                    option.setName("color")
                        .setDescription("hex color code OR valid color name. (Enter \"random\" for a random color)")
                        .setRequired(true)
                )),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "set") {
            await color_set(interaction)
        }
    }
}
