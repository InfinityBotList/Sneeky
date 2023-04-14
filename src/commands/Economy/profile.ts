import Command from '../commandClass'
import { MessageEmbed } from 'discord.js'
import type { ICommandInteraction } from '../../typings/types'
const { createProfile, findProfile } = require('../../structures/utils')
import { sneekyProfile } from '../../database/profile'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'profile',
            usage: '/profile create',
            aliases: [],
            options: [],
            description: 'View or Create a Economy Profile',
            category: 'Economy',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [
                {
                    name: 'create',
                    description: 'Create your Economy Profile'
                },
                {
                    name: 'view',
                    description: "View someone's economy profile",
                    options: [
                        {
                            name: 'user',
                            description: "The user who's profile you want to fetch",
                            required: true,
                            type: 'USER'
                        }
                    ]
                }
            ]
        })
    }
    async execute(interaction: ICommandInteraction) {
        switch (interaction.subcommand) {
            case 'create':
                let profile = await sneekyProfile.findOne({
                    userId: interaction.user.id,
                    guildId: interaction.guild!.id
                })

                if (profile)
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('ERROR: User Exists')
                                .setThumbnail(this.bot.logo)
                                .setColor(this.bot.colors.red)
                                .setDescription(
                                    'Hold up chief! You already have a Economy Profile. If i let you do this would overwrite your data!'
                                )
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                else {
                    await createProfile(interaction.user, interaction.guild!)

                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('SUCCESS: Profile Created')
                                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                                .setColor(this.bot.colors.embed)
                                .setDescription('Your profile has been created xD')
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })
                }

            case 'view':
                let user = (await interaction.options.getUser('user')) || interaction.user
                let dbProfile = await findProfile(user, interaction.guild!)

                if (!dbProfile)
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('ERROR: Profile not found!')
                                .setColor(this.bot.colors.red)
                                .setThumbnail(this.bot.logo)
                                .setDescription(`Hold up chief: ${user.username} has no economy profile`)
                                .addFields({
                                    name: 'Next Steps',
                                    value: 'They can create a profile using the `/profile create` command'
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`
                                })
                        ]
                    })

                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`${user.username}\'s Profile`)
                            .setColor(this.bot.colors.embed)
                            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                            .addFields(
                                {
                                    name: 'Wallet',
                                    value: `${dbProfile.wallet}`,
                                    inline: true
                                },
                                {
                                    name: 'Bank',
                                    value: `${dbProfile.bank}`,
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
        }
    }
}
