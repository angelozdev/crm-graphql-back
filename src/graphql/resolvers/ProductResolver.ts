import { ProductType, Product } from '../../models'
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
  @Query(() => [ProductType])
  async getProducts() {
    return await Product.find({})
  }

  @Query(() => ProductType)
  async getProductById(@Arg('id') id: string) {
    const product = await Product.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  }

  @Mutation(() => ProductType)
  async deleteProductById(@Arg('id') id: string) {
    return await Product.findByIdAndDelete(id)
  }

  @Mutation(() => ProductType)
  async createProduct(@Args() { name, quantity, price }: NewProductFields) {
    return await Product.create({
      createdAt: new Date(),
      name,
      price,
      quantity
    })
  }

  @Mutation(() => ProductType)
  async updateProductById(
    @Arg('id') id: string,
    @Arg('input') { name, quantity, price }: UpdateProductFields
  ) {
    const product = await Product.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    return await Product.findByIdAndUpdate(
      product,
      {
        name: name || product.name,
        quantity: quantity || product.quantity,
        price: price || product.price
      },
      { new: true }
    )
  }
}

export default ProductResolver
