import Command from "../commandClass";
import { MessageEmbed } from "discord.js";
import { sneekyReports } from "../../database/reports";
import type { ICommandInteraction, ICommandArgs } from "../../typings/types";

export default class extends Command {

    constructor(bot: any) {

        super(bot, {
            name: 'report',
            aliases: [],
            args: [],
            description: 'Create a new report or check the status of a report!',
            category: 'Support',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [
                {
                    name: 'bug',
                    description: 'Submit a bug report',
                    options: [
                        {
                            name: 'title',
                            description: 'Short Title for the Bug Report',
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'message',
                            description: 'Describe the bug you are facing here',
                            type: 'STRING',
                            required: true
                        }
                    ]
                }
            ]
        })
    }

    async execute(interaction: ICommandInteraction, args: ICommandArgs) {

        switch(interaction.subcommand) {

            case 'bug':

            let title: string = await args.get('title')?.value;
            let content: string = await args.get('message')?.value
            
            const repID = Math.random().toString().substr(2, 8);

            let waiting = new MessageEmbed()
             .setTitle('Okay, i can do that')
             .setColor(this.bot.colors.embed)
             .setThumbnail(this.bot.logo)
             .setDescription('Please wait while i send your report to my dev team')
             .setTimestamp()
             .setFooter({
                text: `${this.bot.credits}`,
                iconURL: `${this.bot.logo}`
             })

             let msg = await interaction.channel!.send({ embeds: [waiting] });

             let report = await sneekyReports.findOne({ userID: interaction.user.id, repID: repID });

             if (!report) report = await sneekyReports.create({
                type: '[BUG_REPORT]',
                title: title,
                repID: repID,
                userID: interaction.user.id,
                userName: interaction.user.username,
                message: content
             })

             await report.save().then(async () => {

                await msg.delete();

                let sent = new MessageEmbed()
                 .setTitle('Okay, i done did that')
                 .setColor(this.bot.colors.embed)
                 .setThumbnail(this.bot.logo)
                 .setDescription('Your report has been sent off to my dev team.. You can find your Report ID below')
                 .addFields(
                    {
                        name: 'Check Report',
                        value: 'To check the status of the report run this command again with the `check` param',
                        inline: false
                    },
                    {
                        name: 'User Notice',
                        value: 'When checking the status of a report if it no longer exists then the issue has been resolved',
                        inline: false
                    },
                    {
                        name: 'Report ID',
                        value: `${repID}`,
                        inline: false
                    }
                 )
                 .setTimestamp()
                 .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                 })

                 let repLog = new MessageEmbed()
                  .setTitle('New report submitted')
                  .setColor(this.bot.colors.embed)
                  .setThumbnail(this.bot.logo)
                  .setDescription('Hey chief there is a new report to check out')
                  .addFields(
                    {
                        name: 'Report Type',
                        value: '[BUG_REPORT]',
                        inline: false
                    },
                    {
                        name: 'Submitted By',
                        value: `${interaction.user.id} (${interaction.user.id})`,
                        inline: false
                    },
                    {
                        name: 'Report Title',
                        value: `${title.length < 1024 ? title : '[REDACTED_FOR_SIZE_CHECK_DB]'}`,
                        inline: false
                    },
                    {
                        name: 'Report Content',
                        value: `${content.length < 1024 ? content : '[REDACTED_FOR_SIZE_CHECK_DB]'}`,
                        inline: false
                    },
                    {
                        name: 'User Profile',
                        value: `[View Profile](https://discordapp.com/users/${interaction.user.id})`,
                        inline: false
                    }
                  )
                  .setTimestamp()
                  .setFooter({
                    text: `${this.bot.credits}`,
                    iconURL: `${this.bot.logo}`
                  })

                  await this.bot.log({
                    content: `<@&922837596063821835>`,
                    embeds: [repLog]
                  })

                  return interaction.reply({
                    embeds: [sent]
                  })
             })

             break;

             /** ADD MORE SUBCOMMANDS HERE IN THE FUTURE */
        }
    }
}