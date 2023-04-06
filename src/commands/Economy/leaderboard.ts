import Command from '../commandClass';
import { MessageEmbed } from 'discord.js'
import type { ICommandInteraction } from '../../typings/types';
import { sneekyProfile } from '../../database/profile';

export default class extends Command {

	constructor(bot: any) {

		super(bot, {
			name: 'leaderboard',
            usage: '/leaderboard',
			aliases: [],
			options: [],
			description: 'Check the servers leaderboard',
			category: 'Economy',
			cooldown: 5,
			userPermissions: [],
			botPermissions: [],
			subCommands: [],
		})
	}
	async execute(interaction: ICommandInteraction) {

        const profiles = await sneekyProfile.find({ guildId: interaction.guild!.id });

        if (!profiles.length) return interaction.reply({ embeds: [
            new MessageEmbed()
             .setTitle('Error: No Profiles Found')
             .setColor(this.bot.colors.red)
             .setThumbnail(this.bot.logo)
             .setDescription('Unable to find any guild profiles to populate the leaderboard')
             .setTimestamp()
             .setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })
        ]})

        else {

            const sorted = profiles.sort((a, b) => b.bank + b.wallet - a.bank + a.wallet);
            const top10 = sorted.slice(0, 10);

            let embed = new MessageEmbed()
             .setTitle('Top 10 Richest People')
             .setColor(this.bot.colors.embed)
             .setDescription('Results could be less then 10')
             top10.forEach((profile: any)=> {

                let user = this.bot.client.users.cache.get(profile.userId);

                embed.addFields(
                    {
                        name: `${user?.username}`,
                        value: `Wallet: ${"$" + profile.wallet} Bank: ${"$" + profile.bank}`,
                        inline: false
                    }
                )
             })

             embed.setTimestamp()
             embed.setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })

             return interaction.reply({ embeds: [embed] })
        }
	}
}