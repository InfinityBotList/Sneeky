import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'lovemeter',
            usage: '/lovemeter <user> <user2>',
            aliases: [],
            options: [
                {
                    name: 'user',
                    description: 'Select a user',
                    required: true,
                    type: 'USER'
                },
                {
                    name: 'user2',
                    description: 'Select another user',
                    required: true,
                    type: 'USER'
                }
            ],
            description: 'Check the love compatibility between two users ',
            category: 'Fun',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {
        let user: any = await interaction.options.getUser('user')
        let user2: any = (await interaction.options.getUser('user2')) || interaction.user

        if (user.id === user2.id)
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle('ERROR: Invalid Params')
                        .setColor(this.bot.colors.red)
                        .setThumbnail(this.bot.logo)
                        .setDescription('I can only calculate love between 2 users!')
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`
                        })
                ]
            })

        const love = Math.random() * 100
        const loveIndex = Math.floor(love / 10)
        const loveLevel = '❤️'.repeat(loveIndex) + '♡'.repeat(10 - loveIndex)

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Love Meter Results')
                    .setColor(this.bot.colors.embed)
                    .setThumbnail(this.bot.logo)
                    .setDescription(
                        '**RESULTS NOTICE:**\n\n- In love percentage = Chance of falling in love\n\n- Match Percentage = How good of a match they are'
                    )
                    .addFields(
                        {
                            name: 'User 1',
                            value: `${user.username}`,
                            inline: false
                        },
                        {
                            name: 'User 2',
                            value: `${user2.username}`,
                            inline: false
                        },
                        {
                            name: 'Match Percentage',
                            value: `${Math.floor(love)}%`,
                            inline: false
                        },
                        {
                            name: 'In Love Percentage',
                            value: `${loveLevel}`,
                            inline: false
                        }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`
                    })
            ]
        })
    }
}
