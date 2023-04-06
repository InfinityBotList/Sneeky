import Command from '../commandClass';
import { MessageEmbed } from 'discord.js'
import type { ICommandInteraction } from '../../typings/types';
import { sneekyProfile } from '../../database/profile';
const { findProfile } = require('../../structures/utils');

export default class extends Command {

	constructor(bot: any) {

		super(bot, {
			name: 'weekly',
            usage: '/weekly',
			aliases: [],
			options: [],
			description: 'Claim your weekly prize',
			category: 'Economy',
			cooldown: 5,
			userPermissions: [],
			botPermissions: [],
			subCommands: [],
		})
	}
	async execute(interaction: ICommandInteraction) {

        const profile = await findProfile(interaction.user, interaction.guild!)

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

        else if (!profile.lastWeekly) {

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            },{
                $set: { lastWeekly: Date.now() }
            })

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            },{
                $inc: { wallet: 100 }
            })

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('Weekly Rewards')
                 .setColor(this.bot.colors.embed)
                 .setThumbnail(this.bot.logo)
                 .setDescription('You have claimed your weekly earnings of `$100`. Come back next week to claim more')
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]})

        } else if (Date.now() - profile.lastWeekly > 604800000) {

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            },{
                $set: { lastWeekly: Date.now() }
            })

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            },{
                $inc: { wallet: 100 }
            })

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('Weekly Rewards')
                 .setColor(this.bot.colors.embed)
                 .setThumbnail(this.bot.logo)
                 .setDescription('You have claimed your weekly earnings of `$100`. Come back next week to claim more')
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]})

        } else {

            const lastWeekly = new Date(profile.lastWeekly);
            const timeLeft = Math.round((lastWeekly.getTime() + 604800000 - Date.now()) / 1000);
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft - hours * 3600) / 60);
            const seconds = timeLeft - hours * 3600 - minutes * 60;

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('ERROR: Weekly Claimed')
                 .setColor(this.bot.colors.red)
                 .setThumbnail(this.bot.logo)
                 .setDescription('You have already claimed your weekly earnings')
                 .addFields(
                    {
                        name: 'Retry In',
                        value: `${hours}h ${minutes}m ${seconds}s`
                    },
                    {
                        name: 'Retry Date',
                        value: `${new Date(Date.now() + 604800000)}`
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
}