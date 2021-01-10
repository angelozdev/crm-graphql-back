import { Field, Float, ID, Int, ObjectType } from 'type-graphql'
import { Document, model, Schema } from 'mongoose'

export const ProductSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      trim: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

ProductSchema.index({ name: 'text' })

@ObjectType()
export class ProductTypes extends Document {
  @Field(() => ID)
  id: String

  @Field()
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number

  @Field(() => String)
  createdAt: Date

  @Field(() => String)
  updatedAt: Date
}

export default model<ProductTypes>('Product', ProductSchema, 'products')
