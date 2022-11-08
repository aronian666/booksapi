import mongoose from "mongoose";
const editorialSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: ""
    }
}, { timestamps: true })

export default mongoose.model("Editorial", editorialSchema)