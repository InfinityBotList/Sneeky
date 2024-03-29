import Command from '../commandClass'
import type { ICommandInteraction, ICommandArgs } from '../../typings/types'
import { exec } from 'child_process'

export default class extends Command {
    constructor(bot: any) {
        super(bot, {
            name: 'exec',
            usage: '/exec <command>',
            aliases: [],
            options: [
                {
                    name: 'command',
                    description: 'Command to be executed',
                    required: true,
                    type: 'STRING'
                }
            ],
            description: 'Execute a command',
            category: 'Admin',
            cooldown: 5,
            userPermissions: ['BOT_ADMIN'],
            botPermissions: [],
            subCommands: []
        })
    }

    async execute(interaction: ICommandInteraction, args: ICommandArgs) {
        const outputErr = (msg: ICommandInteraction, stdData: any) => {
            const { stdout, stderr } = stdData
            const message = stdout.concat(`\`\`\`${stderr}\`\`\``)

            msg.editReply(message)
        }

        const doExec = (cmd: string, opts = {}): Promise<any> => {
            return new Promise((resolve, reject) => {
                exec(cmd, opts, (err, stdout, stderr) => {
                    if (err) return reject({ stdout, stderr })

                    resolve(stdout)
                })
            })
        }

        const command = await args.get('command').value

        await interaction.reply(`Executing: \`${command}\`...`)

        let stdOut = await doExec(command).catch(data => outputErr(interaction, data))

        return interaction.editReply(`\`\`\`bash\n${stdOut.toString()}\n\`\`\``)
    }
}
