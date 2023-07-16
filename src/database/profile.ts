import mongoose, { Schema, Document, model } from "mongoose";

mongoose.set("strictQuery", false);

interface Profile extends Document {
    guildId: String;
    userId: String;
    wallet: Number;
    bank: Number;
    lastDaily: Date;
    lastWeekly: Date;
    lastMonthly: Date;
}

const Profile: Schema = new Schema<Profile>({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    wallet: {
        type: Number,
        required: true,
    },
    bank: {
        type: Number,
        required: true,
    },
    lastDaily: {
        type: Date,
        required: false,
    },
    lastWeekly: {
        type: Date,
        required: false,
    },
    lastMonthly: {
        type: Date,
        required: false,
    },
});

const sneekyProfile =
    mongoose.models.sneekyProfile || model("sneekyProfile", Profile);

export { sneekyProfile, Profile };
