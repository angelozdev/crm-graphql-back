import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column,
  Entity,
  ObjectID,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  ObjectIdColumn
} from 'typeorm'

@ObjectType()
@Entity('users')
class User {
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
  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date
}

export default User
