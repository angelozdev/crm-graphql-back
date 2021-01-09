import { Order, OrderTypes } from '../../models'
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
    if (!user) throw new Error('Token invalid')

    const { client, order, status, total } = input

    return await Order.create({
      client,
      order,
      status,
      total,
      seller: user.id
    })
  }
}

export default OrderResolver
