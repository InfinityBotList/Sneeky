import Command from "../commandClass";
import { MessageEmbed } from "discord.js";
import type { ICommandInteraction } from "../../typings/types";
import { sneekyProfile } from "../../database/profile";
const { findProfile } = require("../../structures/utils");
const { randomErrors, fetchRandomErrorMsg } = require("../../structures/utils");

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: "monthly",
            usage: "/monthly",
            aliases: [],
            options: [],
            description: "Claim your monthly prize",
            category: "Economy",
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }
    async execute(interaction: ICommandInteraction) {
        if (await randomErrors(interaction.user.id)) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("ERROR: Unknown Error")
                        .setColor(this.bot.colors.red)
                        .setThumbnail(this.bot.logo)
                        .setDescription(`${await fetchRandomErrorMsg()}`)
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`,
                        }),
                ],
            });
        }

        const profile = await findProfile(interaction.user, interaction.guild!);

        if (!profile)
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("ERROR: No Profile")
                        .setThumbnail(this.bot.logo)
                        .setColor(this.bot.colors.red)
                        .setDescription(
                            "Hold up chief, you do not have a economy profile. You can create one using the `/profile create` command"
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`,
                        }),
                ],
            });
        else if (!profile.lastMonthly) {
            await sneekyProfile.updateOne(
                {
                    userId: interaction.user.id,
                    guildId: interaction.guild!.id,
                },
                {
                    $set: { lastMonthly: Date.now() },
                }
            );

            await sneekyProfile.updateOne(
                {
                    userId: interaction.user.id,
                    guildId: interaction.guild!.id,
                },
                {
                    $inc: { wallet: 500 },
                }
            );

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Monthly Rewards")
                        .setColor(this.bot.colors.embed)
                        .setThumbnail(this.bot.logo)
                        .setDescription(
                            "You have collected your monthly earnings of `$500`. Come back next month for more"
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`,
                        }),
                ],
            });
        } else if (Date.now() - profile.lastMonthly > 2592000000) {
            await sneekyProfile.updateOne(
                {
                    userId: interaction.user.id,
                    guildId: interaction.guild!.id,
                },
                {
                    $set: { lastMonthly: Date.now() },
                }
            );

            await sneekyProfile.updateOne(
                {
                    userId: interaction.user.id,
                    guildId: interaction.guild!.id,
                },
                {
                    $inc: { wallet: 500 },
                }
            );

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Monthly Rewards")
                        .setColor(this.bot.colors.embed)
                        .setThumbnail(this.bot.logo)
                        .setDescription(
                            "You have collected your monthly earnings of `$500`. Come back next month for more"
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `${this.bot.credits}`,
                            iconURL: `${this.bot.logo}`,
                        }),
                ],
            });
        } else {
            const lastMonthly = new Date(profile.lastMonthly);
            const timeLeft = Math.round(
                (lastMonthly.getTime() + 2592000000 - Date.now()) / 1000
            );
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft - hours * 3600) / 60);
            const seconds = timeLeft - hours * 3600 - minutes * 60;

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("ERROR: Monthly Claimed")
                        .setColor(this.bot.colors.red)
                        .setThumbnail(this.bot.logo)
                        .setDescription(
                            "You have already claimed your monthly earnings."
                        )
                        .addFields(
                            {
                                name: "Retry In",
                                value: `${hours}h ${minutes}m ${seconds}s`,
                            },
                            {
                                name: "Retry Date",
                                value: `${new Date(Date.now() + 2592000000)}`,
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
    }
}
