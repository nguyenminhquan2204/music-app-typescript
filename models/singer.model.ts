import mongoose from "mongoose";

const singerSchema = new mongoose.Schema(
    {
        fullName: String,
        avatar: String,
        description: String,
        position: Number,
        status: String,
        slug: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    },
    { timestamps: true }
);

const Singer = mongoose.model("Singer", singerSchema, "singers");

export default Singer;