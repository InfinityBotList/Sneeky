import mongoose, { Schema, Document, model } from 'mongoose'

mongoose.set('strictQuery', false)

interface UserJobs extends Document {
    title: String
    company: String
    userId: String
    guildId: String
}

const UserJobs: Schema = new Schema<UserJobs>({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

const sneekyJobs = mongoose.models.sneekyJobs || model('sneekyJobs', UserJobs)

export { sneekyJobs, UserJobs }
