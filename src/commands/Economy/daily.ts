import Command from '../commandClass';
import { MessageEmbed } from 'discord.js'
import type { ICommandInteraction } from '../../typings/types';
import { sneekyProfile } from '../../database/profile';
const { findProfile } = require('../../structures/utils');
const { randomErrors, fetchRandomErrorMsg } = require('../../structures/utils');

export default class extends Command {

	constructor(bot: any) {

		super(bot, {
			name: 'daily',
            usage: '/daily',
			aliases: [],
			options: [],
			description: 'Claim your daily prize',
			category: 'Economy',
			cooldown: 5,
			userPermissions: [],
			botPermissions: [],
			subCommands: [],
		})
	}
	async execute(interaction: ICommandInteraction) {

        if (await randomErrors(interaction.user.id)) {
            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('ERROR: Unknown Error')
                 .setColor(this.bot.colors.red)
                 .setThumbnail(this.bot.logo)
                 .setDescription(`${await fetchRandomErrorMsg()}`)
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]})

        } 

        const profile = await findProfile(interaction.user, interaction.guild!);

        if (!profile) return interaction.reply({ embeds: [
            new MessageEmbed()
             .setTitle('ERROR: No Profile')
             .setThumbnail(this.bot.logo)
             .setColor(this.bot.colors.red)
             .setDescription('Hold up chief, you do not have a economy profile. You can create one using the `/profile create` command')
             .setTimestamp()
             .setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })
        ]})

        else if (!profile.lastDaily) {

            await sneekyProfile.updateOne({ 
                userId: interaction.user.id, 
                guildId: interaction.guild!.id 
            }, {
                $set: { lastDaily: Date.now() }
            })

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            }, {
                $inc: { wallet: 25 }
            })

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                     .setTitle('Daily Rewards')
                     .setThumbnail(this.bot.logo)
                     .setColor(this.bot.colors.embed)
                     .setDescription('You have collected today\'s earnings of \'$25\' come back tomorrow to claim again')
                     .setTimestamp()
                     .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`
                     })
                ]
            })
        } else if (Date.now() - profile.lastDaily > 86400000) {

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            },{
                $set: { lastDaily: Date.now() }
            })

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            },{
                $inc: { wallet: 25 }
            })

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('Daily Rewards')
                 .setThumbnail(this.bot.logo)
                 .setColor(this.bot.colors.embed)
                 .setDescription('You have collected today\'s earnings of \'$25\' come back tomorrow to claim again')
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]})

        } else {

            const lastDaily = new Date(profile.lastDaily);
            const timeLeft = Math.round((lastDaily.getTime() + 86400000 - Date.now()) / 1000);
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft - hours * 3600) / 60);
            const seconds = timeLeft - hours * 3600 - minutes * 60;

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('Error: Daily Claimed')
                 .setColor(this.bot.colors.red)
                 .setThumbnail(this.bot.logo)
                 .setDescription(`Please wait: ${hours}h ${minutes}m ${seconds}s before you can claim your daily earnings again`)
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]})
        }
	}
}