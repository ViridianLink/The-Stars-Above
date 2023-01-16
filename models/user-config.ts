import mongoose from "mongoose";

export interface IUserConfig {
    id: string;
    leveling: {
        xp: number,
        level: number,
        lastMessage: number
    };

    save(): Promise<IUserConfig>;
}

export async function getUserConfig(id: string): Promise<IUserConfig> {
    return await UserConfig.findOne({id: id}).exec() || new UserConfig({id: id})
}

const UserConfigSchema = new mongoose.Schema<IUserConfig>({
    id: String,
    leveling: {
        xp: {type: Number, default: 0},
        level: {type: Number, default: 0},
        lastMessage: Number
    }
})

export const UserConfig = mongoose.model("UserConfig", UserConfigSchema)
