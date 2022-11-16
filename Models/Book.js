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
        ref: "Category"
    },
    editorial: {
        type: mongoose.Schema.Types.ObjectId,
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
    position: {
        type: Number,
        default: 1
    },
    isbn: String,
    image: String
}, { timestamps: true })

bookSchema.pre('save', async function (next) {
    if (this.count <= 0) this.status = "Agotado"
    else this.status = "Disponible"
    next()
})
bookSchema.pre("findOneAndUpdate", function (next) {
    if (this._update.count <= 0) this._update.status = "Agotado"
    if (this._update.count > 0) this._update.status = "Disponible"
    next()
})


export default mongoose.model("Book", bookSchema)

