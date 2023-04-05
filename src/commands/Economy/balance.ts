import Command from '../commandClass'
import { MessageEmbed } from 'discord.js'
import type { ICommandInteraction, ICommandArgs } from '../../typings/types'
import { sneekyProfile } from '../../database/profile'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'balance',
            aliases: [],
            options: [
                {
                    name: 'user',
                    description: 'The user to check balance of',
                    required: false,
                    type: 'USER'
                }
            ],
            description: 'Check your balance',
            category: 'Economy',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }
    async execute(interaction: ICommandInteraction, args: ICommandArgs) {
        const argUser = await args.get('user')?.value

        let user

        if (!user) user = await this.bot.util.resolveMember(interaction.guild!, `${interaction.user}`)
        else user = await this.bot.util.resolveMember(interaction.guild!, argUser)

        let profile = await sneekyProfile.findOne({ userId: user.id, guildId: interaction.guild!.id })

        if (!profile)
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle('ERROR: No Profile')
                        .setThumbnail(this.bot.logo)
                        .setColor(this.bot.colors.red)
                        .setDescription(`Hold up chief: ${user.user.username} has no economy profile`)
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
        else
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Balance for: ${user.user.username}`)
                        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                        .setColor(this.bot.colors.embed)
                        .addFields(
                            {
                                name: '👛 Wallet',
                                value: `${'$' + profile.wallet}`,
                                inline: true
                            },
                            {
                                name: '🏦 Bank Account',
                                value: `${'$' + profile.bank}`,
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
