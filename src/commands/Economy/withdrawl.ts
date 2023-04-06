import Command from '../commandClass';
import { MessageEmbed } from 'discord.js'
import type { ICommandInteraction } from '../../typings/types';
import { sneekyProfile } from '../../database/profile';
const { findProfile } = require('../../structures/utils');
const { randomErrors, fetchRandomErrorMsg } = require('../../structures/utils');

export default class extends Command {

	constructor(bot: any) {

		super(bot, {
			name: 'withdrawl',
            usage: '/withdrawl <amount>',
			aliases: [],
			options: [
                {
                    name: 'amount',
                    description: 'The amount to withdrawl',
                    required: true,
                    type: 'NUMBER'
                }
            ],
			description: 'Withdrawl money from your bank account',
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

        const amount: any = interaction.options.getNumber('amount'); 
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

        else if (amount > profile.bank) {

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('ERROR: Insufficient Funds')
                 .setThumbnail(this.bot.logo)
                 .setColor(this.bot.colors.red)
                 .setDescription('You do not have the funds necessary for this transaction')
                 .addFields(
                    {
                        name: 'Amount Requested',
                        value: `${"$" + amount}`,
                        inline: true
                    },
                    {
                        name: 'Amount Available',
                        value: `${"$" + profile.bank}`,
                        inline: true
                    }
                 )
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]})


        } else {

            let bal = profile.bank - amount;
            let wal = profile.wallet +amount;

            await sneekyProfile.updateOne({
                userId: interaction.user.id,
                guildId: interaction.guild!.id
            },{
                $inc: { wallet: amount, bank: -amount}
            })

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle('Deposit Complete')
                 .setColor(this.bot.colors.embed)
                 .setThumbnail(this.bot.logo)
                 .setDescription('Deposit has been completed successfully')
                 .addFields(
                    {
                        name: 'New Balance',
                        value: `${"$" + bal}`,
                        inline: true
                    },
                    {
                        name: 'Amount Deposited',
                        value: `${"$" + amount}`,
                        inline: true
                    },
                    {
                        name: 'Wallet Amount',
                        value: `${"$" + wal}`,
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
}