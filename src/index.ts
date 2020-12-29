import 'reflect-metadata'
import server from './app'

async function main() {
  const app = await server()

  app.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}

main()
