import mongoose from "mongoose";

const documentsSchema = new mongoose.Schema({
    filename: {
        required: true,
        type: String
    },
    filepath: {
        required: true,
        type: String
    },
    filesize: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
}
)

export const Documents = mongoose.model("Document", documentsSchema);
