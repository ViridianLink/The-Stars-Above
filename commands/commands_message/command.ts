import Discord from "discord.js";

export interface IMessageCommand {
    command: string

    callback(message: Discord.Message): any
}
