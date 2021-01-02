import {
  Arg,
  Args,
  ArgsType,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql'
import { getMongoRepository } from 'typeorm'
import { User } from '../../entity/'
import bcrypt from 'bcryptjs'
import { createToken, verifyToken } from '../../utils/jwtMethods'

@ArgsType()
class createNewUser {
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
  @Mutation(() => User)
  async createUser(
    @Args() { email, last_name, first_name, password }: createNewUser
  ) {
    const newUser = getMongoRepository(User).create({
      updatedAt: new Date(),
      createdAt: new Date(),
      password: await bcrypt.hash(password, 15),
      email,
      first_name,
      last_name
    })

    return await getMongoRepository(User).save(newUser)
  }

  @Query(() => [User])
  async getUsers() {
    return await getMongoRepository(User).find()
  }

  @Query(() => User)
  async getUserByToken(@Arg('token') accessToken: string) {
    const { id } = verifyToken(accessToken)
    const user = await getMongoRepository(User).findOne(id)

    if (!user) {
      throw new Error('User does not exist')
    }

    return user
  }

  @Mutation(() => User)
  async deleteUserById(@Arg('id') id: string) {
    const deletedUser = await getMongoRepository(User).findOne(id)

    if (!deletedUser) {
      throw new Error('User not found')
    }
    await getMongoRepository(User).delete(deletedUser)

    return deletedUser
  }

  @Mutation(() => Token)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await getMongoRepository(User).findOne({ email })

    /* If the user exists */
    if (!user?.email || !user.password) {
      throw new Error('User does not exist')
    }

    /* Check passwords */
    const doPasswordsMatch = await bcrypt.compare(password, user.password)

    if (!doPasswordsMatch) {
      throw new Error('Passwords do not match')
    }

    return { accessToken: createToken(user, '24h') }
  }
}

export default UserResolver
