import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'
import { ObjectID } from 'mongodb'
import { ClientTypes, Client } from '../../models'
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

  @Field(() => Int, { nullable: true })
  phone_number: number
}

@Resolver()
class ClientResolver {
  @Query(() => [ClientTypes])
  async getClientsByUser(@Ctx('user') user: Payload): Promise<ClientTypes[]> {
    if (!user) throw new Error('Token invalid')
    const id = user.id

    return new Promise((resolve, reject) => {
      Client.find({ sellerId: id })
        .populate('sellerId')
        .exec((err, docs) => {
          if (err) return reject(err)
          resolve(docs)
        })
    })
  }

  @Query(() => [ClientTypes])
  async getClients(@Ctx('user') user: Payload): Promise<ClientTypes[]> {
    if (!user) throw new Error('Token invalid')

    return new Promise((resolve, reject) => {
      Client.find()
        .populate('sellerId')
        .exec((err, docs) => {
          if (err) return reject(err)
          resolve(docs)
        })
    })
  }

  @Mutation(() => ClientTypes)
  async createClient(
    @Arg('input') input: CreateClientFields,
    @Ctx('user') user: Payload
  ): Promise<ClientTypes> {
    if (!user) throw new Error('Token invalid')

    const { company, email, first_name, last_name, phone_number } = input

    return Client.create({
      company,
      email,
      first_name,
      last_name,
      phone_number,
      sellerId: new ObjectID(user.id)
    })
      .then((client) => client)
      .catch((err) => {
        console.error(err.message)
        return err
      })
  }
}

export default ClientResolver
