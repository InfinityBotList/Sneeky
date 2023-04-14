import { IConfig, IColors, IWebhookSend } from '../typings/types'
import { Client, WebhookClient, CommandInteraction, MessageEmbed, Collection } from 'discord.js'
import IClientIntents from '../typings/intents'
import { DiscordResolve } from 'discord-resolve'
import config from '../configuration/bot.config'
const logger = require('migizi-logs')
import { readdirSync } from 'fs'
import { join } from 'path'

declare module 'discord.js' {
    interface CommandInteraction {
        replySuccessMessage(content: string): any
        replyErrorMessage(content: string): any
    }
}

CommandInteraction.prototype.replySuccessMessage = function (content: string) {
    return this.reply(content)
}

CommandInteraction.prototype.replyErrorMessage = function (content: string) {
    return this.reply(content)
}

class Bot {
    public client: Client
    public admins: string[]
    public logo: string
    public credits: string
    public errHook: WebhookClient
    public commands: any
    public cooldowns: Map<string, any>
    protected config: IConfig
    protected token: string
    public models: any
    public util: DiscordResolve
    public colors: IColors

    constructor() {
        this.client = new Client({
            intents: [
                IClientIntents.AutoMod.Config,
                IClientIntents.AutoMod.Execute,
                IClientIntents.Guilds.BaseIntent,
                IClientIntents.Guilds.GuildBans,
                IClientIntents.Guilds.GuildEmoji,
                IClientIntents.Guilds.GuildInteg,
                IClientIntents.Guilds.GuildInvite,
                IClientIntents.Guilds.GuildMembers,
                IClientIntents.Guilds.GuildMessages,
                IClientIntents.Guilds.GuildMsgReact,
                IClientIntents.Guilds.GuildMsgTyping,
                IClientIntents.Guilds.GuildPresences,
                IClientIntents.Guilds.GuildWebhooks,
                IClientIntents.Messages.MsgContent
            ],
            partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER']
        })

        this.util = new DiscordResolve(this.client)
        this.errHook = new WebhookClient({ url: config.CHANNELS.LOGS })
        this.colors = config.COLORS as IColors
        this.token = config.TOKENS.DISCORD
        this.credits = config.CREDITS
        this.admins = config.ADMINS
        this.logo = config.LOGO
        this.commands = new Collection()
        this.cooldowns = new Map()
        this.config = config

        this.loadCommands()
        this.loadEvents()
        this.handleErrs()

        this.client.login(this.config.TOKENS.DISCORD)
    }

    private async loadCommands(dir = join(__dirname, '../commands')) {
        readdirSync(dir)
            .filter(f => !f.endsWith('.js'))
            .forEach(async dirs => {
                const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'))

                for (const file of commands) {
                    const importFile = await import(`${dir}/${dirs}/${file}`)
                    const commandClass = importFile.default
                    const command = new commandClass(this)

                    this.commands.set(command.name, command)

                    logger.info(`Loaded command: ${command.name}`)
                }
            })
    }

    private async loadEvents(dir = join(__dirname, '../listeners')) {
        readdirSync(dir).forEach(async file => {
            const getFile = await import(`${dir}/${file}`).then(e => e.default)
            const event = new getFile(this)
            const evtName = file.split('.')[0]

            this.client.on(evtName, (...args) => event.run(...args))

            logger.info(`Loaded event: ${evtName}`)
        })
    }

    private handleErrs() {
        process.on('uncaughtException', error => {
            console.warn(error)

            if (!this.client) return

            return this.errHook.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('ERROR: Uncaught Exception')
                        .setColor(this.colors.red)
                        .setThumbnail(`${this.logo}`)
                        .setDescription('```js' + error.toString() + '```')
                        .setTimestamp()
                        .setFooter({
                            text: `${this.credits}`,
                            iconURL: `${this.logo}`
                        })
                ]
            })
        })

        process.on('unhandledRejection', (listener: any) => {
            console.warn(listener)

            if (!this.client) return

            this.errHook.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('ERROR: UnHandled Rejection')
                        .setColor(this.colors.red)
                        .setThumbnail(`${this.logo}`)
                        .setDescription('```js' + listener.toString() + '```')
                        .setTimestamp()
                        .setFooter({
                            text: `${this.credits}`,
                            iconURL: `${this.logo}`
                        })
                ]
            })
        })

        process.on('rejectionHandled', (listener: any) => {
            console.warn(listener)

            if (!this.client) return

            return this.errHook.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('ERROR: Handled Rejection')
                        .setColor(this.colors.red)
                        .setThumbnail(`${this.logo}`)
                        .setDescription('```js' + listener.toString() + '```')
                        .setTimestamp()
                        .setFooter({
                            text: `${this.credits}`,
                            iconURL: `${this.logo}`
                        })
                ]
            })
        })

        process.on('warning', warning => {
            console.warn(warning)

            if (!this.client) return

            return this.errHook.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('ERROR: Process Warning')
                        .setColor(this.colors.red)
                        .setThumbnail(`${this.logo}`)
                        .setDescription('```js' + warning.toString() + '```')
                        .setTimestamp()
                        .setFooter({
                            text: `${this.credits}`,
                            iconURL: `${this.logo}`
                        })
                ]
            })
        })
    }

    public log(options: IWebhookSend) {
        const webhook = new WebhookClient({
            url: this.config.CHANNELS.LOGS
        })

        webhook.send(options)
    }
}

const bot = new Bot()
export default bot
