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
    channels: {
        suggestionChannel: string,
        logsChannel: string,
        ticketChannel: string,
        countingChannel: string
    };
    counting: {
        number: number,
        lastUser: string
    };
    disabledCommands: string[],
    hidden: {
        rules: Map<string, string>
    };
    id: string;
    leveling: {
        ignoredChannels: string[]
    };
    moderation: IModeration[];
    reactionRoles: [{
        channelId: string,
        messageId: string,
        roleId: string,
        emoji: string
    }];
    roles: {
        default: string[],
        moderationRoles: string[],
        supportRoles: string[]
    };
    serverRules: string[];
    ticketId: number;

    save(): Promise<IServer>;
}


const ServerSchema = new mongoose.Schema<IServer>({
    channels: {
        suggestionChannel: String,
        logsChannel: String,
        ticketChannel: String,
        countingChannel: String
    },
    counting: {
        number: {type: Number, default: 0},
        lastUser: String
    },
    disabledCommands: [String],
    hidden: {
        rules: {type: Map, of: String}
    },
    id: String,
    leveling: {
        ignoredChannels: [String]
    },
    moderation: [{
        caseNumber: Number,
        guildId: String,
        userId: String,
        logType: String,
        moderatorId: String,
        reason: String
    }],
    reactionRoles: [{
        channelId: String,
        messageId: String,
        roleId: String,
        emoji: String
    }],
    roles: {
        default: [String],
        moderationRoles: [String],
        supportRoles: [String]
    },
    serverRules: [String],
    ticketId: {type: Number, default: 0},
})

export async function getServer(id: string): Promise<IServer> {
    return await Server.findOne({id: id}).exec() || new Server({id: id})
}

export const Server = mongoose.model("Server", ServerSchema)
