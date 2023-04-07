import type Bot from '../handlers/client'
import { ICommandOptions, ICommandInfosArgs } from '../typings/types'

export default class Command {
    protected bot
    public colors
    public util
    protected name: string
    protected aliases: string[]
    protected options: Array<ICommandInfosArgs> | undefined
    protected usage: string | undefined
    protected category: string
    protected description: string
    protected cooldown: number
    protected userPermissions: string[]
    protected botPermissions: string[]
    protected subCommands: string[]
    constructor(bot: typeof Bot, options: ICommandOptions) {
        this.bot = bot
        this.colors = this.bot.colors
        this.util = this.bot.util
        this.name = options.name
        this.aliases = options.aliases
        this.usage = options.usage
        this.options = options.options
        this.category = options.category
        this.description = options.description
        this.cooldown = options.cooldown
        this.userPermissions = options.userPermissions
        this.botPermissions = options.botPermissions
        this.subCommands = options.subCommands
    }
}
