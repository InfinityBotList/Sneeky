//const snekfetch = require('snekfetch');
import fetch from 'node-fetch';
import Command from '../commandClass';
import type { ICommandInteraction } from '../../typings/types';
import { MessageEmbed, MessageActionRow, MessageButton, TextChannel } from 'discord.js';


export default class extends Command {

    constructor(bot: any) {
        
        super(bot, {
            name: 'meme',
            usage: '/meme',
            aliases: [],
            options: [],
            description: 'Send a random meme',
            category: 'Fun',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                 .setTitle('Meme Generator')
                 .setColor(this.bot.colors.embed)
                 .setThumbnail(this.bot.logo)
                 .setDescription('Hey there chief! welcome to our meme gen xD Click the button below to start generating your memes!')
                 .addFields(
                    {
                        name: 'PLEASE NOTE',
                        value: "These memes are generated from reddit and may contain nsfw content. We have filters in place to check for this but this system is not guaranteed",
                        inline: false
                    }
                 )
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
                 
            ],
            components: [
                new MessageActionRow()
                .addComponents([
                    new MessageButton()
                     .setLabel('Close Generator')
                     .setStyle('DANGER')
                     .setCustomId('close-memes'),
                    new MessageButton()
                     .setLabel('Generate Meme')
                     .setStyle('PRIMARY')
                     .setCustomId('refresh-button'),
                ])
            ],
            fetchReply: true
        }).then(() => {
            
        })

        const collector = await interaction.channel!.createMessageComponentCollector({
            filter: (fn: any) => fn,
            componentType: 'BUTTON',
            time: 1000 * 15
        });

        collector.on('collect', async (i: any) => {

            if (i.user.id !== interaction.user.id)
            return i.reply({
                content: 'Only the interaction author can complete this action',
                ephemeral: true
            });

            if (i.customId === 'refresh-button') {

                await i.deferUpdate();

                const meme2: any = await fetch('https://www.reddit.com/r/dankmemes.json?sort=top&t=week?limit=1').then(r => r.json());
                
                let nsfwCheck;
                let chan = this.bot.util.resolveChannel(interaction.guild!, `${interaction.channel}`);

                if (chan.type === "GUILD_TEXT") {
                    if ((chan as TextChannel).nsfw) {
                        nsfwCheck = true;
                    } else {
                        nsfwCheck = false;
                    }
                }
                
                const safeContent = nsfwCheck ? meme2.data.children : meme2.data.children.filter((post: any)=> !post.data.over_18);
                
                if (!safeContent.length || !safeContent) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('ERROR: Out of Memes')
                        .setColor(this.bot.colors.red)
                        .setThumbnail(this.bot.logo)
                        .setDescription('Whoops, we are all out of fresh memes for you! check back later')
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`
                        })
                    ]
                });
                
                const randomMemeFromJson = Math.floor(Math.random() * safeContent.length);

                return i.editReply({
                    embeds: [
                        new MessageEmbed()
                         .setTitle(safeContent[randomMemeFromJson].data.title)
                         .setColor(this.bot.colors.embed)
                         .setThumbnail(this.bot.logo)
                         .setImage(safeContent[randomMemeFromJson].data.url)
                         .addFields(
                            {
                                name: 'Author',
                                value: `👨‍💻 ${"`" + safeContent[randomMemeFromJson].data.author + "`"}`,
                                inline: true
                            },
                            {
                                name: 'Upvotes',
                                value: ` 👍 ${"`" + safeContent[randomMemeFromJson].data.ups + "`"}`,
                                inline: true
                            },
                            {
                                name: 'Comments',
                                value: `💬 ${"`" + safeContent[randomMemeFromJson].data.num_comments + "`"}`,
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
                
            } else if (i.customId === 'close-memes') {

                await i.deferUpdate();

                await i.editReply({ 
                    embeds: [
                        new MessageEmbed()
                         .setTitle('Closing Meme Generator')
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

                setTimeout(() => interaction.deleteReply(), 5000);

            }
        })
    }
}