//const snekfetch = require('snekfetch');
import fetch from "node-fetch";
import Command from "../commandClass";
import type { ICommandInteraction } from "../../typings/types";
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    TextChannel,
} from "discord.js";

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: "meme",
            usage: "/meme",
            aliases: [],
            options: [
                {
                    name: "category",
                    description: "The category to fetch",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "Cat Memes",
                            value: "catmemes.json",
                        },
                        {
                            name: "Dev Memes",
                            value: "devmemes.json",
                        },
                        {
                            name: "Dank Memes",
                            value: "dankmemes.json",
                        },
                        {
                            name: "Discord Memes",
                            value: "discordmemes.json",
                        },
                        {
                            name: "Dog Memes",
                            value: "dogmemes.json",
                        },
                        {
                            name: "Funny Memes",
                            value: "funnymemes.json",
                        },
                        {
                            name: "Gaming Memes",
                            value: "gamingmemes.json",
                        },
                    ],
                },
                {
                    name: "sort",
                    description: "Sort by",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "Top Posts",
                            value: "?sort=top",
                        },
                        {
                            name: "New Posts",
                            value: "?sort=new",
                        },
                    ],
                },
                {
                    name: "limit",
                    description: "Amount of memes to fetch",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "1 (Recommend)",
                            value: "?limit=1",
                        },
                        {
                            name: "2 (Buggy)",
                            value: "?limit=2",
                        },
                        {
                            name: "3 (Buggy)",
                            value: "?limit=3",
                        },
                        {
                            name: "4 (Buggy)",
                            value: "?limit=4",
                        },
                        {
                            name: "5 (Buggy)",
                            value: "?limit=5",
                        },
                    ],
                },
            ],
            description: "Send a random meme",
            category: "Fun",
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }

    async execute(interaction: ICommandInteraction) {
        const category = await interaction.options.get("category")?.value;
        const limit = await interaction.options.get("limit")?.value;
        const sort = await interaction.options.get("sort")?.value;

        let resolved: string = `${category}`;

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Meme Generator")
                    .setColor(this.bot.colors.embed)
                    .setThumbnail(this.bot.logo)
                    .setDescription(
                        "Hey there chief! use the button below to start generating your memes"
                    )
                    .addFields({
                        name: "Selected Category",
                        value: `${resolved
                            .replace("?", "")
                            .toUpperCase()
                            .replace(".JSON", "")}`,
                        inline: false,
                    })
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
                        .setCustomId("close-memes"),
                    new MessageButton()
                        .setLabel("Generate Meme")
                        .setStyle("PRIMARY")
                        .setCustomId("generate-meme"),
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
            if (i.customId === "generate-meme") {
                const meme = await fetch(
                    `https://reddit.com/r/${category}${sort}&t=week${limit}`
                ).then((r) => r.json());

                let nsfwCheck;
                let chan = this.bot.util.resolveChannel(
                    interaction.guild!,
                    `${interaction.channel}`
                );

                if (chan.type === "GUILD_TEXT") {
                    if ((chan as TextChannel).nsfw) {
                        nsfwCheck = true;
                    } else {
                        nsfwCheck = false;
                    }
                }

                const safeContent = nsfwCheck
                    ? meme.data.children
                    : meme.data.children.filter(
                          (post: any) => !post.data.over_18
                      );

                if (!safeContent.length || !safeContent) {
                    return i.update({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("ERROR: Out of Memes")
                                .setColor(this.bot.colors.red)
                                .setThumbnail(this.bot.logo)
                                .setDescription(
                                    "Whoops, we are all out of fresh memes for you! check back later"
                                )
                                .setTimestamp()
                                .setFooter({
                                    text: `${this.bot.credits}`,
                                    iconURL: `${this.bot.logo}`,
                                }),
                        ],
                    });
                }

                const randomMeme = Math.floor(
                    Math.random() * safeContent.length
                );

                return i.update({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`${safeContent[randomMeme].data.title}`)
                            .setColor(this.bot.colors.embed)
                            .setThumbnail(this.bot.logo)
                            .setImage(safeContent[randomMeme].data.url)
                            .setURL(
                                `https://reddit.com/${safeContent[randomMeme].data.subreddit_name_prefixed}`
                            )
                            .addFields(
                                {
                                    name: "Author",
                                    value: `👨‍💻 ${
                                        "`" +
                                        safeContent[randomMeme].data.author +
                                        "`"
                                    }`,
                                    inline: true,
                                },
                                {
                                    name: "Upvotes",
                                    value: ` 👍 ${
                                        "`" +
                                        safeContent[randomMeme].data.ups +
                                        "`"
                                    }`,
                                    inline: true,
                                },
                                {
                                    name: "Comments",
                                    value: `💬 ${
                                        "`" +
                                        safeContent[randomMeme].data
                                            .num_comments +
                                        "`"
                                    }`,
                                    inline: true,
                                }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `${this.bot.credits}`,
                                iconURL: `${this.bot.logo}`,
                            }),
                    ],
                });
            } else if (i.customId === "close-memes") {
                await i.update({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Closing Meme Generator")
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
            }
        });
    }
}
