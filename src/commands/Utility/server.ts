import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'server',
            usage: '/server',
            aliases: [],
            options: [],
            description: 'Display information about the server',
            category: 'Utility',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {

        const guild = await interaction.guild;
        const owner = await guild?.fetchOwner();
        const channels = await guild?.channels.fetch();
        const roles = await guild?.roles.fetch();
        const users = await guild?.memberCount;
        const prem = await guild?.premiumSubscriptionCount;
        const level = await guild?.verificationLevel;
        const verif = await guild?.verified;
        const part = await guild?.partnered;

        return interaction.reply({ embeds: [
            new MessageEmbed()
             .setAuthor({
                name: `${guild?.name}`,
                iconURL: `${guild?.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'}`
             })
             .setTitle(`Server Information`)
             .setColor(this.bot.colors.embed)
             .setThumbnail(guild?.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg')
             .setDescription(`${guild?.description ? guild?.description : 'No description set'}`)
             .addFields(
                {
                    name: 'Name',
                    value: `${guild?.name}`,
                    inline: true
                },
                {
                    name: 'Owner',
                    value: `👑 ${owner?.user.tag}`,
                    inline: true
                },
                {
                    name: 'Users',
                    value: `🤼 ${users} total`,
                    inline: true
                },
                {
                    name: 'Channels',
                    value: `💬 ${channels ? channels.size : 0} total`,
                    inline : true
                },
                {
                    name: 'Roles',
                    value: `🔥 ${roles ? roles.size : 0} total`,
                    inline: true
                },
                {
                    name: 'Boosters',
                    value: `🤑 ${prem} boosters`,
                    inline: true
                },
                {
                    name: 'Verified',
                    value: `✔️ ${verif}`,
                    inline: true
                },
                {
                    name: 'Partnered',
                    value: `🤝 ${part}`,
                    inline: true
                },
                {
                    name: 'Verification Level',
                    value: `🔒 ${level}`,
                    inline: true
                }
             )
             .setTimestamp()
             .setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })
        ]})
    }
}