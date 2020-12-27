import { ApolloServer, gql } from 'apollo-server'

/* Server */
const server = new ApolloServer({ typeDefs: ``, resolvers: {} })

/* Correr el servidor */
server.listen().then(({ url }) => {
  console.log(`Server ready at http:localhost:${url}`)
})
