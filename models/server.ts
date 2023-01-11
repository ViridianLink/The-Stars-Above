import mongoose from "mongoose";

export interface IReactionRole {
    channelId: string,
    messageId: string,
    roleId: string,
    emoji: string
}


export interface IModeration {
    caseNumber: number,
    guildId: string,
    userId: string,
    logType: string,
    moderatorId: string,
    reason: string
}


export interface IServer {
    id: string,
    reactionRoles: [{
        channelId: string,
        messageId: string,
        roleId: string,
        emoji: string
    }],
    disabledCommands: string[],
    roles: {
        default: string[],
        moderationRoles: string[],
        supportRoles: string[]
    },
    channels: {
        suggestionChannel: string,
        logsChannel: string,
        ticketChannel: string
    },
    ticketId: number
    serverRules: string[],
    hidden: {
        rules: Map<string, string>
    },
    moderation: IModeration[]

    save(): Promise<IServer>;
}


const ServerSchema = new mongoose.Schema<IServer>({
    id: String,
    reactionRoles: [{
        channelId: String,
        messageId: String,
        roleId: String,
        emoji: String
    }],
    disabledCommands: [String],
    roles: {
        default: [String],
        moderationRoles: [String],
        supportRoles: [String]
    },
    channels: {
        suggestionChannel: String,
        logsChannel: String,
        ticketChannel: String
    },
    ticketId: {type: Number, default: 0},
    serverRules: [String],
    hidden: {
        rules: {type: Map, of: String}
    },
    moderation: [{
        caseNumber: Number,
        guildId: String,
        userId: String,
        logType: String,
        moderatorId: String,
        reason: String
    }],
})

export async function getServer(id: string): Promise<IServer> {
    return await Server.findOne({id: id}).exec() || new Server({id: id})
}

export const Server = mongoose.model("Server", ServerSchema)
