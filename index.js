import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose'
import resolvers from './resolvers/index.js';


const typeDefs = `
    type Author {
        _id: ID!
        name: String!
        books: BookSearch
        createdAt: String
        updatedAt: String
    }
    type Book {
        _id: ID!
        name: String!
        author: Author!
        count: Int!
        category: Category!
        status: String!
        lends: LendSearch
        createdAt: String
        updatedAt: String
    }
    type Category {
        _id: ID!
        name: String!
        books: BookSearch
        createdAt: String
        updatedAt: String
    }
    type Lend {
        _id: ID
        student: Student!
        book: Book!
        returnDate: String
        status: String!
        message: String
        createdAt: String
        updatedAt: String
    }
    type Student {
        _id: ID!
        name: String!
        last: String!
        grade: Int!
        nivel: Int!
        lends: LendSearch
        createdAt: String
        updatedAt: String
    }
    type BookSearch {
        results: [Book]
        count: Int!
    }
    type CategorySearch {
        results: [Category]
        count: Int!
    }
    type AuthorSearch {
        results: [Author]
        count: Int!
    }
    type StudentSearch {
        results: [Student]
        count: Int!
    }
    type LendSearch {
        results: [Lend]
        count: Int!
    }
    type Query {
        books(filter: Filter, exact: [Exact]): BookSearch
        book(_id: ID!): Book
        authors(filter: Filter, exact: [Exact]): AuthorSearch
        author(_id: ID!): Author
        categorys(filter: Filter, exact: [Exact]): CategorySearch
        category(_id: ID!): Category
        students(filter: Filter, exact: [Exact]): StudentSearch
        student(_id:ID!): Student
        lends(filter: Filter, exact: [Exact]): LendSearch
        lend(_id: ID!): Lend
    }

    input Exact {
        name: String
        value: String
    }
    input Filter {
        search: String
        page: Int
        sort: String
        asc: Int
        limit: Int
    }
    type Mutation {
        createBook(book: BookInput!): Book
        deleteBook(_id: ID!): ID
        createAuthor(author: AuthorInput!): Author
        deleteAuthor(_id: ID!): ID
        createCategory(category: CategoryInput!): Category
        deleteCategory(_id: ID!): ID
        createStudent(student: StudentInput!): Student
        deleteStudent(_id: ID!): ID
        createLend(lend: LendInput!): Lend
        deleteLend(_id: ID!): ID
    }
    input BookInput {
        _id: ID
        name: String
        category: ID
        author: ID
        count: Int
    }
    input AuthorInput {
        _id: ID
        name: String
    }
    input CategoryInput {
        _id: ID
        name: String
    }
    input StudentInput {
        _id: ID
        name: String
        last: String
        grade: Int
        nivel: Int
    }
    input LendInput {
        _id: ID
        book: ID
        student: ID
        returnDate: String
        message: String
        status: String
    }
`
const server = new ApolloServer({ typeDefs, resolvers })
mongoose.connect("mongodb+srv://aronian666:miqevid21@cluster0.h2xqh.mongodb.net/books?retryWrites=true&w=majority").then((db) => {
    console.log("connect to db")
    startStandaloneServer(server).then(reponse => console.log("ready at: ", reponse.url))
})
