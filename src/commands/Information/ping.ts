import Command from '../commandClass'
import type { ICommandInteraction } from '../../typings/types'
import { MessageEmbed } from 'discord.js'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'ping',
            usage: '/ping',
            aliases: [],
            options: [],
            description: 'Get the bots latency and ping',
            category: 'Information',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {
        const debut = Date.now()
        const msgInteraction = await interaction.channel!.send('Pinging please wait...')

        await msgInteraction.delete()

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Check it out!')
                    .setColor(this.bot.colors.embed)
                    .setThumbnail(this.bot.logo)
                    .setDescription('Client Latency and Interaction Response Time')
                    .addFields(
                        {
                            name: 'Client Latency',
                            value: `\`${this.bot.client.ws.ping}\`ms`,
                            inline: false
                        },
                        {
                            name: 'Response Time',
                            value: `\`${Date.now() - debut}\`ms`,
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
