import mongoose from "mongoose";
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })
authorSchema.pre('save', function (next) {
    this.name = this.name[0].toUpperCase() + this.name.slice(1, this.name.length)
    next()
})

export default mongoose.model("Author", authorSchema)