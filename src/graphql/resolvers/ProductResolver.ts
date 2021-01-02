import { Product } from '../../entity'
import {
  Arg,
  Args,
  ArgsType,
  Field,
  Float,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'

@ArgsType()
class NewProduct {
  @Field()
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number
}

@Resolver()
class ProductResolver {
  @Mutation(() => Product)
  async createProduct(@Args() { name, quantity, price }: NewProduct) {
    const newProduct = await Product.create({
      createdAt: new Date(),
      name,
      price,
      quantity
    }).save()

    return newProduct
  }

  @Query(() => [Product])
  async getProducts() {
    return Product.find({})
  }

  @Query(() => Product)
  async getProductById(@Arg('id') id: string) {
    const product = await Product.findOne(id)

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  }

  @Mutation(() => Product)
  async deleteProductById(@Arg('id') id: string) {
    const product = await Product.findOne(id)

    if (!product) {
      throw new Error('Product not found')
    }

    await Product.delete(product)

    return product
  }
}

export default ProductResolver
