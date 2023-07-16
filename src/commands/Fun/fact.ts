import Command from "../commandClass";
import type { ICommandInteraction } from "../../typings/types";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import fetch from "node-fetch";

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: "fact",
            usage: "/fact",
            aliases: [],
            options: [],
            description: "Fetch a rather useless fact",
            category: "Fun",
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }

    async execute(interaction: ICommandInteraction) {
        const fact = await fetch(
            "https://uselessfacts.jsph.pl/random.json?language=en"
        ).then((r) => r.json());

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Useless Fact")
                    .setURL(fact.source_url)
                    .setColor(this.bot.colors.embed)
                    .setThumbnail(this.bot.logo)
                    .setDescription(fact.text)
                    .setTimestamp()
                    .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`,
                    }),
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setLabel("Close Generator")
                        .setStyle("DANGER")
                        .setCustomId("close-facts"),
                    new MessageButton()
                        .setLabel("Generate Fact")
                        .setStyle("PRIMARY")
                        .setCustomId("generate-fact"),
                ]),
            ],
            fetchReply: true,
        });

        const collector =
            await interaction.channel!.createMessageComponentCollector({
                filter: (fn: any) => fn,
                componentType: "BUTTON",
            });

        collector.on("collect", async (i: any) => {
            if (i.customId === "generate-fact") {
                const fact2 = await fetch(
                    "https://uselessfacts.jsph.pl/random.json?language=en"
                ).then((r) => r.json());

                return i.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Useless Fact")
                            .setURL(fact2.source_url)
                            .setColor(this.bot.colors.embed)
                            .setThumbnail(this.bot.logo)
                            .setDescription(fact2.text)
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`,
                            }),
                    ],
                });
            } else if (i.customId === "close-facts") {
                await i.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Closing Fact Generator")
                            .setColor(this.bot.colors.red)
                            .setThumbnail(
                                "https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif"
                            )
                            .setDescription("This may take a few seconds")
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`,
                            }),
                    ],
                });

                setTimeout(async () => {
                    await i.deleteReply();
                }, 3000);

                return interaction.deleteReply();
            }
        });
    }
}
