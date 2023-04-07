import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import fetch from 'node-fetch'
const { shuffleArray } = require('../../structures/utils')
const { decode } = require('html-entities')

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'quiz',
            usage: '/quiz <opts>',
            aliases: [],
            options: [
                {
                    name: 'category',
                    type: 'STRING',
                    description: 'Question Category.',
                    required: false,
                    choices: [
                        {
                            name: 'Any Category',
                            value: 'any'
                        },
                        {
                            name: 'General Knowledge',
                            value: '&category=9'
                        },
                        {
                            name: 'Entertainment: Books',
                            value: '&category=10'
                        },
                        {
                            name: 'Entertainment: Films',
                            value: '&category=11'
                        },
                        {
                            name: 'Entertainment: Music',
                            value: '&category=12'
                        },
                        {
                            name: 'Entertainment: Musicals & Theaters',
                            value: '&category=13'
                        },
                        {
                            name: 'Entertainment: Television',
                            value: '&category=14'
                        },
                        {
                            name: 'Entertainment: Video Games',
                            value: '&category=15'
                        },
                        {
                            name: 'Entertainment: Board Games',
                            value: '&category=16'
                        },
                        {
                            name: 'Entertainment: Comics',
                            value: '&category=17'
                        },
                        {
                            name: 'Entertainment: Japanese Anime & Manga',
                            value: '&category=18'
                        },
                        {
                            name: 'Entertainment: Cartoon & Animations',
                            value: '&category=19'
                        },
                        {
                            name: 'Science & Nature',
                            value: '&category=20'
                        },
                        {
                            name: 'Science: Computers',
                            value: '&category=21'
                        },
                        {
                            name: 'Science: Mathematics',
                            value: '&category=22'
                        },
                        {
                            name: 'Science: Gadgets',
                            value: '&category=23'
                        },
                        {
                            name: 'Mythology',
                            value: '&category=24'
                        },
                        {
                            name: 'Sports',
                            value: '&category=25'
                        },
                        {
                            name: 'Geography',
                            value: '&category=26'
                        },
                        {
                            name: 'History',
                            value: '&category=27'
                        },
                        {
                            name: 'Politics',
                            value: '&category=28'
                        },
                        {
                            name: 'Art',
                            value: '&category=29'
                        },
                        {
                            name: 'Celebrities',
                            value: '&category=30'
                        },
                        {
                            name: 'Animals',
                            value: '&category=31'
                        },
                        {
                            name: 'Vehicles',
                            value: '&category=32'
                        }
                    ]
                },
                {
                    name: 'difficulty',
                    type: 'STRING',
                    description: 'Question Difficulty.',
                    required: false,
                    choices: [
                        {
                            name: 'Any Difficulty',
                            value: 'any'
                        },
                        {
                            name: 'Easy',
                            value: '&difficulty=easy'
                        },
                        {
                            name: 'Medium',
                            value: '&difficulty=medium'
                        },
                        {
                            name: 'Hard',
                            value: '&difficulty=hard'
                        }
                    ]
                }
            ],
            description: 'Quiz time.',
            category: 'Fun',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {
        var category
        var difficulty

        if (!interaction.options.get('category') || interaction.options.get('category')?.value === 'any') {
            category = ''
        } else {
            category = interaction.options.get('category')?.value
        }

        if (!interaction.options.get('difficulty') || interaction.options.get('difficulty')?.value === 'any') {
            difficulty = ''
        } else {
            difficulty = interaction.options.get('difficulty')?.value
        }

        const quizes: any = await fetch(`https://opentdb.com/api.php?amount=1&type=multiple${category}${difficulty}`)
        const result = await quizes.json()
        const quiz = result.results[0]
        const question = decode(quiz.question)
        quiz.incorrect_answers.push(quiz.correct_answer)
        shuffleArray(quiz.incorrect_answers)

        console.log(quiz.correct_answer)

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(quiz.category)
                    .setColor(this.bot.colors.embed)
                    .setThumbnail(this.bot.logo)
                    .setDescription(question)
                    .addFields({
                        name: 'Choices',
                        value: `A. ${decode(quiz.incorrect_answers[0])}\n
                        B. ${decode(quiz.incorrect_answers[1])}\n
                        C. ${decode(quiz.incorrect_answers[2])}\n
                        D. ${decode(quiz.incorrect_answers[3])}`,
                        inline: false
                    })
                    .setTimestamp()
                    .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`
                    })
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton().setCustomId(quiz.incorrect_answers[0]).setLabel('A').setStyle('SUCCESS'),
                    new MessageButton().setCustomId(quiz.incorrect_answers[1]).setLabel('B').setStyle('SUCCESS'),
                    new MessageButton().setCustomId(quiz.incorrect_answers[2]).setLabel('C').setStyle('SUCCESS'),
                    new MessageButton().setCustomId(quiz.incorrect_answers[3]).setLabel('D').setStyle('SUCCESS')
                ])
            ],
            fetchReply: true
        })

        const collector = await interaction.channel!.createMessageComponentCollector({
            filter: (fn: any) => fn,
            componentType: 'BUTTON',
            time: 1000 * 15
        })

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id)
                return interaction.reply({
                    content: 'These buttons are not for you chief!',
                    ephemeral: true
                })

            if (i.customId === quiz.correct_answer) {
                await i.deferUpdate()

                i.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`${quiz.category}`)
                            .setColor(this.bot.colors.embed)
                            .setThumbnail(this.bot.logo)
                            .setDescription('Here are your results chief!')
                            .addFields(
                                {
                                    name: `Question`,
                                    value: `${question}`,
                                    inline: false
                                },
                                {
                                    name: 'Quiz Results',
                                    value: 'You answered correctly! GG',
                                    inline: false
                                }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`
                            })
                    ],
                    components: []
                })
            } else {
                await i.deferUpdate()

                i.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`${quiz.category}`)
                            .setColor(this.bot.colors.embed)
                            .setThumbnail(this.bot.logo)
                            .setDescription('Here are your results chief!')
                            .addFields(
                                {
                                    name: `Question`,
                                    value: `${question}`,
                                    inline: false
                                },
                                {
                                    name: 'Quiz Results',
                                    value: 'You answered incorrectly! Better luck next time',
                                    inline: false
                                }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`
                            })
                    ],
                    components: []
                })
            }
        })
    }
}
