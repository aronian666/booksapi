import mongoose from "mongoose";
import Book from "./Book.js";
const lendSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student"
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Book"
    },
    returnDate: {
        type: Date,
        required: true,
    },
    returnDay: Date,
    status: {
        type: String,
        required: true,
        enum: ["Prestado", "Retrasado", "Devuelto"],
        default: "Prestado"
    },
    message: String
}, { timestamps: true })

lendSchema.pre("save", async function () {
    const book = await Book.findById(this.book._id)
    if (this.status == "Prestado") book.count--
    if (this.status === "Devuelto") book.count++
    book.save()
})
lendSchema.pre("findOneAndUpdate", async function (next) {
    const book = await Book.findById(this._update.book._id)
    if (this._update.status == "Prestado") book.count--
    if (this._update.status === "Devuelto") book.count++
    await book.save()
    next()
})
export default mongoose.model("Lend", lendSchema)