import mongoose from 'mongoose'
import Bot from '../handlers/client'
import config from '../configuration/bot.config'
import { MessageEmbed } from 'discord.js'
const logger = require('migizi-logs')

export default class {
    bot: typeof Bot

    constructor(bot: typeof Bot) {
        this.bot = bot
    }

    async run() {
        const sneeky = this.bot

        await mongoose.connect(
            config.DATABASE,
            {
                family: 4,
                autoIndex: false
            },
            err => {
                if (err) return this.bot.log({ content: 'Database connection failed!' })
            }
        )

        const data: any = []
        const commandsCategories: string[] = []

        this.bot.commands.forEach((c: any) => commandsCategories.push(c.category))
        const categories = [...new Set(commandsCategories)]

        for (const category of categories) {
            const commandsCategory = [...this.bot.commands].filter(([_, c]) => c.category === category)
            for (const c of commandsCategory) {
                if (c[1].subCommands?.length) {
                    const commandOptions: any = []
                    c[1].subCommands.forEach((sc: any) => {
                        commandOptions.push({
                            type: 'SUB_COMMAND',
                            name: sc.name,
                            description: sc.description,
                            required: sc.required,
                            choices: sc.choices,
                            options: sc.options
                        })
                    })
                    data.push({
                        type: 'SUB_COMMAND_GROUP',
                        name: c[1].name,
                        description: c[1].description,
                        options: commandOptions
                    })
                } else if (c[1].options && c[1].options.length) {
                    const commandOptions: any = []
                    c[1].options.forEach((a: any) => {
                        commandOptions.push({
                            type: a.type || 'STRING',
                            name: a.name,
                            description: a.description,
                            required: a.required,
                            choices: a.choices,
                            options: a.options
                        })
                    })
                    data.push({
                        name: c[1].name,
                        description: c[1].description,
                        options: commandOptions
                    })
                } else {
                    // No commands args and no subcommands
                    data.push({
                        name: c[1].name,
                        description: c[1].description
                    })
                }
            }
        }

        let statuses = ['Watching your server']

        setInterval(function () {
            let status = statuses[Math.floor(Math.random() * statuses.length)]

            sneeky.client.user?.setActivity(status, {
                type: 'PLAYING'
            })
        }, 10000)

        this.bot.client.application!.commands.set(data)

        logger.info(`Logged in as: ${this.bot.client.user?.tag}!`)

        this.bot.errHook.send({
            embeds: [
                new MessageEmbed()
                    .setTitle('Startup Successful')
                    .setColor(this.bot.colors.green)
                    .setThumbnail(`${this.bot.client.user?.displayAvatarURL({ dynamic: true })}`)
                    .setDescription('Connected to the Discord API!')
                    .setTimestamp()
                    .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.client.user?.displayAvatarURL({ dynamic: true })}`
                    })
            ]
        })
    }
}
