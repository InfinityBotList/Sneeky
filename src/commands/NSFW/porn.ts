import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import fetch from 'node-fetch'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'porn',
            usage: '/porn',
            aliases: [],
            options: [],
            description: 'Generate some porn',
            category: 'NSFW',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {
        /**if (interaction.channel?.type === 'GUILD_TEXT') {
            if (!interaction.channel.nsfw) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('ERROR: Incorrect Channel')
                            .setColor(this.bot.colors.red)
                            .setThumbnail(this.bot.logo)
                            .setDescription(
                                `Hang on there horn dog, nsfw commands should be executed in a [nsfw/age restricted channel](https://support.discord.com/hc/en-us/articles/115000084051-Age-Restricted-Channels-and-Content#h_adc93a2c-8fc3-4775-be02-bbdbfcde5010)`
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`
                            })
                    ]
                })
            } else {*/
                const res = await fetch(`https://nekobot.xyz/api/image?type=pgif`).then(r => r.json())

                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Here you go!')
                            .setColor(this.bot.colors.embed)
                            .setThumbnail(this.bot.logo)
                            .setImage(res.message)
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`
                            })
                    ],
                    components: [
                        new MessageActionRow().addComponents([
                            new MessageButton()
                                .setLabel('Close Generator')
                                .setStyle('DANGER')
                                .setCustomId('close-nsfw'),
                            new MessageButton().setLabel('Next Image').setStyle('PRIMARY').setCustomId('generate-nsfw')
                        ])
                    ],
                    fetchReply: true
                })

                const collector = await interaction.channel!.createMessageComponentCollector({
                    filter: (fn: any) => fn,
                    componentType: 'BUTTON',
                    time: 1000 * 15
                })

                collector.on('collect', async (i: any) => {
                    if (i.customId === 'generate-nsfw') {
                        await i.deferUpdate()

                        const res2 = await fetch(`https://nekobot.xyz/api/image?type=pgif`).then(r => r.json())

                        return i.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('This is awkward')
                                    .setColor(this.bot.colors.embed)
                                    .setThumbnail(this.bot.logo)
                                    .setImage(res2.message)
                                    .setTimestamp()
                                    .setFooter({
                                        text: `${this.bot.credits}`,
                                        iconURL: `${this.bot.logo}`
                                    })
                            ]
                        })
                    } else if (i.customId === 'close-nsfw') {
                        await i.deferReply()

                        await i.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle('Closing NSFW Generator')
                                    .setColor(this.bot.colors.red)
                                    .setThumbnail(
                                        'https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif'
                                    )
                                    .setDescription('This may take a few seconds')
                                    .setTimestamp()
                                    .setFooter({
                                        text: `${this.bot.credits}`,
                                        iconURL: `${this.bot.logo}`
                                    })
                            ]
                        })

                        setTimeout(async () => {
                            await i.deleteReply()
                        }, 3000)

                        return interaction.deleteReply()
                    }
                })
            }
        /**}
    }*/
}
