import Command from '../commandClass';
import type { ICommandInteraction } from '../../typings/types';
import { MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js';


export default class extends Command {

    constructor(bot: any) {
        
        super(bot, {
            name: 'help',
            aliases: [],
            options: [
                {
                    name: 'command',
                    description: 'Command to get help with',
                    type: 'STRING',
                    required: false
                }
            ],
            description: 'List of available commands',
            category: 'Information',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {
        let cmd = interaction.options.getString('command');

        if (cmd) {
            
            const cmdFetch = this.bot.commands.get(cmd);

            let cmdName = cmdFetch.name.charAt(0).toUpperCase() + cmdFetch.name.slice(1);

            return interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle(`Command Help for: ${cmdName}`)
                 .setThumbnail(this.bot.logo)
                 .setColor(this.bot.colors.embed)
                 .setDescription(cmdFetch.description)
                 .addFields(
                    {
                        name: 'Usage',
                        value: 'Coming Soon',
                        inline: true
                    },
                    {
                        name: 'Category',
                        value: `${cmdFetch.category}`,
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

            const components = (state: any) => [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                    .setCustomId('help')
                    .setPlaceholder('Select a category')
                    .setDisabled(state)
                    .addOptions([
                        {
                            label: "Main Menu",
                            value: 'main',
                            description: 'Back to the main help embed'
                        },
                        {
                            label: "Info Commands",
                            value: 'info',
                            description: 'View all the information category commands'
                        }
                    ])
                ),
            ];

            await interaction.reply({ embeds: [
                new MessageEmbed()
                 .setTitle(`Help for: ${this.bot.client.user?.username}`)
                 .setColor(this.bot.colors.embed)
                 .setThumbnail(this.bot.logo)
                 .setDescription('Feeling lost? you can find a list of commands here sorted by category')
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ], components: components(false)});

            const collector = interaction.channel!.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                idle: 300000,
                dispose: true
            });

            collector.on('collect', async(interaction) => {
                if (interaction.values[0] === 'main') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                             .setTitle(`Help for: ${this.bot.client.user?.username}`)
                             .setColor(this.bot.colors.embed)
                             .setThumbnail(this.bot.logo)
                             .setDescription('Feeling lost? you can find a list of commands here sorted by category')
                             .setTimestamp()
                             .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`
                             })
                        ]
                    })
                } else if (interaction.values[0] === 'info') {
                    await interaction.update({
                        embeds: [
                            new MessageEmbed()
                             .setTitle('Information Commands')
                             .setColor(this.bot.colors.embed)
                             .setThumbnail(this.bot.logo)
                             .setDescription('You can use `/help <cmdName> to view command related help`')
                             .addFields(
                                {
                                    name: 'Available Commands',
                                    value: `${this.bot.commands.filter((cmd: any) => cmd.category === 'Information').map((cmd: any) => cmd.name)}`,
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
            })

            collector.on('end', (reason: any) => {
                if (reason === 'time') {
                    interaction.editReply({
                        content: 'Collector timed out!',
                        components: components(false)
                    })
                } else {
                    interaction.editReply({
                        content: 'Collector destroyed!',
                        components: components(false)
                    })
                }
            })
        }
    }
}