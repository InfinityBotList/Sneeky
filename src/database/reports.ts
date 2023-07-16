import mongoose, { Schema, Document, model } from "mongoose";

mongoose.set("strictQuery", false);

interface Reports extends Document {
    type: string;
    title: string;
    repID: string;
    userID: string;
    userName: string;
    message: string;
    active: boolean;
    implemented: boolean;
}

const Reports: Schema = new Schema<Reports>({
    type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    repID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    implemented: {
        type: Boolean,
        default: false,
    },
});

const sneekyReports =
    mongoose.models.sneekyReports || model("sneekyReports", Reports);

export { sneekyReports, Reports };
