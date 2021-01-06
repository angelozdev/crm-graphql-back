import { Document, model, Schema } from 'mongoose'
import { Field, ID, Int, ObjectType } from 'type-graphql'
import { UserType } from './User'

export const ClientSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true
    },

    last_name: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    phone_number: {
      type: Number,
      required: false,
      trim: true
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'User'
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

@ObjectType()
export class ClientTypes extends Document {
  @Field(() => ID)
  id: string

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

  @Field(() => String)
  createdAt: Date

  @Field(() => UserType || ID)
  sellerId: string | UserType
}

export default model<ClientTypes>('Client', ClientSchema, 'clients')
