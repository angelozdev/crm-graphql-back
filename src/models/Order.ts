import { Field, Float, ID, Int, ObjectType } from 'type-graphql'
import { Document, model, Schema } from 'mongoose'
import { StatusesOrder } from '../types'

export const OrderSchema = new Schema(
  {
    order: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: { type: Number, default: 1, trim: true }
        }
      ],
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Client'
    },
    seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      trim: true,
      default: StatusesOrder.PENDING
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

@ObjectType()
export class OrderType {
  @Field(() => ID)
  productId: Schema.Types.ObjectId

  @Field(() => Int)
  quantity: number
}

@ObjectType()
export class OrderTypes extends Document {
  @Field(() => ID)
  id: Schema.Types.ObjectId

  @Field(() => [OrderType])
  order: OrderType[]

  @Field(() => Float)
  total: number

  @Field(() => ID)
  client: Schema.Types.ObjectId

  @Field(() => ID)
  seller: Schema.Types.ObjectId

  @Field(() => StatusesOrder)
  status: StatusesOrder

  @Field(() => String)
  createdAt: Date

  @Field(() => String)
  updatedAt: Date
}

export default model<OrderTypes>('Order', OrderSchema, 'orders')
