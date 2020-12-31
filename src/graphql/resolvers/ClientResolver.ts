import {
  Arg,
  Args,
  ArgsType,
  Field,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'
import { getMongoRepository } from 'typeorm'
import Client from '../../entity/Client'

@ArgsType()
class createNewClient {
  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field()
  email: string

  @Field()
  password: string
}

@Resolver()
class ClientResolver {
  @Mutation(() => Client)
  async createClient(
    @Args() { email, last_name, first_name, password }: createNewClient
  ) {
    const newClient = getMongoRepository(Client).create({
      updatedAt: new Date(),
      createdAt: new Date(),
      password,
      email,
      first_name,
      last_name
    })

    return await getMongoRepository(Client).save(newClient)
  }

  @Query(() => [Client])
  async getClients() {
    return await getMongoRepository(Client).find()
  }

  @Mutation(() => Client)
  async deleteClientById(@Arg('id') id: string) {
    const deletedUser = await getMongoRepository(Client).findOne(id)

    if (!deletedUser) {
      throw new Error('Client not found')
    }
    await getMongoRepository(Client).delete(deletedUser)

    return deletedUser
  }
}

export default ClientResolver
