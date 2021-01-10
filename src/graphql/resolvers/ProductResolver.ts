import { ProductTypes, Product } from '../../models'
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

/* ARGS */
@ArgsType()
class NewProductFields {
  @Field()
  name: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  price: number
}

/* INPUTS */
@InputType()
class UpdateProductFields {
  @Field({ nullable: true })
  name: string

  @Field(() => Int, { nullable: true })
  quantity: number

  @Field(() => Float, { nullable: true })
  price: number
}

/* RESOLVER */
@Resolver()
class ProductResolver {
  /* QUERIES */
  @Query(() => [ProductTypes])
  async getProducts() {
    return await Product.find({})
  }

  @Query(() => ProductTypes)
  async getProductById(@Arg('id') id: string) {
    const product = await Product.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  }

  @Query(() => [ProductTypes])
  async getProductsByName(@Arg('name') name: string) {
    const foundProducts = await Product.find({
      $text: { $search: name }
    }).limit(10)

    return foundProducts
  }

  /* MUTATIONS */
  @Mutation(() => ProductTypes)
  async deleteProductById(@Arg('id') id: string) {
    return await Product.findByIdAndDelete(id)
  }

  @Mutation(() => ProductTypes)
  async createProduct(@Args() { name, quantity, price }: NewProductFields) {
    return await Product.create({
      createdAt: new Date(),
      name,
      price,
      quantity
    })
  }

  @Mutation(() => ProductTypes)
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
