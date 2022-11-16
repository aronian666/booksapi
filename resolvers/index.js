import Author from "../Models/Author.js"
import Book from "../Models/Book.js"
import Category from "../Models/Category.js"
import Lend from "../Models/Lend.js"
import Student from "../Models/Student.js"
import Editorial from "../Models/Editorial.js"
import { assingResolvers } from "../Models/Methods.js"

const { mutations, querys } = assingResolvers(Author, Book, Category, Lend, Student, Editorial)
const resolvers = {
    Query: querys,
    Mutation: {
        ...mutations,
        async createByIsbn(_, { book }) {
            const newBook = await Book.findOne({ isbn: book.isbn })
            if (newBook) {
                newBook.count += book.count
                return await newBook.save()
            }
            if (!book.author._id) {
                const regExp = new RegExp(book.author.name, "i")
                let author = await Author.findOne({ name: regExp })
                if (!author) author = await Author.create({ name: book.author.name })
                book.author = author
            }
            if (!book.category._id) {
                const regExp = new RegExp(book.category.name, "i")
                let category = await Category.findOne({ name: regExp })
                if (!category) category = await Category.create({ name: book.category.name })
                book.category = category
            }
            if (!book.editorial._id) {
                const regExp = new RegExp(book.editorial.name, "i")
                let editorial = await Editorial.findOne({ name: regExp })
                if (!editorial) editorial = await Editorial.create({ name: book.editorial.name })
                book.editorial = editorial
            }
            return await Book.create(book)
        }
    }
}
export default resolvers