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
    status: {
        type: String,
        required: true,
        enum: ["Prestado", "Retrasado", "Devuelto"],
        default: "Prestado"
    },
    message: String
}, { timestamps: true })

lendSchema.post("save", async function () {
    const book = await Book.findById(this.book)
    if (this.status == "Prestado") book.count--
    if (this.status === "Devuelto") book.count++
    book.save()
})

export default mongoose.model("Lend", lendSchema)