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
  @Query(() => ClientTypes)
  async getClientById(
    @Arg('id') id: string,
    @Ctx('user') user: Payload
  ): Promise<ClientTypes> {
    /* Comprobar si hay un token válido */
    if (!user) throw new Error('Token invalid')

    /* Buscar el cliente por id */
    const client = await Client.findById(id)

    /* Si no existe lanzar un error */
    if (!client) throw new Error('Client not found')

    /* Si no coincide el id del token con el id del seller del cliente lanzar error */
    if (client.sellerId.toString() !== user.id) {
      throw new Error('Invalid credentials')
    }

    return new Promise((resolve, reject) => {
      client.populate('sellerId').execPopulate((err, docs) => {
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
