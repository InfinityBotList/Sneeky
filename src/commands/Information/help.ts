import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'help',
            usage: '/help | /help <command>',
            aliases: [],
            options: [
                {
                    name: 'command',
                    description: 'Command to get help with',
                    type: 'STRING',
                    required: false
                }
            ],
            description: 'List of available commands',
            category: 'Information',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {
        let cmd = interaction.options.getString('command')

        if (cmd) {
            const cmdFetch = this.bot.commands.get(cmd)

            let cmdName = cmdFetch.name.charAt(0).toUpperCase() + cmdFetch.name.slice(1)

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Command Help for: ${cmdName}`)
                        .setThumbnail(this.bot.logo)
                        .setColor(this.bot.colors.embed)
                        .setDescription(cmdFetch.description)
                        .addFields(
                            {
                                name: 'Usage',
                                value: `${cmdFetch.usage}`,
                                inline: true
                            },
                            {
                                name: 'Category',
                                value: `${cmdFetch.category}`,
                                inline: true
                            },
                            {
                                name: 'Rate Limit',
                                value: `${cmdFetch.cooldown + ' Seconds'}`,
                                inline: true
                            }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`
                        })
                ]
            })
        } else {
            const components = (state: any) => [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('help')
                        .setPlaceholder('Select a category')
                        .setDisabled(state)
                        .addOptions([
                            {
                                label: 'Main Menu',
                                value: 'main',
                                description: 'Back to the main help embed'
                            },
                            {
                                label: 'Info Commands',
                                value: 'info',
                                description: 'View all the information category commands'
                            },
                            {
                                label: 'Economy Commands',
                                value: 'economy',
                                description: 'View all the economy category commands'
                            },
                            {
                                label: 'Fun Commands',
                                value: 'fun',
                                description: 'View all the fun category commands'
                            },
                            {
                                label: 'Support Commands',
                                value: 'support',
                                description: 'View all the support category commands'
                            },
                            {
                                label: 'Image Commands',
                                value: 'image',
                                description: 'View all the image category commands'
                            },
                            {
                                label: 'NSFW Commands',
                                value: 'nsfw',
                                description: 'View all of the nsfw category commands'
                            },
                            {
                                label: 'Utility Commands',
                                value: 'utility',
                                description: 'View all of the utility category commands'
                            }
                        ])
                )
            ]

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Help for: ${this.bot.client.user?.username}`)
                        .setColor(this.bot.colors.embed)
                        .setThumbnail(this.bot.logo)
                        .setDescription('Feeling lost? you can find a list of commands here sorted by category')
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`
                        })
                ],
                components: components(false)
            })

            const collector = interaction.channel!.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                dispose: true,
                idle: 10000
            })

            collector.on('collect', async interaction => {
                if (interaction.values[0] === 'main') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`Help for: ${this.bot.client.user?.username}`)
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('Feeling lost? you can find a list of commands here sorted by category')
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                } else if (interaction.values[0] === 'info') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Information Commands')
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('You can use `/help <cmdName>` to view command related help')
                                .addFields({
                                    name: 'Available Commands',
                                    value: `${this.bot.commands
                                        .filter((cmd: any) => cmd.category === 'Information')
                                        .map((cmd: any) => cmd.name)
                                        .join(' , ')}`,
                                    inline: false
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                } else if (interaction.values[0] === 'economy') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Economy Commands')
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('You can use `/help <cmdName>` to view command related help')
                                .addFields({
                                    name: 'Available Commands',
                                    value: `${this.bot.commands
                                        .filter((cmd: any) => cmd.category === 'Economy')
                                        .map((cmd: any) => cmd.name)
                                        .join(' , ')}`,
                                    inline: false
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                } else if (interaction.values[0] === 'fun') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Fun Commands')
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('You can use `/help <cmdName>` to view command related help')
                                .addFields({
                                    name: 'Available Commands',
                                    value: `${this.bot.commands
                                        .filter((cmd: any) => cmd.category === 'Fun')
                                        .map((cmd: any) => cmd.name)
                                        .join(' , ')}`,
                                    inline: false
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                } else if (interaction.values[0] === 'support') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Support Commands')
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('You can use `/help <cmdName>` to view command related help')
                                .addFields({
                                    name: 'Available Commands',
                                    value: `${this.bot.commands
                                        .filter((cmd: any) => cmd.category === 'Support')
                                        .map((cmd: any) => cmd.name)
                                        .join(' , ')}`,
                                    inline: false
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                } else if (interaction.values[0] === 'image') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Image Commands')
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('You can use `/help <cmdName>` to view command related help')
                                .addFields({
                                    name: 'Available Commands',
                                    value: `${this.bot.commands
                                        .filter((cmd: any) => cmd.category === 'Images')
                                        .map((cmd: any) => cmd.name)
                                        .join(' , ')}`,
                                    inline: false
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                } else if (interaction.values[0] === 'nsfw') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('NSFW Commands')
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('You can use `/help <cmdName>` to view command related help')
                                .addFields({
                                    name: 'Available Commands',
                                    value: `${this.bot.commands
                                        .filter((cmd: any) => cmd.category === 'NSFW')
                                        .map((cmd: any) => cmd.name)
                                        .join(' , ')}`,
                                    inline: false
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                } else if (interaction.values[0] === 'utility') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Utility Commands')
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription('You can use `/help <cmdName>` to view command related help')
                                .addFields({
                                    name: 'Available Commands',
                                    value: `${this.bot.commands
                                        .filter((cmd: any) => cmd.category === 'Utility')
                                        .map((cmd: any) => cmd.name)
                                        .join(' , ')}`,
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
            })

            collector.on('end', async (collected, reason) => {
                if (!interaction.isMessageComponent) return

                if (reason === 'idle') {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('ERROR: Interaction Timed Out')
                                .setColor(this.bot.colors.red)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    'The interaction was idle for more then 10 seconds and will now be shut down.'
                                )
                                .addFields({
                                    name: 'Interaction Collector',
                                    value: `Collected: ${collected.size} items before close `
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ],
                        components: []
                    })

                    setTimeout(async () => {
                        await interaction.deleteReply()
                    }, 5000)
                }
            })
        }
    }
}
