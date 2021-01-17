import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Float,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql'

import { UserType, User, Order } from '../../models'
import bcrypt from 'bcryptjs'
import { createToken, verifyToken } from '../../utils/jwtMethods'
import { Errors, Payload, StatusesOrder } from '../../types'
import { handleSuccess, handleError } from '../../utils/handleConsole'

/* INPUTS */
@InputType()
class createNewUserFields {
  @Field()
  first_name: string

  @Field()
  last_name: string

  @Field()
  email: string

  @Field()
  password: string
}

/* TYPES */
@ObjectType()
class Token {
  @Field()
  accessToken: string
}

@ObjectType()
class TopSeller {
  @Field(() => [UserType])
  seller: UserType[]

  @Field(() => Float)
  total: number

  @Field(() => ID)
  _id: string

  @Field(() => Int)
  totalOrders: number
}

/* RESOLVER */
@Resolver()
class UserResolver {
  /* QUERIES */
  @Query(() => [UserType])
  async getUsers() {
    return await User.find({})
  }

  @Query(() => UserType)
  async getUserLogged(@Ctx('user') user: Payload) {
    return await User.findById(user.id)
  }

  @Query(() => [TopSeller])
  async getTopSellers(): Promise<TopSeller[]> {
    const sellers = await Order.aggregate<TopSeller>([
      {
        $match: { status: StatusesOrder.COMPLETED }
      },
      {
        $group: {
          _id: '$seller',
          total: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'seller'
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 10
      }
    ])

    return sellers
  }

  /* MUTATIONS */
  @Mutation(() => UserType)
  async createUser(
    @Arg('createNewUserFields')
    { email, last_name, first_name, password }: createNewUserFields
  ) {
    const createdUser = await User.create({
      password: await bcrypt.hash(password, 15),
      email,
      first_name,
      last_name
    })

    handleSuccess('User created', createdUser)
    return createdUser
  }

  @Mutation(() => UserType)
  async deleteUserById(@Arg('id') id: string) {
    return await User.findByIdAndDelete(id)
  }

  @Mutation(() => Token)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await User.findOne({ email })

    // If the user exists
    if (!user?.email || !user.password) {
      return handleError(Errors.USER_NOT_FOUND)
    }

    // Check passwords
    const doPasswordsMatch = await bcrypt.compare(password, user.password)

    if (!doPasswordsMatch) {
      return handleError(Errors.PASSWORDS_DO_NOT_MATCH)
    }

    const accessToken = createToken(user, '24h')

    handleSuccess('User logged', { user, accessToken })

    return { accessToken, user }
  }
}

export default UserResolver
