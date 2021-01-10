import {
  Arg,
  Ctx,
  Field,
  Float,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { ObjectID } from 'mongodb'
import { ClientTypes, Client, Order } from '../../models'
import { Payload, StatusesOrder } from '../../types'
import { hasToken } from './../middlewares'
import { Schema } from 'mongoose'

/* INPUTS */
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

@InputType()
class UpdateClientFields {
  @Field({ nullable: true })
  first_name: string

  @Field({ nullable: true })
  last_name: string

  @Field({ nullable: true })
  company: string

  @Field({ nullable: true })
  email: string

  @Field(() => Int, { nullable: true })
  phone_number: number
}

/* ADDITIONAL TYPES */
@ObjectType()
class TopClient {
  @Field(() => [ClientTypes])
  client: ClientTypes[]

  @Field(() => Float)
  total: number

  @Field(() => ID)
  _id: Schema.Types.ObjectId

  @Field(() => Number)
  totalOrders: number
}

/* RESOLVER */
@Resolver()
class ClientResolver {
  /* QUERIES */
  @Query(() => [ClientTypes], { description: 'Get clients by token / user' })
  @UseMiddleware(hasToken)
  async getMyClients(@Ctx('user') user: Payload): Promise<ClientTypes[]> {
    return new Promise((resolve, reject) => {
      Client.find({ seller: user.id })
        .populate('seller')
        .exec((err, docs) => {
          if (err) return reject(err)
          resolve(docs)
        })
    })
  }

  @Query(() => [ClientTypes], { description: 'Get all clients' })
  @UseMiddleware(hasToken)
  async getAllClients(): Promise<ClientTypes[]> {
    return new Promise((resolve, reject) => {
      Client.find()
        .populate('seller')
        .exec((err, docs) => {
          if (err) return reject(err)
          resolve(docs)
        })
    })
  }

  @Query(() => [TopClient])
  @UseMiddleware(hasToken)
  async getTopClients(): Promise<TopClient[]> {
    const clients = await Order.aggregate<TopClient>([
      {
        $match: { status: StatusesOrder.COMPLETED }
      },
      {
        $group: {
          _id: '$client',
          total: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 10
      }
    ])

    return clients
  }

  @Query(() => ClientTypes, { description: 'Get client by id' })
  @UseMiddleware(hasToken)
  async getClientById(
    @Arg('id') id: string,
    @Ctx('user') user: Payload
  ): Promise<ClientTypes> {
    /* Buscar el cliente por id */
    const client = await Client.findById(id)

    /* Si no existe lanzar un error */
    if (!client) throw new Error('Client not found')

    /* Si no coincide el id del token con el id del seller del cliente lanzar error */
    if (client.seller.toString() !== user.id) {
      throw new Error('Invalid credentials')
    }

    return new Promise((resolve, reject) => {
      client.populate('seller').execPopulate((err, docs) => {
        if (err) return reject(err)
        resolve(docs)
      })
    })
  }

  @Query(() => [ClientTypes])

  /* MUTATIONS */
  @Mutation(() => ClientTypes, { description: 'Create a new client' })
  @UseMiddleware(hasToken)
  async createClient(
    @Arg('input') input: CreateClientFields,
    @Ctx('user') user: Payload
  ): Promise<ClientTypes> {
    const { company, email, first_name, last_name, phone_number } = input

    return Client.create({
      company,
      email,
      first_name,
      last_name,
      phone_number,
      seller: new ObjectID(user.id)
    })
      .then((client) => client)
      .catch((err) => {
        console.error(err.message)
        return err
      })
  }

  @Mutation(() => ClientTypes, { description: 'Update a client by id' })
  @UseMiddleware(hasToken)
  async updateClientById(
    @Arg('id') id: string,
    @Arg('input') input: UpdateClientFields,
    @Ctx('user') user: Payload
  ): Promise<ClientTypes> {
    /* Encontrar el usuario por id */
    const { company, first_name, last_name, phone_number, email } = input
    const client = await Client.findById(id)

    /* Si no esxite el usuario salta un error */
    if (!client) throw new Error('Client not found')

    /* Si no es el usuario que edita sus propios clientes salta un error */
    if (client.seller.toString() !== user.id) {
      throw new Error('Invalid credentials')
    }

    const fields = {
      company: company || client.company,
      first_name: first_name || client.first_name,
      last_name: last_name || client.last_name,
      phone_number: phone_number || client.phone_number,
      email: email || client.email
    }

    const updatedClient = await Client.findOneAndUpdate({ _id: id }, fields, {
      new: true
    })

    if (!updatedClient) throw new Error('Client not found')

    return updatedClient
  }

  @Mutation(() => ClientTypes, { description: 'Delete a client by id' })
  @UseMiddleware(hasToken)
  async deleteClientById(@Arg('id') id: string, @Ctx('user') user: Payload) {
    /* Encontrar el usuario que se quiere eliminar */
    const client = await Client.findById(id)

    /* Si no existe el usuario mostrar un error */
    if (!client) throw new Error('Client not found')

    /* Si no el cliente de este vendedor mostrar un error */
    if (client.seller.toString() !== user.id) {
      throw new Error('Invalid credentials')
    }

    /* Eliminar usuario */
    const deletedClient = await Client.findByIdAndDelete(id)

    if (!deletedClient) throw new Error('Client not found')

    return deletedClient
  }
}

export default ClientResolver
