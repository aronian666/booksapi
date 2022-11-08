import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    released: Date,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    editorial: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Editorial"
    },
    status: {
        type: String,
        required: true,
        enum: ["Disponible", "Agotado"],
        default: "Disponible"
    },
    count: {
        type: Number,
        required: true,
        default: 1
    },
}, { timestamps: true })

bookSchema.pre('save', function (next) {
    this.name = this.name[0].toUpperCase() + this.name.slice(1, this.name.length)
    if (this.count <= 0) this.status = "Agotado"
    else this.status = "Disponible"
    next()
})
bookSchema.pre("findOneAndUpdate", function (next) {
    if (this._update.name) this._update.name = this._update.name[0].toUpperCase() + this._update.name.slice(1, this._update.name.length)
    if (this._update.count <= 0) this._update.status = "Agotado"
    else this._update.status = "Disponible"
    next()
})


export default mongoose.model("Book", bookSchema)

