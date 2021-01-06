import { Field, ID, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  ObjectID,
  ObjectIdColumn
} from 'typeorm'
import User from './User'

@ObjectType()
@Entity('clients')
class Client extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field()
  @Column()
  first_name: string

  @Field()
  @Column()
  last_name: string

  @Field()
  @Column()
  company: string

  @Field()
  @Column('string', { unique: true })
  email: string

  @Field(() => Int)
  @Column('int', { nullable: true })
  phone_number: number

  @Field(() => String)
  @CreateDateColumn({ default: new Date() })
  createdAt: Date

  @Field(() => ID)
  @ObjectIdColumn()
  seller: ObjectID
}

export default Client
