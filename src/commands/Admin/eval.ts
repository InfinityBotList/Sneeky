import Command from "../commandClass";
import type { ICommandInteraction, ICommandArgs } from "../../typings/types";
import { MessageEmbed } from "discord.js";
import util from "util";

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: "eval",
            usage: "/eval <code> <opts>",
            aliases: [],
            options: [
                {
                    name: "eval",
                    description: "Code to be evaluated",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "options",
                    description: "Eval config/options",
                    choices: [
                        {
                            name: "With Async",
                            value: "true",
                        },
                        {
                            name: "Without Async",
                            value: "false",
                        },
                    ],
                    required: true,
                    type: "STRING",
                },
            ],
            description: "Evaluate some JavaScript code",
            category: "Admin",
            cooldown: 5,
            userPermissions: ["BOT_ADMIN"],
            botPermissions: [],
            subCommands: [],
        });
    }

    async execute(interaction: ICommandInteraction, args: ICommandArgs) {
        let evaled = await args.get("eval").value;
        let options = await interaction.options.get("options")?.value;

        if (options === "true")
            evaled = `(async () => { ${args.get("eval").value.trim()} })()`;

        evaled = await eval(evaled!);

        if (typeof evaled === "object")
            evaled = util.inspect(evaled, { depth: 0, showHidden: true });
        else evaled = String(evaled);

        // @ts-ignore
        if (evaled.includes(this.bot.token))
            evaled = evaled.replace(this.bot.token, "[REDACTED]");

        const fullLen = evaled.length;

        if (fullLen === 0) return null;
        else if (fullLen > 2000) {
            evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];

            if (evaled.length > 3) {
                interaction.channel!.send(`\`\`\`js\n${evaled[0]}\`\`\``);
                interaction.channel!.send(`\`\`\`js\n${evaled[1]}\`\`\``);
                interaction.channel!.send(`\`\`\`js\n${evaled[2]}\`\`\``);
                return;
            }

            return evaled.forEach((message: any) => {
                interaction.reply(`\`\`\`js\n${message}\`\`\``);
                return;
            });
        }

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Evaluation Results")
                    .setColor(this.bot.colors.embed)
                    .setThumbnail(this.bot.logo)
                    .addFields(
                        {
                            name: "📥 Input",
                            value: `${args.get("eval").value}`,
                        },
                        {
                            name: "📤 Output",
                            value: `${evaled}`,
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
