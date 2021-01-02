import { ApolloServer } from 'apollo-server'
import db from './database'
import { buildSchema } from 'type-graphql'

/* Resolvers */
import { UserResolver, ProductResolver } from './graphql/resolvers'

async function startServer() {
  await db()
  const server = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver, ProductResolver] }),
    context: () => {
      return { user: { name: 'angelo', age: 23 } }
    }
  })

  return server
}

export default startServer
