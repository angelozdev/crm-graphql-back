import { Field, ID, ObjectType } from 'type-graphql'

/* Schema */
@ObjectType({ description: 'The recipe model' })
class Recipe {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Date)
  creationDate: Date

  @Field((type) => [String])
  ingredients: string[]
}

export default Recipe
