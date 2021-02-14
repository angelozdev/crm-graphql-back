import config from 'config'
import 'reflect-metadata'
import server from './app'

async function main() {
  const app = await server()

  app.listen({ port: config.setup.port || 4000 }).then(({ url }) => {
    console.clear()
    console.log(`Server ready at ${url}`)
  })
}

main()
