import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'avatar',
            usage: '/avatar <user>',
            aliases: [],
            options: [
                {
                    name: 'user',
                    description: 'User to get the avatar for',
                    required: false,
                    type: 'USER'
                },
            ],
            description: 'View a user\'s avatar',
            category: 'Utility',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {

        const user = await interaction.options.getUser('user') || interaction.user;

        await user.fetch(true);

        return interaction.reply({ embeds: [
            new MessageEmbed()
             .setTitle(`Avatar for: ${user.tag}`)
             .setColor(this.bot.colors.embed)
             .setImage(user.displayAvatarURL({ dynamic: true}) || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg')
             .setTimestamp()
             .setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })
        ]})
    }
}
