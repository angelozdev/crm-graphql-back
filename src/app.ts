import { ApolloServer } from 'apollo-server'
import Resolvers from './graphql/resolvers'
import db from './database'
import { buildSchema } from 'type-graphql'

/* Server */

async function startServer() {
  await db()
  const server = new ApolloServer({
    schema: await buildSchema({ resolvers: [Resolvers] }),
    context: () => {
      return { user: { name: 'angelo', age: 23 } }
    }
  })

  return server
}

export default startServer
