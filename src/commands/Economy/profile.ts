import Command from '../commandClass';
import { MessageEmbed } from 'discord.js'
import type { ICommandInteraction } from '../../typings/types';
const { createProfile } = require('../../structures/utils');
import { sneekyProfile } from '../../database/profile';

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
                    description: 'Create your Economy Profile',
                }
            ],
		})
	}
	async execute(interaction: ICommandInteraction) {

        switch(interaction.subcommand) {

            case 'create':

              let profile = await sneekyProfile.findOne({ userId: interaction.user.id, guildId: interaction.guild!.id });

              if (profile) return interaction.reply({ embeds: [
            
                new MessageEmbed()
                 .setTitle('ERROR: User Exists')
                 .setThumbnail(this.bot.logo)
                 .setColor(this.bot.colors.red)
                 .setDescription('Hold up chief! You already have a Economy Profile. If i let you do this would overwrite your data!')
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
              ]})
    
              else {

                await createProfile(interaction.user, interaction.guild!);

                return interaction.reply({ embeds: [
                    
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
                ]})
              }
        }
	}
}