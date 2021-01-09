import { Client, Order, OrderTypes, Product } from '../../models'
import { Schema } from 'mongoose'
import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  registerEnumType,
  Resolver
} from 'type-graphql'
import { StatusesOrder } from '../../types'
import { Payload } from 'utils/jwtMethods'

registerEnumType(StatusesOrder, { name: 'StatusesOrder' })

@InputType()
class OrderFields {
  @Field(() => ID)
  productId: Schema.Types.ObjectId

  @Field(() => Int)
  quantity: number
}

@InputType()
class CreateOrderFields {
  @Field(() => [OrderFields])
  order: OrderFields[]

  @Field(() => Int)
  total: number

  @Field(() => ID)
  client: Schema.Types.ObjectId

  @Field(() => StatusesOrder)
  status: StatusesOrder
}

@Resolver()
class OrderResolver {
  @Mutation(() => OrderTypes)
  async createOrder(
    @Arg('input') input: CreateOrderFields,
    @Ctx('user') user: Payload
  ): Promise<OrderTypes> {
    /* Verificar si hay un token válido */
    if (!user) throw new Error('Token invalid')

    const { client, order, status, total } = input

    /* Vefificar si el cliente existe */
    const clientExists = await Client.findById(client)

    if (!clientExists) throw new Error('Client not found')

    /* Verificar si el usuario es el mismo */
    if (clientExists.sellerId.toString() !== user.id) {
      throw new Error('Invalid credentials')
    }

    /* Revisar stock */
    for await (const p of input.order) {
      const { productId } = p
      const product = await Product.findById(productId)

      if (!product) throw new Error('Product not found')
      if (product.quantity < p.quantity) {
        throw new Error(`Quantity not available for ${product.name}`)
      } else {
        product.quantity -= p.quantity
        await product.save()
      }
    }

    /* Crear el pedido */
    const newOrder = new Order({
      client,
      order,
      status,
      total,
      seller: user.id
    })

    return await newOrder.save()
  }
}

export default OrderResolver
