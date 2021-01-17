import { ApolloServer } from 'apollo-server'
import db from './database'
import { buildSchema } from 'type-graphql'
import { verifyToken } from './utils/jwtMethods'

/* Resolvers */
import {
  ClientResolver,
  OrderResolver,
  ProductResolver,
  UserResolver
} from './graphql/resolvers'

async function startServer() {
  await db()
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ClientResolver, UserResolver, OrderResolver, ProductResolver]
    }),
    context: ({ req }) => {
      const accessToken = req.headers.authorization || ''
      const tokenWithoutBearer = accessToken.replace('Bearer ', '')

      try {
        const user = verifyToken(tokenWithoutBearer || '')

        return { user }
      } catch (error) {
        console.error(error.message)
        return error
      }
    }
  })

  return server
}

export default startServer
