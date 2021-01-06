import {
  Arg,
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql'

import { UserType, User } from '../../models'
import bcrypt from 'bcryptjs'
import { createToken, verifyToken } from '../../utils/jwtMethods'

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

@ObjectType()
class Token {
  @Field()
  accessToken: String
}

/* Main resolver */
@Resolver()
class UserResolver {
  @Mutation(() => UserType)
  async createUser(
    @Arg('createNewUserFields')
    { email, last_name, first_name, password }: createNewUserFields
  ) {
    return User.create({
      password: await bcrypt.hash(password, 15),
      email,
      first_name,
      last_name
    })
  }

  @Query(() => [UserType])
  async getUsers() {
    return await User.find({})
  }

  @Query(() => UserType)
  async getUserByToken(@Arg('token') accessToken: string) {
    const { id } = verifyToken(accessToken)
    return await User.findById(id)
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
      throw new Error('User does not exist')
    }

    // Check passwords
    const doPasswordsMatch = await bcrypt.compare(password, user.password)

    if (!doPasswordsMatch) {
      throw new Error('Passwords do not match')
    }

    return { accessToken: createToken(user, '24h') }
  }
}

export default UserResolver
