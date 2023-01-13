import Discord from "discord.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {Server} from "./models/server";
import {UserConfig} from "./models/user-config";
import {createServer} from "./servers";
import {TheStarsAbove} from "./client"
import {loadMessageCommands, loadSlashCommands} from "./commands/load_commands";
import deployCommands from "./deploy_commands";

switch (process.env.NODE_ENV) {
    case "development":
        dotenv.config({path: "./.env.local"})
        break;
    default:
        dotenv.config()
        break;
}

mongoose.set("strictQuery", true)
const dbURI = process.env.MONGO_ATLAS_URI || ""
mongoose.connect(dbURI)
    .then(() => console.log("Connected to DB"))
    .catch(console.error)

export const client = new TheStarsAbove({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.MessageContent,
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction,
    ]
})

// Init
client.on("ready", async () => {
    const botConfig = require("./configs/bot_config.json");
    console.log(`${client.constructor.name} is Running, version: ${botConfig.version}`);

    if (client.user) {
        client.user.setPresence({status: "online"})
    }

    // Initialize Servers
    await require("./servers").init(client)

    loadMessageCommands(client)
    loadSlashCommands(client)

    if (process.env.NODE_ENV == "development") {
        deployCommands(client).then()
    }

    // Self Updating
    // const customRoles = require("./self_updating/customRoles")
    // await customRoles(client, "805765564504473641")

    // const updateRules = require("./self_updating/updateRules")
    // await updateRules(client, "747430712617074718")
});


client.on(Discord.Events.GuildCreate, guild => {
    createServer(guild.id)
})


client.on(Discord.Events.MessageCreate, async message => {
    const client = message.client as TheStarsAbove

    await Promise.all(Array.from(client.messageCommands.values()).map(command => command.callback(message)))
})

client.on(Discord.Events.MessageReactionAdd, async (reaction, user) => {
    const guild = reaction.message.guild
    if (!guild) return;

    const server = await Server.findOne({id: guild.id}).exec()
    if (!server) return;

    for (const reactionRole of server.reactionRoles) {
        if (reaction.message.id == reactionRole.messageId && reaction.emoji.toString() == reactionRole.emoji && user.id !== client.user?.id) {
            const member = guild.members.cache.find(member => member.id == user.id)
            if (!member) {
                break;
            }

            const role = await guild.roles.fetch(reactionRole.roleId)
            if (!role) {
                break;
            }

            member.roles.add(role)
                .catch((error) => console.log(error))
            break;
        }
    }
})


client.on(Discord.Events.MessageReactionRemove, async (reaction, user) => {
    const guild = reaction.message.guild
    if (!guild) return;

    const server = await Server.findOne({id: guild.id}).exec()
    if (!server) return;

    for (const reactionRole of server.reactionRoles) {
        if (reaction.message.id == reactionRole.messageId && reaction.emoji.toString() == reactionRole.emoji && user.id !== client.user?.id) {
            const member = guild.members.cache.find(member => member.id == user.id)
            if (!member) {
                break;
            }

            const role = await guild.roles.fetch(reactionRole.roleId)
            if (!role) {
                break;
            }

            member.roles.remove(role)
                .catch((error) => console.log(error))
            break;
        }
    }
})

client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as TheStarsAbove
    const command = client.slashCommands?.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        })
    }
})

client.login(process.env.TOKEN).then();

async function saveAllDB() {
    let tasks: Promise<any>[] = []

    async function saveServers() {
        for (const server of await Server.find().exec()) {
            tasks.push(server.save())
        }
    }

    async function saveUsers() {
        for (const user of await UserConfig.find().exec()) {
            tasks.push(user.save())
        }
    }

    await Promise.all([saveServers(), saveUsers()])
    return tasks
}

if (process.env.NODE_ENV != "development") {
    process.on("uncaughtException", async (error) => {
        await Promise.all(await saveAllDB())
        console.error(error)
    })

    process.on("unhandledRejection", async (reason, promise) => {
        await Promise.all(await saveAllDB())
        console.error(`Unhandled Rejection at: ${promise}  reason: ${reason}`)
    })
}
