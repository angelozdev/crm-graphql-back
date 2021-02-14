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
      type: String,
      required: false,
      trim: true
    },

    seller: {
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
  id: Schema.Types.ObjectId

  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field()
  company: string

  @Field()
  email: string

  @Field(() => String, { nullable: true })
  phone_number: string

  @Field(() => String)
  createdAt: Date

  @Field(() => UserType)
  seller: string
}

export default model<ClientTypes>('Client', ClientSchema, 'clients')
