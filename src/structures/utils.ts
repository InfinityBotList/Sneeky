const glob = require('glob');
const { promisify } = require('util');
import { sneekyProfile } from "../database/profile"
import { MessageActionRow, MessageButton } from "discord.js";
import Configuration from '../configuration/bot.config';
import Onboarding from '../configuration/ibl.config';

module.exports = {
  // @ts-ignore
  getRandomString: length => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  },
  search: promisify(glob),
  sleep: promisify(setTimeout),
  // @ts-ignore
  pretty: str => str[0].toUpperCase() + str.slice(1).toLowerCase(),
  // @ts-ignore
  plural: num => (num === 1 ? '' : 's'),
  confirm: async (interaction:any, embed: any) => {
    const msg = await interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton().setCustomId('proceed').setStyle('SUCCESS').setLabel('Proceed'),
          new MessageButton().setCustomId('cancel').setStyle('DANGER').setLabel('Cancel')
        )
      ],
      fetchReply: true
    });

    const i = await msg
    // @ts-ignore
      .awaitMessageComponent({ time: 1000 * 60, filter: i => i.user.id === interaction.user.id })
      .catch(() => null);
    if (!i)
      return {
        proceed: false,
        reason: 'Reason: Inactivity Timeout',
        i
      };

    if (i.customId === 'proceed')
      return {
        proceed: true,
        i
      };
    return {
      proceed: false,
      i
    };
  },
    /**
     * CREATE A USERS ECONOMY PROFILE
     * @param user The user object
     * @param guild The guild object
     * @returns 
     */
    createProfile: async function createProfile(user: any, guild: any) {

        let profile = await sneekyProfile.findOne({ userId:  user.id, guildId: guild.id });

        if (!profile) {
            
        profile = await sneekyProfile.create({
            guildId: guild.id,
            userId: user.id,
            wallet: 0,
            bank: 0
        })

        await profile.save();

        return true;

    } else {

        return false;
    }
  },
  /**
   * FIND A USERS ECONOMY PROFILE
   * @param user The user object
   * @param guild The guild object
   */
  findProfile: async function findProfile(user: any, guild: any) {
    let profile = await sneekyProfile.findOne({ userId: user.id, guildId: guild.id})
    if (!profile) return false;
    else return profile;
  },
  filterCommands: async function filterCommands(client: any, cat: any) {

    let cmds = client.commands.filter((cmd: any) => cmd.category === cat);
    let resultss = await cmds.map((cmd: any) => cmd.name).join(" , ");

    return resultss;
  },
  randomErrors: async function randomErrors(user: any) {

    const paginate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const res = (paginate[Math.floor(Math.random() * paginate.length)])

    if (res < 4 && !Configuration.ADMINS.includes(user) && Onboarding.SETTINGS.RANDOM_ERR) return true
    else return false
  },
  fetchRandomErrorMsg: async function fetchRandomErrorMsg() {

    const messages = [
      "Whoops something went wrong here but i can\'t seem to figure out what!",
      "MongoCollectionError: `messageloggerpro` not found in `interactionCreate.ts:40:31`",
      "Error: `Unable to determine executable path to base configuration`",
      "MongoError: `failed with error 13: not authorized for connection`",
      "Discord.js: `Failed to execute interaction with reason: undefined`"
    ]

    const res = (messages[Math.floor(Math.random() * messages.length)]);

    return res;
  },
  shuffleArray: function (array: any) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
}