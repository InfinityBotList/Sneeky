import Command from '../commandClass'
import moment from 'moment';
import type { ICommandInteraction } from '../../typings/types'
const { getResponse } = require('../../structures/utils');
const Filter = require('bad-words');
import { MessageEmbed } from 'discord.js'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'urban',
            usage: '/urban <word>',
            aliases: [],
            options: [
                {
                    name: 'word',
                    description: 'Provide the word to lookup',
                    required: true,
                    type: 'STRING'
                },
            ],
            description: 'Search Urban Dictionary for the definition of a word',
            category: 'Utility',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {

        const wordFilter = new Filter({
            placeHolder: function() {
                var gralix = '#!@$%&£'
                return gralix[Math.floor(Math.random() * gralix.length)];
            }
        })

        const word = await interaction.options.getString('word');

        const res = await getResponse(`http://api.urbandictionary.com/v0/define?term=${word}`);

        if (!res.success) return interaction.reply({
            embeds: [
                new MessageEmbed()
                 .setTitle('ERROR: Response Failed')
                 .setColor(this.bot.colors.red)
                 .setThumbnail(this.bot.logo)
                 .setDescription(`Couldn't find a definition for: ${word}`)
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]
        })

        let jsonData = res.data;

        if (!jsonData.list[0]) return interaction.reply({
            embeds: [
                new MessageEmbed()
                 .setTitle('ERROR: Response Failed')
                 .setColor(this.bot.colors.red)
                 .setThumbnail(this.bot.logo)
                 .setDescription(`Couldn't find a definition for: ${word}`)
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]
        }) 

        let data = jsonData.list[0];
        let definition = data.definition;
        let example = data.example;
        let author = data.author;

        if (data.definition.length > 1000) definition = data.definition.slice(0, 950) + `... [Read More](${data.permalink})`;
        else if (data.example > 1000) example = data.example.slice(0, 950) + `... [Read More](${data.permalink})`;
        else if (data.author > 1000) author =  data.author.slice(0, 950) + `... [Read More](${data.permalink})`;

        if (interaction.channel?.type === 'GUILD_TEXT') {

            if (!interaction.channel.nsfw) {

                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                         .setTitle(`Definition for: ${wordFilter.clean(data.word.replace(/([a-zA-Z])([A-Z])([a-z])([a-zA-Z])([A-Z])([a-z])/g, data.word))}`)
                         .setColor(this.bot.colors.embed)
                         .setThumbnail(this.bot.logo)
                         .setDescription(wordFilter.clean(definition))
                         .addFields(
                            {
                                name: 'Example',
                                value: `${wordFilter.clean(example)}`,
                                inline: false
                            },
                            {
                                name: 'Author',
                                value: `${wordFilter.clean(data.author)}`,
                                inline: false
                            },
                            {
                                name: 'Likes',
                                value: `${"👍 " + data.thumps_up}`,
                                inline: false
                            },
                            {
                                name: 'Dislikes',
                                value: `${"" + data.thumps_down}`,
                                inline: false
                            },
                            {
                                name: 'Created',
                                value: `<t:${moment(data.written_on).unix()}:R>`,
                                inline: false
                            }
                         )
                         .setTimestamp()
                         .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`
                         })
                    ]
                })
            } else {

                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                         .setTitle(`Definition for: ${data.word}`)
                         .setColor(this.bot.colors.embed)
                         .setThumbnail(this.bot.logo)
                         .setDescription(definition)
                         .addFields(
                            {
                                name: 'Example',
                                value: `${example}`,
                                inline: false
                            },
                            {
                                name: 'Author',
                                value: `${author}`,
                                inline: false
                            },
                            {
                                name: 'Likes',
                                value: `${"👍 " + data.thumps_up}`,
                                inline: false
                            },
                            {
                                name: 'Dislikes',
                                value: `${"" + data.thumps_down}`,
                                inline: false
                            },
                            {
                                name: 'Created',
                                value: `<t:${moment(data.written_on).unix()}:R>`,
                                inline: false
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
    }
}
