import Command from '../commandClass';
import type { ICommandInteraction } from '../../typings/types';
import { MessageEmbed } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import request from 'node-superfetch'


export default class extends Command {

    constructor(bot: any) {
        
        super(bot, {
            name: 'fusion',
            usage: '/fusion <opts>',
            aliases: [],
            options: [
                {
                    name: 'base',
                    description: 'User for the base profile',
                    required: true,
                    type: 'USER'
                },
                {
                    name: 'overlay',
                    description: 'User for the overlay profile (empty chooses you)',
                    required: false,
                    type: 'USER'
                },
                {
                    name: 'type',
                    description: 'Type of avatar',
                    required: false,
                    choices: [
                        {
                            name: 'Server Avatar',
                            value: 'server_avatar'
                        },
                        {
                            name: 'Global Avatar',
                            value: 'global_avatar'
                        }
                    ],
                    type: 'STRING'
                }
            ],
            description: 'Fuse two avatars together',
            category: 'Images',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction) {

        const base = await interaction.options.getUser('base');
        const overlay = await interaction.options.getUser('overlay') || interaction.user;

        if (base?.id === overlay.id) return interaction.reply({
            embeds: [
                new MessageEmbed()
                 .setTitle('ERROR: Mismatched Profiles')
                 .setColor(this.bot.colors.red)
                 .setThumbnail(this.bot.logo)
                 .setDescription('You should select two different users')
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })
            ]
        })

        const baseURL = !interaction.options.get('type') || interaction.options.get('type')?.value === 'server_avatar'
        ? base?.displayAvatarURL({ format: 'jpg', size: 512 }) : base?.avatarURL({ format: 'jpg', size: 512 });

        const overlayURL = !interaction.options.get('type') || interaction.options.get('type')?.value === 'server_avatar'
        ? overlay.displayAvatarURL({ format: 'jpg', size: 512 }) : overlay.avatarURL({ format: 'jpg', size: 512 });

        const baseAvatarData = await request.get(`${baseURL}`);
        const baseAvatarImage = await loadImage(`${baseAvatarData.body}`);
        const overlayAvatarData = await request.get(`${overlayURL}`);
        const overlayAvatarImage = await loadImage(`${overlayAvatarData.body}`);

        const canvas = createCanvas(baseAvatarImage.width, baseAvatarImage.height);
        const ctx = canvas.getContext('2d');

        ctx.globalAlpha = 0.5;
        ctx.drawImage(baseAvatarImage, 0, 0);
        ctx.drawImage(overlayAvatarImage, 0, 0, baseAvatarImage.width, baseAvatarImage.height);

        return interaction.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: 'fused-avatar.png'
            }]
        })
    }
}