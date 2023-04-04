import type Bot from '../handlers/client';
import type { ICommandInteraction } from '../typings/types';
import { MessageEmbed } from 'discord.js';

const logger = require('migizi-logs');

export default class {
    bot: typeof Bot;

    constructor(bot: typeof Bot) {
        this.bot = bot;
    }

    async run(interaction: ICommandInteraction) {

        if (!interaction.isCommand()) return;

        let member = interaction.guild!.members.cache.get(interaction.user.id);
        if (!member) member = await interaction.guild!.members.fetch(interaction.user.id);

        const command = this.bot.commands.get(interaction.commandName);

        if (!command) return;

        if (command.userPermissions.includes('BOT_ADMIN') && !this.bot.admins.includes(interaction.user.id)) {
            
            let embed = new MessageEmbed()
             .setTitle('ERROR: Missing Permissions')
             .setColor(this.bot.colors.red)
             .setThumbnail(`${this.bot.logo}`)
             .setDescription('Hang on chief, you do not have the necessary permissions to execute this command')
             .addFields(
                {
                    name: 'Required Permissions',
                    value: `\`BOT_ADMIN\``,
                    inline: false
                }
             )
             .setTimestamp()
             .setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })

             return interaction.reply({ embeds: [embed] });
        
        } else if (command.botPermissions.length) {

            for (const permission of command.botPermissions) {
                
                let embed = new MessageEmbed()
                 .setTitle('ERROR: Missing Client Permissions')
                 .setColor(this.bot.colors.red)
                 .setThumbnail(this.bot.logo)
                 .setDescription('Hang on chief looks like i am missing some needed permissions ')
                 .addFields(
                    {
                        name: 'Required Client Permissions',
                        value: `\`${command.botPermissions.map((command: string) => command.split("_").map(x => x[0] + x.slice(1).toLowerCase()).join(" ")).join(', ')}\``,
                        inline: false
                    }
                 )
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })

                if (!interaction.guild!.me!.permissions.has(permission)) return interaction.reply({ embeds: [embed]})
            }
        
        } else if (!this.bot.admins.includes(interaction.user.id)) {

            if (!this.bot.cooldowns.has(command.name)) {

                this.bot.cooldowns.set(command.name, new Map());
            };

            const timeNow = Date.now();
            const tStamps = this.bot.cooldowns.get(command.name);
            const cdAmount = (command.cooldown | 5) * 1000;

            if (tStamps.has(interaction.user.id)) {

                const cdExpirationTime = tStamps.get(interaction.user.id) + cdAmount;

                if (timeNow < cdExpirationTime) {
                    
                    const timeLeft = (cdExpirationTime - timeNow) / 1000;

                    let embed = new MessageEmbed()
                     .setTitle('ERROR: Command Rate limited')
                     .setColor(this.bot.colors.red)
                     .setThumbnail(this.bot.logo)
                     .setDescription(`Please wait: ${timeLeft.toFixed(0)} Seconds before using the: ${command.name} command again!`)
                     .setTimestamp()
                     .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`
                     })

                     return interaction.reply({ embeds: [embed] });
                }
            }

            tStamps.set(interaction.user.id, timeNow);
            setTimeout(() => tStamps.delete(interaction.user.id, cdAmount));
        
        } else {

            interaction.subcommand = interaction.options.getSubcommand(false);

            let args: any = interaction.options;

            try {
            
                await command.execute(interaction, args);
            
            } catch(e) {

                let embed = new MessageEmbed()
                 .setTitle('ERROR: Command execution failed')
                 .setColor(this.bot.colors.red)
                 .setDescription('Whoops, something went wrong here. This has been reported to my developers!')
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })

                 let embed2 = new MessageEmbed()
                 .setTitle('ERROR: Command execution failed')
                 .setColor(this.bot.colors.red)
                 .setDescription("```js" + e + "```")
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })

                 await interaction.reply({ embeds: [embed] });

                 this.bot.log({ embeds: [embed2] });

                 logger.error(e);
            }
        }
    }
}