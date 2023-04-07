import { Intents } from 'discord.js'

const IClientInteractions = {
    AutoMod: {
        Config: Intents.FLAGS.AUTO_MODERATION_CONFIGURATION,
        Execute: Intents.FLAGS.AUTO_MODERATION_EXECUTION
    },
    Guilds: {
        BaseIntent: Intents.FLAGS.GUILDS,
        GuildBans: Intents.FLAGS.GUILD_BANS,
        GuildEmoji: Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        GuildInteg: Intents.FLAGS.GUILD_INTEGRATIONS,
        GuildInvite: Intents.FLAGS.GUILD_INVITES,
        GuildMembers: Intents.FLAGS.GUILD_MEMBERS,
        GuildMessages: Intents.FLAGS.GUILD_MESSAGES,
        GuildMsgReact: Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        GuildMsgTyping: Intents.FLAGS.GUILD_MESSAGE_TYPING,
        GuildPresences: Intents.FLAGS.GUILD_PRESENCES,
        GuildWebhooks: Intents.FLAGS.GUILD_WEBHOOKS
    },
    Messages: {
        MsgContent: Intents.FLAGS.MESSAGE_CONTENT
    }
}

export default IClientInteractions
