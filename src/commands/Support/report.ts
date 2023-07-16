import Command from "../commandClass";
import config from "../../configuration/bot.config";
import { MessageEmbed } from "discord.js";
import { sneekyReports } from "../../database/reports";
import type { ICommandInteraction, ICommandArgs } from "../../typings/types";
const { randomErrors, fetchRandomErrorMsg } = require("../../structures/utils");

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: "report",
            usage: "/report bug | /report check | /report update",
            aliases: [],
            args: [],
            description: "Create a new report or check the status of a report!",
            category: "Support",
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [
                {
                    name: "bug",
                    description: "Submit a bug report",
                    options: [
                        {
                            name: "title",
                            description: "Short Title for the Bug Report",
                            type: "STRING",
                            required: true,
                        },
                        {
                            name: "message",
                            description: "Describe the bug you are facing here",
                            type: "STRING",
                            required: true,
                        },
                    ],
                },
                {
                    name: "check",
                    description: "Check the status of a report",
                    options: [
                        {
                            name: "report_id",
                            description: "The ID of the Report",
                            type: "STRING",
                            required: true,
                        },
                    ],
                },
                {
                    name: "update",
                    description: "Update the state of a report",
                    options: [
                        {
                            name: "report_id",
                            description: "The ID of the Report",
                            type: "STRING",
                            required: true,
                        },
                        {
                            name: "is_resolved",
                            description: "Has the report been handled/resolved",
                            required: true,
                            type: "BOOLEAN",
                        },
                    ],
                },
            ],
        });
    }

    async execute(interaction: ICommandInteraction, args: ICommandArgs) {
        switch (interaction.subcommand) {
            case "bug":
                if (await randomErrors(interaction.user.id)) {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("ERROR: Unknown Error")
                                .setColor(this.bot.colors.red)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    `${await fetchRandomErrorMsg()}`
                                )
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`,
                                }),
                        ],
                    });
                }

                let title: string = await args.get("title")?.value;
                let content: string = await args.get("message")?.value;

                const repID = Math.random().toString().substr(2, 8);

                let msg = await interaction.channel!.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Okay, i can do that")
                            .setColor(this.bot.colors.embed)
                            .setThumbnail(this.bot.logo)
                            .setDescription(
                                "Please wait while i send your report to my dev team"
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`,
                            }),
                    ],
                });

                let report = await sneekyReports.findOne({
                    userID: interaction.user.id,
                    repID: repID,
                });

                if (!report)
                    report = await sneekyReports.create({
                        type: "[BUG_REPORT]",
                        title: title,
                        repID: repID,
                        userID: interaction.user.id,
                        userName: interaction.user.username,
                        implemented: false,
                        message: content,
                        active: true,
                    });

                await report.save().then(async () => {
                    await msg.delete();

                    await this.bot.log({
                        content: `<@&922837596063821835>`,
                        embeds: [
                            new MessageEmbed()
                                .setTitle("New report submitted")
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    "Hey chief there is a new report to check out"
                                )
                                .addFields(
                                    {
                                        name: "Report Type",
                                        value: "[BUG_REPORT]",
                                        inline: false,
                                    },
                                    {
                                        name: "Submitted By",
                                        value: `${interaction.user.id} (${interaction.user.id})`,
                                        inline: false,
                                    },
                                    {
                                        name: "Report Title",
                                        value: `${
                                            title.length < 1024
                                                ? title
                                                : "[REDACTED_FOR_SIZE_CHECK_DB]"
                                        }`,
                                        inline: false,
                                    },
                                    {
                                        name: "Report Content",
                                        value: `${
                                            content.length < 1024
                                                ? content
                                                : "[REDACTED_FOR_SIZE_CHECK_DB]"
                                        }`,
                                        inline: false,
                                    },
                                    {
                                        name: "User Profile",
                                        value: `[View Profile](https://discordapp.com/users/${interaction.user.id})`,
                                        inline: false,
                                    }
                                )
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`,
                                }),
                        ],
                    });

                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Okay, i done did that")
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    "Your report has been sent off to my dev team.. You can find your Report ID below"
                                )
                                .addFields(
                                    {
                                        name: "Check Report",
                                        value: "To check the status of the report run this command again with the `check` param",
                                        inline: false,
                                    },
                                    {
                                        name: "User Notice",
                                        value: "When checking the status of a report if it no longer exists then the issue has been resolved",
                                        inline: false,
                                    },
                                    {
                                        name: "Report ID",
                                        value: `${repID}`,
                                        inline: false,
                                    }
                                )
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`,
                                }),
                        ],
                    });
                });

                break;

            case "check":
                if (await randomErrors(interaction.user.id)) {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("ERROR: Unknown Error")
                                .setColor(this.bot.colors.red)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    `${await fetchRandomErrorMsg()}`
                                )
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`,
                                }),
                        ],
                    });
                }

                let repId: any = await args.get("report_id")?.value;
                let repFetch: any = await sneekyReports.findOne({
                    userID: interaction.user.id,
                    repID: repId,
                });

                if (!repFetch)
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("ERROR: Report not found")
                                .setColor(this.bot.colors.red)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    "Whoops, i can't seem to find that report anywhere"
                                )
                                .addFields({
                                    name: "Notice",
                                    value: "In most cases this means it has been addressed",
                                    inline: false,
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`,
                                }),
                        ],
                    });
                else {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Report Information")
                                .setColor(this.bot.colors.embed)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    "Here is your report info/status"
                                )
                                .addFields(
                                    {
                                        name: "Report Type",
                                        value: "[BUG_REPORT]",
                                        inline: false,
                                    },
                                    {
                                        name: "Report State",
                                        value: `${
                                            repFetch.implemented
                                                ? "[FIXED/PATCHED]"
                                                : "[PENDING]"
                                        }`,
                                        inline: false,
                                    },
                                    {
                                        name: "Report Title",
                                        value: `${repFetch.title}`,
                                        inline: false,
                                    },
                                    {
                                        name: "Report Content",
                                        value: `${repFetch.message}`,
                                        inline: false,
                                    }
                                )
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`,
                                }),
                        ],
                    });
                }

                break;

            case "update":
                let reportId: any = args.get("report_id")?.value;
                let isActive: boolean = args.get("is_resolved")?.value;
                let reportFetch = await sneekyReports.findOne({
                    userID: interaction.user.id,
                    repID: reportId,
                });

                if (!config.ADMINS.includes(interaction.user.id)) return;

                if (isActive) {
                    reportFetch.active = true;
                    reportFetch.implemented = false;

                    await reportFetch.save().then(async () => {
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("ACTION: Report State Update")
                                    .setColor(this.bot.colors.embed)
                                    .setThumbnail(this.bot.logo)
                                    .setDescription(
                                        "The report has been updated successfully"
                                    )
                                    .addFields({
                                        name: "Report State",
                                        value: `${
                                            reportFetch.active
                                                ? "[PENDING]"
                                                : "[FIXED/PATCHED]"
                                        }`,
                                        inline: false,
                                    })
                                    .setTimestamp()
                                    .setFooter({
                                        text: `${this.bot.credits}`,
                                        iconURL: `${this.bot.logo}`,
                                    }),
                            ],
                        });
                    });
                } else {
                    reportFetch.active = false;
                    reportFetch.implemented = true;

                    await reportFetch.save().then(async () => {
                        return interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("ACTION: Report State Update")
                                    .setColor(this.bot.colors.embed)
                                    .setThumbnail(this.bot.logo)
                                    .setDescription(
                                        "The report has been updated successfully"
                                    )
                                    .addFields({
                                        name: "Report State",
                                        value: `${
                                            reportFetch.active
                                                ? "[PENDING]"
                                                : "[FIXED/PATCHED]"
                                        }`,
                                        inline: false,
                                    })
                                    .setTimestamp()
                                    .setFooter({
                                        text: `${this.bot.credits}`,
                                        iconURL: `${this.bot.logo}`,
                                    }),
                            ],
                        });
                    });
                }
        }
    }
}
