require('dotenv').config();

export default {
    LOGO: `${process.env.LOGO}`,
    PREFIX: '//',
    CREDITS: '© 2023 Toxic Dev',
    DATABASE: `${process.env.DATABASE}`,
    DOMAINS: {
        INFINITY: `${process.env.WEBSITE}`,
        SPIDER: `${process.env.SPIDER}`,
        INVITE: `${process.env.INVITE}`
    },
    DEFAULTS: {
        PREFIX: '//',
        GUILDNAME: 'No Name',
        LOGCHANNELS: 'bot-logs',
        INVITATIONS: false
    },
    ADMINS: [
        //"510065483693817867",
        "896951964234043413",
        "728871946456137770",
        "691648449967554590",
        "725104609689075745"
    ],
    COLORS: {
        embed: '#F91F5B',
        embed2: '#9912D9',
        red: '#ff0000',
        orange: '#FFA500',
        green: '#00FF00',
        ecm: '#ED6B40',
        inm: '#9B1B1E'
    },
    TOKENS: {
        DISCORD: `${process.env.TOKEN}`,
        INFINITY: ''
    },
    CHANNELS: {
        REPORTS: '1092343797582667826',
        LOGS: `${process.env.LOGS}`
    }
}