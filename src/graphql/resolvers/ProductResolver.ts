import { Product } from '../../entity'
import {
  Arg,
  Args,
  ArgsType,
  Field,
  Float,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'

@ArgsType()
class NewProductFields {
  @Field()
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number
}

@InputType()
class UpdateProductFields {
  @Field({ nullable: true })
  name: string

  @Field(() => Int, { nullable: true })
  quantity: number

  @Field(() => Float, { nullable: true })
  price: number
}

@Resolver()
class ProductResolver {
  @Query(() => [Product])
  async getProducts() {
    return await Product.find({})
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

  @Mutation(() => Product)
  async createProduct(@Args() { name, quantity, price }: NewProductFields) {
    const newProduct = await Product.create({
      createdAt: new Date(),
      name,
      price,
      quantity
    }).save()

    return newProduct
  }

  @Mutation(() => Product)
  async updateProductById(
    @Arg('id') id: string,
    @Arg('input') { name, quantity, price }: UpdateProductFields
  ) {
    const product = await Product.findOne(id)

    if (!product) {
      throw new Error('Product not found')
    }

    await Product.update(product, {
      name: name || product.name,
      quantity: quantity || product.quantity,
      price: price || product.price
    })

    return await Product.findOne(id)
  }
}

export default ProductResolver
