import { ApolloServer } from 'apollo-server'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/schema'

/* Server */
const server = new ApolloServer({ typeDefs, resolvers })

/* Correr el servidor */
server.listen().then(({ url }) => {
  console.log(`Server ready at http:localhost:${url}`)
})
