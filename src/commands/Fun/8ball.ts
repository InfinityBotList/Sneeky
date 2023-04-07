import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: '8ball',
            usage: '/8ball <question>',
            aliases: [],
            options: [
                {
                    name: 'question',
                    description: 'The question you want to ask',
                    required: true,
                    type: 'STRING'
                }
            ],
            description: 'Ask the magic 8ball a question',
            category: 'Fun',
            cooldown: 5,
            userPermissions: ['MANAGE_MESSAGES', 'MODERATE_MEMBERS'],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {
        const answers = [
            'It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes, definitely',
            'You may rely on it',
            'As I see it, yes',
            'Most likely',
            'Outlook good',
            'Yes',
            'Signs point to yes',
            'Reply hazy try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',
            "Don't count on it",
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful'
        ]

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('8Ball Results')
                    .setColor(this.bot.colors.embed)
                    .setThumbnail(this.bot.logo)
                    .addFields(
                        {
                            name: 'You Asked',
                            value: `${interaction.options.getString('question')}`
                        },
                        {
                            name: '8Ball Says',
                            value: `${answers[Math.floor(Math.random() * answers.length)]}`
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
