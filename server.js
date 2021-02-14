const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
const app = express();

const authors = [
    {id: 1, name: 'author1'},
    {id: 2, name: 'author2'},
    {id: 3, name: 'author3'}
]

const books = [
    {id: 1, name: 'name1', authorId: 1},
    {id: 2, name: 'name2', authorId: 1},
    {id: 3, name: 'name3', authorId: 1},
    {id: 4, name: 'name4', authorId: 2},
    {id: 5, name: 'name5', authorId: 2},
    {id: 6, name: 'name6', authorId: 2},
    {id: 7, name: 'name7', authorId: 3},
    {id: 8, name: 'name8', authorId: 3}
]

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represent to author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: { 
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represent to book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        authors: { 
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        author: {
            type: AuthorType,
            description: 'A single author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log("Server is running"))