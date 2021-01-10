import { Client, Order, OrderTypes, Product, User } from '../../models'
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
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { StatusesOrder, Payload } from '../../types'
import { hasToken } from '../middlewares'

registerEnumType(StatusesOrder, { name: 'StatusesOrder' })

/* INPUTS */
@InputType()
class CreateProductsFields {
  @Field(() => ID)
  productId: Schema.Types.ObjectId

  @Field(() => Int)
  quantity: number
}

@InputType()
class CreateOrderFields {
  @Field(() => [CreateProductsFields])
  products: CreateProductsFields[]

  @Field(() => Int)
  total: number

  @Field(() => ID)
  client: Schema.Types.ObjectId

  @Field(() => StatusesOrder)
  status: StatusesOrder
}

@InputType()
class UpdateOrderFields {
  @Field(() => [CreateProductsFields], { nullable: true })
  products?: CreateProductsFields[]

  @Field(() => Int, { nullable: true })
  total?: number

  @Field(() => ID, { nullable: true })
  client?: Schema.Types.ObjectId

  @Field(() => StatusesOrder, { nullable: true })
  status?: StatusesOrder

  id: string
}

/* RESOLVER */
@Resolver()
class OrderResolver {
  /* QUERIES */
  @Query(() => [OrderTypes])
  @UseMiddleware(hasToken)
  async getAllOrders(): Promise<OrderTypes[]> {
    try {
      return await Order.find({})
    } catch (err) {
      console.error(err.message)
      return err
    }
  }

  @Query(() => [OrderTypes])
  @UseMiddleware(hasToken)
  async getMyOrders(@Ctx('user') user: Payload): Promise<OrderTypes[]> {
    try {
      const { id } = user
      return await Order.find({ seller: id })
    } catch (err) {
      console.error(err.message)
      return err
    }
  }

  @Query(() => OrderTypes)
  @UseMiddleware(hasToken)
  async getOrderById(
    @Arg('id') id: string,
    @Ctx('user') user: Payload
  ): Promise<OrderTypes> {
    const order = await Order.findById(id)

    if (!order) throw new Error('Order not found')

    if (order.seller.toString() !== user.id) {
      throw new Error('Credentials invalid')
    }

    return order
  }

  @Query(() => [OrderTypes])
  @UseMiddleware(hasToken)
  async getOrdersByStatus(
    @Arg('status', () => StatusesOrder) status: StatusesOrder,
    @Ctx('user') user: Payload
  ): Promise<OrderTypes[]> {
    const orders = await Order.find({ seller: user.id, status })

    return orders
  }

  /* MUTATIONS */
  @Mutation(() => OrderTypes)
  @UseMiddleware(hasToken)
  async createOrder(
    @Arg('input') input: CreateOrderFields,
    @Ctx('user') user: Payload
  ): Promise<OrderTypes> {
    const { client, products, status, total } = input

    /* Vefificar si el cliente existe */
    const clientExists = await Client.findById(client)

    if (!clientExists) throw new Error('Client not found')

    /* Verificar si el usuario es el mismo */
    if (clientExists.sellerId.toString() !== user.id) {
      throw new Error('Invalid credentials')
    }

    /* Revisar stock */
    for await (const p of input.products) {
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
      products,
      status,
      total,
      seller: user.id
    })

    return await newOrder.save()
  }

  @Mutation(() => OrderTypes)
  @UseMiddleware(hasToken)
  async updateOrderById(
    @Arg('id') orderId: string,
    @Arg('input') input: UpdateOrderFields,
    @Ctx('user') user: Payload
  ): Promise<OrderTypes> {
    const { status, total, client, products } = input

    // Si el perdido existe
    const order = await Order.findById(orderId)
    if (!order) throw new Error('Order not found')

    // Si el cliente existe
    const seller = await User.findById(order.seller)
    if (!seller) throw new Error('Seller not found')

    // Si el cliente y el pedido pertenecen el mismo verdedor
    if (user.id !== seller.id.toString()) {
      new Error('Credentials invalid')
    }

    // Revisar el stock
    if (products) {
      for await (const p of products) {
        const product = await Product.findById(p.productId)

        if (!product) throw new Error('Product not found')
        if (product.quantity < p.quantity) {
          throw new Error('Quantity invalid')
        } else {
          product.quantity -= p.quantity

          await product.save()
        }
      }
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: status || order.status,
        total: total || order.total,
        client: client || order.client,
        products: products || order.products || []
      },
      { new: true }
    )

    if (!updatedOrder) throw new Error('Order not found')

    return updatedOrder
  }

  @Mutation(() => OrderTypes)
  @UseMiddleware(hasToken)
  async deleteOrderById(
    @Arg('id') id: string,
    @Ctx('user') user: Payload
  ): Promise<OrderTypes> {
    // Verificar que el pedido existe
    const order = await Order.findById(id)
    if (!order) throw new Error('Order not found')

    // Verificar que el vendedor es el mismo que està loggeado
    if (order.seller.toString() !== user.id) {
      throw new Error('Credentials invalid')
    }

    const deletedOrder = await Order.findByIdAndDelete(id)
    if (!deletedOrder) throw new Error('Order not found')

    return deletedOrder
  }
}

export default OrderResolver
