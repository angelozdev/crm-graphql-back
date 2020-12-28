import { ApolloServer } from 'apollo-server'
import Resolvers from './graphql/resolvers'
import typeDefs from './graphql/schema'
import { buildSchema } from 'type-graphql'

/* Server */

async function startServer() {
  const server = new ApolloServer({
    schema: await buildSchema({ resolvers: [Resolvers] })
  })

  return server
}

export default startServer
