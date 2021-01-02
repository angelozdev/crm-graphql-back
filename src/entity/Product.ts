import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn
} from 'typeorm'
import { Field, Float, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity('products')
class Product extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field()
  @Column()
  name: string

  @Field(() => Int)
  @Column()
  quantity: number

  @Field(() => Float)
  @Column()
  price: number

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date
}

export default Product
