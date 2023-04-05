import { sneekyProfile } from '../database/profile'

module.exports = {
    createProfile: async function createProfile(user: any, guild: any) {
        let profile = await sneekyProfile.findOne({ userId: user.id, guildId: guild.id })

        if (!profile) {
            profile = await sneekyProfile.create({
                guildId: guild.id,
                userId: user.id,
                wallet: 0,
                bank: 0,
                lastDaily: new Date(),
                lastWeekly: new Date(),
                lastMonthly: new Date()
            })

            await profile.save()

            return true
        } else {
            return false
        }
    }
}
