import Command from '../commandClass';
import type { ICommandInteraction } from '../../typings/types';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import fetch from 'node-fetch';


export default class extends Command {

    constructor(bot: any) {
        
        super(bot, {
            name: 'advice',
            usage: '/advice',
            aliases: [],
            options: [],
            description: 'Fetch a rather useless fact',
            category: 'Fun',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {

        const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());
        
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                 .setTitle('Helpful Advice')
                 .setColor(this.bot.colors.embed)
                 .setThumbnail(this.bot.logo)
                 .setDescription(data.slip.advice)
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton().setLabel('Close Generator').setStyle('DANGER').setCustomId('close-advice'),
                    new MessageButton().setLabel('Get Advice').setStyle('PRIMARY').setCustomId('generate-advice')
            ])
          ],
          fetchReply: true
        });

        const collector = await interaction.channel!.createMessageComponentCollector({
            filter: (fn: any) => fn,
            componentType: 'BUTTON',
            time: 1000 * 15
        });

        collector.on('collect', async (i: any) => {
            
            if (i.customId === 'generate-advice') {

            await i.deferUpdate();

            const data2 = await fetch('https://api.adviceslip.com/advice').then(res => res.json());

            return i.editReply({
                embeds: [
                    new MessageEmbed()
                     .setTitle('Helpful Advice')
                     .setColor(this.bot.colors.embed)
                     .setThumbnail(this.bot.logo)
                     .setDescription(data2.slip.advice)
                     .setTimestamp()
                     .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`
                     })
                ]
            })
          } else if (i.customId === 'close-advice') {

            await i.deferReply();

            await i.editReply({
                embeds: [
                    new MessageEmbed()
                     .setTitle('Closing Advice Generator')
                     .setColor(this.bot.colors.red)
                     .setThumbnail('https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif')
                     .setDescription('This may take a few seconds')
                     .setTimestamp()
                     .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`
                     })
                ]
            })

            setTimeout(async () => { 
                    
                await i.deleteReply();

            }, 3000);

            return interaction.deleteReply();
          }
        })
    }
}