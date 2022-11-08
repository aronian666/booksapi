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
    Mutation: mutations
}
export default resolvers