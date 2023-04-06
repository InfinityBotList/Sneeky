import Command from '../commandClass';
import type { ICommandInteraction } from '../../typings/types';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';


export default class extends Command {

    constructor(bot: any) {
        
        super(bot, {
            name: 'yomomma',
            usage: '/yomomma <user>',
            aliases: [],
            options: [
                {
                    name: 'user',
                    description: 'The user to meme on',
                    required: false,
                    type: 'USER'
                }
            ],
            description: 'Sends a yomomma joke',
            category: 'Information',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {

        let user: any = await interaction.options.getUser('user');
        if (!user) user = interaction.user;

        const res = await fetch('https://api.yomomma.info');
        let joke = (await res.json()).joke;

        joke = joke.charAt(0).toLowerCase() + joke.slice(1);

        if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"')) joke += '!';

        return interaction.reply({ 
        content: `<@!${user.id}>`,
        embeds: [
            new MessageEmbed()
             .setTitle('Yo Momma Memes')
             .setColor(this.bot.colors.embed)
             .setThumbnail(this.bot.logo)
             .setDescription(`${joke}`)
             .setTimestamp()
             .setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })
        ]})
         
    }
}