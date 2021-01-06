import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'
import { ObjectID } from 'mongodb'
import { Client } from '../../entity'
import { Payload } from '../../utils/jwtMethods'

@InputType()
class CreateClientFields {
  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field()
  company: string

  @Field()
  email: string

  @Field({ nullable: true })
  phone_number: number
}

@Resolver()
class ClientResolver {
  @Query(() => [Client])
  async getClientsByUser(@Ctx('user') user: Payload): Promise<Client[]> {
    if (!user) throw new Error('Token invalid')
    const id = new ObjectID(user.id)
    return await Client.find({ where: { seller: id } })
  }

  @Query(() => [Client])
  async getClients(@Ctx('user') user: Payload): Promise<Client[]> {
    if (!user) throw new Error('Token invalid')

    return await Client.find({})
  }

  @Mutation(() => Client)
  async createClient(
    @Arg('input') input: CreateClientFields,
    @Ctx('user') user: Payload
  ): Promise<Client> {
    if (!user) throw new Error('Token invalid')

    const { company, email, first_name, last_name, phone_number } = input

    return Client.create({
      company,
      email,
      first_name,
      last_name,
      phone_number,
      createdAt: new Date(),
      seller: new ObjectID(user.id)
    })
      .save()
      .then((client) => client)
      .catch((err) => {
        console.error(err.message)
        return err
      })
  }
}

export default ClientResolver
