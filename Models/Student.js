import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true,
        default: 1
    },
    nivel: {
        type: String,
        required: true,
        enum: ["Primaria", "Secundaria"],
        default: "Primaria"
    }
}, { timestamps: true })

studentSchema.pre('save', function (next) {
    this.name = this.name[0].toUpperCase() + this.name.slice(1, this.name.length)
    this.last = this.last[0].toUpperCase() + this.last.slice(1, this.last.length)
    next()
})
export default mongoose.model("Student", studentSchema)