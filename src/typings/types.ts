import type { CommandInteraction, GuildMember, Collection, HexColorString, Guild } from "discord.js"
/** BASE INTERFACES START HERE */
export interface IGuildDB {
    _id: string;
    guildID: string;
    guildName: string;
    prefix: string;
    status: boolean;
    invitations: boolean;
    logChannel: string;
    premium: boolean;
    commands: Array<any>;
}

export interface IEmojis {
    [index: string]: string;
}

export interface IColors {
    [index: string]: HexColorString;
}

export interface IConfig {
    [index: string]: any;
}

export interface IWebhookSend {
    avatar?: string;
    username?: string;
    embeds?: Array<any>;
    content?: string;
    code?: string;
}

/** GUILD INTERFACES START HERE */
export interface IGuildMinDB {
    id: string;
    name: string;
}

/** OBJECT INTERFACES START HERE */
export interface IObject {
    [index: string]: any;
}

/** COMMAND INTERFACES START HERE */
export interface ICommandOptions {
    name: string;
    aliases: string[];
    args?: Array<ICommandInfosArgs>;
    usage?: string;
    options?: Array<ICommandInfosArgs>;
    category: string;
    description: string;
    cooldown: number;
    userPermissions: string[];
    botPermissions: string[];
    subCommands: any[];
}

export interface ICommandInfosArgs {
    name: string;
    description: string;
    choices?: Array<ICommandChoices>;
    type: string;
    required: boolean;
}

export interface ICommandChoices {
    name: string;
    value: any;
}

export interface ICommandInteraction extends CommandInteraction {
    replySuccessMessage(content: string): Promise<void>;
    replyErrorMessage(content: string): Promise<void>;
    subcommand: string | null;
    member: GuildMember;
}

export interface IGuildEvents extends Guild {
    guild: Guild;
}

export interface ICommandArgs extends Collection<string, any> {}
