import Command from "../commandClass";
import type { ICommandInteraction } from "../../typings/types";
import { MessageEmbed } from "discord.js";
const translate = require("@iamtraction/google-translate");

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: "translate",
            usage: "/translate <input> <output>",
            aliases: [],
            options: [
                {
                    name: "input",
                    description: "Provide a string of text",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "input_lang",
                    description: "Select input language (Default: Auto-Detect)",
                    required: false,
                    type: "STRING",
                    choices: [
                        {
                            name: "Auto-Detect",
                            value: "auto",
                        },
                        {
                            name: "English",
                            value: "en",
                        },
                        {
                            name: "Mandarin Chinese",
                            value: "zh-cn",
                        },
                        {
                            name: "Spanish",
                            value: "es",
                        },
                        {
                            name: "Hindi",
                            value: "hi",
                        },
                        {
                            name: "Arabic",
                            value: "ar",
                        },
                        {
                            name: "Malay",
                            value: "ms",
                        },
                        {
                            name: "Russian",
                            value: "ru",
                        },
                        {
                            name: "Bengali",
                            value: "bn",
                        },
                        {
                            name: "Portuguese",
                            value: "pt",
                        },
                        {
                            name: "French",
                            value: "fr",
                        },
                        {
                            name: "Hausa",
                            value: "ha",
                        },
                        {
                            name: "Punjabi",
                            value: "pa",
                        },
                        {
                            name: "German",
                            value: "de",
                        },
                        {
                            name: "Japanese",
                            value: "ja",
                        },
                        {
                            name: "Persian",
                            value: "fa",
                        },
                        {
                            name: "Swahili",
                            value: "sw",
                        },
                        {
                            name: "Vietnamese",
                            value: "vi",
                        },
                        {
                            name: "Telugu",
                            value: "te",
                        },
                        {
                            name: "Italian",
                            value: "it",
                        },
                        {
                            name: "Javanese",
                            value: "jw",
                        },
                        {
                            name: "Chinese Traditional",
                            value: "zh-tw",
                        },
                        {
                            name: "Korean",
                            value: "ko",
                        },
                        {
                            name: "Tamil",
                            value: "ta",
                        },
                        {
                            name: "Marathi",
                            value: "mr",
                        },
                    ],
                },
                {
                    name: "output_lang",
                    description: "Select output language (Default: English)",
                    required: false,
                    type: "STRING",
                    choices: [
                        {
                            name: "English",
                            value: "en",
                        },
                        {
                            name: "Mandarin Chinese",
                            value: "zh-cn",
                        },
                        {
                            name: "Spanish",
                            value: "es",
                        },
                        {
                            name: "Hindi",
                            value: "hi",
                        },
                        {
                            name: "Arabic",
                            value: "ar",
                        },
                        {
                            name: "Malay",
                            value: "ms",
                        },
                        {
                            name: "Russian",
                            value: "ru",
                        },
                        {
                            name: "Bengali",
                            value: "bn",
                        },
                        {
                            name: "Portuguese",
                            value: "pt",
                        },
                        {
                            name: "French",
                            value: "fr",
                        },
                        {
                            name: "Hausa",
                            value: "ha",
                        },
                        {
                            name: "Punjabi",
                            value: "pa",
                        },
                        {
                            name: "German",
                            value: "de",
                        },
                        {
                            name: "Japanese",
                            value: "ja",
                        },
                        {
                            name: "Persian",
                            value: "fa",
                        },
                        {
                            name: "Swahili",
                            value: "sw",
                        },
                        {
                            name: "Vietnamese",
                            value: "vi",
                        },
                        {
                            name: "Telugu",
                            value: "te",
                        },
                        {
                            name: "Italian",
                            value: "it",
                        },
                        {
                            name: "Javanese",
                            value: "jw",
                        },
                        {
                            name: "Chinese Traditional",
                            value: "zh-tw",
                        },
                        {
                            name: "Korean",
                            value: "ko",
                        },
                        {
                            name: "Tamil",
                            value: "ta",
                        },
                        {
                            name: "Marathi",
                            value: "mr",
                        },
                        {
                            name: "Urdu",
                            value: "ur",
                        },
                    ],
                },
            ],
            description: "Search Urban Dictionary for the definition of a word",
            category: "Utility",
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }

    async execute(interaction: ICommandInteraction) {
        const input = await interaction.options.getString("input");
        const from =
            (await interaction.options.get("input_lang")?.value) || "auto";
        const to =
            (await interaction.options.get("output_lang")?.value) || "en";

        translate(input, { from: from, to: to }).then((res: any) => {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Translation Results")
                        .setColor(this.bot.colors.red)
                        .setThumbnail(this.bot.logo)
                        .setDescription(`From: ${from} ➜ To: ${to}`)
                        .addFields(
                            {
                                name: "📥 Input",
                                value: `${input}`,
                                inline: false,
                            },
                            {
                                name: "📤 Output",
                                value: `${res.text}`,
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
    }
}
