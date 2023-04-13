import type Bot from '../handlers/client'
import type { ICommandInteraction } from '../typings/types'
import { MessageEmbed } from 'discord.js'

const logger = require('migizi-logs')

export default class {
    bot: typeof Bot

    constructor(bot: typeof Bot) {
        this.bot = bot
    }

    async run(interaction: ICommandInteraction) {
        if (!interaction.isCommand()) return

        let member = interaction.guild!.members.cache.get(interaction.user.id)
        if (!member) member = await interaction.guild!.members.fetch(interaction.user.id)

        const command = this.bot.commands.get(interaction.commandName)

        if (!command) return

        if (command.userPermissions.includes('BOT_ADMIN') && !this.bot.admins.includes(interaction.user.id)) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle('ERROR: Missing Permissions')
                        .setColor(this.bot.colors.red)
                        .setThumbnail(`${this.bot.logo}`)
                        .setDescription(
                            'Hang on chief, you do not have the necessary permissions to execute this command'
                        )
                        .addFields({
                            name: 'Required Permissions',
                            value: `\`BOT_ADMIN\``,
                            inline: false
                        })
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`
                        })
                ]
            })
        } else if (command.botPermissions.length) {
            for (const permission of command.botPermissions) {
                if (!interaction.guild!.me!.permissions.has(permission))
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('ERROR: Missing Client Permissions')
                                .setColor(this.bot.colors.red)
                                .setThumbnail(this.bot.logo)
                                .setDescription('Hang on chief looks like i am missing some needed permissions ')
                                .addFields({
                                    name: 'Required Client Permissions',
                                    value: `\`${command.botPermissions
                                        .map((command: string) =>
                                            command
                                                .split('_')
                                                .map(x => x[0] + x.slice(1).toLowerCase())
                                                .join(' ')
                                        )
                                        .join(', ')}\``,
                                    inline: false
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
            }

        } else {

            interaction.subcommand = interaction.options.getSubcommand(false)

            let args: any = interaction.options

            try {
                await command.execute(interaction, args)
            } catch (e: any) {
                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('ERROR: Command execution failed')
                            .setColor(this.bot.colors.red)
                            .setDescription(
                                'Whoops, something went wrong here. This has been reported to my developers!'
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`
                            })
                    ]
                })

                this.bot.log({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('ERROR: Command execution failed')
                            .setColor(this.bot.colors.red)
                            .setDescription('```js' + e + '```')
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`
                            })
                    ]
                })

                logger.error(e.message)
            }
        }
    }
}
