import Command from "../commandClass";
import type { ICommandInteraction } from "../../typings/types";
import { MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: "advancement",
            usage: "/advancement <opts>",
            aliases: [],
            options: [
                {
                    name: "text",
                    description: "Provide an advancement text.",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "object",
                    type: "STRING",
                    description: "Select what object you want to be displayed",
                    required: true,
                    choices: [
                        {
                            name: "Stone Block",
                            value: "stone",
                        },
                        {
                            name: "Grass Block",
                            value: "grass",
                        },
                        {
                            name: "Crafting Table",
                            value: "craftingtable",
                        },
                        {
                            name: "Furnace",
                            value: "furnace",
                        },
                        {
                            name: "Coal",
                            value: "coal",
                        },
                        {
                            name: "Iron Ingot",
                            value: "iron",
                        },
                        {
                            name: "Gold Ingot",
                            value: "gold",
                        },
                        {
                            name: "Diamond",
                            value: "diamond",
                        },
                        {
                            name: "Redstone Dust",
                            value: "redstone",
                        },
                        {
                            name: "Diamond Sword",
                            value: "diamond-sword",
                        },
                        {
                            name: "TNT",
                            value: "tnt",
                        },
                        {
                            name: "Cookie",
                            value: "cookie",
                        },
                        {
                            name: "Cake",
                            value: "cake",
                        },
                        {
                            name: "Creeper Head",
                            value: "creeper",
                        },
                        {
                            name: "Pig Head",
                            value: "pig",
                        },
                        {
                            name: "Heart",
                            value: "heart",
                        },
                    ],
                },
            ],
            description: "Create a custom minecraft advancement text",
            category: "Images",
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }

    async execute(interaction: ICommandInteraction) {
        const text = await interaction.options
            .getString("text")
            ?.split(" ")
            .join("+");
        const object = await interaction.options.get("object")?.value;

        let link;

        if (object === "stone")
            link = `https://minecraftskinstealer.com/achievement/20/Advancement+Made!/${text}`;
        else if (object === "grass")
            link = `https://minecraftskinstealer.com/achievement/1/Advancement+Made!/${text}`;
        else if (object === "craftingtable")
            link = `https://minecraftskinstealer.com/achievement/13/Advancement+Made!/${text}`;
        else if (object === "furnace")
            link = `https://minecraftskinstealer.com/achievement/18/Advancement+Made!/${text}`;
        else if (object === "coal")
            link = `https://minecraftskinstealer.com/achievement/31/Advancement+Made!/${text}`;
        else if (object === "iron")
            link = `https://minecraftskinstealer.com/achievement/22/Advancement+Made!/${text}`;
        else if (object === "gold")
            link = `https://minecraftskinstealer.com/achievement/23/Advancement+Made!/${text}`;
        else if (object === "diamond")
            link = `https://minecraftskinstealer.com/achievement/2/Advancement+Made!/${text}`;
        else if (object === "redstone")
            link = `https://minecraftskinstealer.com/achievement/14/Advancement+Made!/${text}`;
        else if (object === "diamond-sword")
            link = `https://minecraftskinstealer.com/achievement/3/Advancement+Made!/${text}`;
        else if (object === "tnt")
            link = `https://minecraftskinstealer.com/achievement/6/Advancement+Made!/${text}`;
        else if (object === "cookie")
            link = `https://minecraftskinstealer.com/achievement/7/Advancement+Made!/${text}`;
        else if (object === "cake")
            link = `https://minecraftskinstealer.com/achievement/10/Advancement+Made!/${text}`;
        else if (object === "creeper")
            link = `https://minecraftskinstealer.com/achievement/4/Advancement+Made!/${text}`;
        else if (object === "pig")
            link = `https://minecraftskinstealer.com/achievement/5/Advancement+Made!/${text}`;
        else if (object === "heart")
            link = `https://minecraftskinstealer.com/achievement/8/Advancement+Made!/${text}`;

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Your Advancement")
                    .setColor(this.bot.colors.embed)
                    .setImage(`${link}`)
                    .setTimestamp()
                    .setFooter({
                        text: `${this.bot.credits}`,
                        iconURL: `${this.bot.logo}`,
                    }),
            ],
        });
    }
}
