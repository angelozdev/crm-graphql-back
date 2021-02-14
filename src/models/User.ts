import { Field, ID, ObjectType } from 'type-graphql'
import { Document, ObjectId, Schema, model } from 'mongoose'

const UserSchema = new Schema(
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

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

@ObjectType()
export class UserType extends Document {
  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field()
  email: string

  @Field(() => String)
  createdAt: Date

  @Field(() => String)
  updatedAt: Date

  @Field(() => ID)
  id: ObjectId

  @Field(() => String)
  password: string
}

export default model<UserType>('User', UserSchema, 'users')
