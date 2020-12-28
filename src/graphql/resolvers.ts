import { ArrayMaxSize, Length, Max, Min } from 'class-validator'
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'
import Recipe from './schema'

const recipes: Recipe[] = [
  {
    id: '84f35519-6daa-4f59-b74a-8e390bcd7075',
    title: 'Duobam',
    description: 'seize out-of-the-box interfaces',
    creationDate: new Date('2020-06-30T16:30:59Z'),
    ingredients: ['Automotive', 'Tools', 'Jewelery']
  },
  {
    id: '5378e367-0387-445a-aa96-491bb32f7e87',
    title: 'Overhold',
    description: 'integrate visionary e-services',
    creationDate: new Date('2020-03-11T17:34:04Z'),
    ingredients: ['Kids', 'Clothing', 'Beauty']
  },
  {
    id: '8bad49a6-adc0-465b-8770-51b64eaa59bc',
    title: 'Fixflex',
    description: 'expedite extensible technologies',
    creationDate: new Date('2020-08-23T07:01:32Z'),
    ingredients: ['Shoes', 'Shoes', 'Music']
  },
  {
    id: '6d1eeefc-6906-45c4-9e26-1ebeb3f8793f',
    title: 'Wrapsafe',
    description: 'integrate clicks-and-mortar convergence',
    creationDate: new Date('2020-12-09T11:18:59Z'),
    ingredients: ['Clothing', 'Outdoors', 'Beauty']
  },
  {
    id: '6dc5cb26-337f-4ddc-a9c6-0d484e1123de',
    title: 'Biodex',
    description: 'orchestrate clicks-and-mortar e-tailers',
    creationDate: new Date('2020-09-17T16:55:42Z'),
    ingredients: ['Outdoors', 'Grocery', 'Automotive']
  },
  {
    id: '10424a80-6109-4edc-b5fd-2785130f556e',
    title: 'Tres-Zap',
    description: 'brand integrated solutions',
    creationDate: new Date('2020-04-06T23:03:16Z'),
    ingredients: ['Books', 'Games', 'Garden']
  },
  {
    id: '2190613f-388b-411c-99f8-b013e9a193f4',
    title: 'Overhold',
    description: 'transition next-generation portals',
    creationDate: new Date('2020-01-17T11:31:40Z'),
    ingredients: ['Industrial', 'Sports', 'Jewelery']
  },
  {
    id: '60f480f7-2ff7-46f2-98b9-474937d188a9',
    title: 'Tresom',
    description: 'scale cross-media users',
    creationDate: new Date('2020-11-01T22:28:27Z'),
    ingredients: ['Beauty', 'Clothing', 'Health']
  },
  {
    id: '5f0761e8-ae92-449d-8990-d69201a84d52',
    title: 'Bitchip',
    description: 'leverage plug-and-play infomediaries',
    creationDate: new Date('2020-08-25T15:27:11Z'),
    ingredients: ['Shoes', 'Movies', 'Industrial']
  },
  {
    id: 'ae0c78c6-978a-4ac7-92f2-61d7832dbd66',
    title: 'Cookley',
    description: 'disintermediate leading-edge networks',
    creationDate: new Date('2020-10-30T03:03:40Z'),
    ingredients: ['Tools', 'Garden', 'Music']
  }
]

@InputType()
class NewRecipeInput {
  @Field()
  @Length(3, 30)
  title: string

  @Field({ nullable: true })
  @Length(10, 50)
  description?: string

  @Field(() => [String])
  @ArrayMaxSize(10)
  ingredients: string[]
}

@ArgsType()
class RecipeArgs {
  @Field(() => Int)
  @Max(50)
  @Min(1)
  take: number = 25

  @Field(() => String, { nullable: true })
  @Length(2, 20)
  contain: string
}

@Resolver(Recipe)
class RecipeResolver {
  @Query(() => [Recipe])
  getRecipes(@Args() { take, contain }: RecipeArgs, @Ctx('user') user: Object) {
    console.log(user)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          recipes
            .filter((e) => {
              if (contain) {
                return (
                  e.title.toLowerCase().includes(contain.toLowerCase()) ||
                  e.description
                    ?.toLowerCase()
                    .includes(contain.toLowerCase()) ||
                  e.ingredients
                    .toString()
                    .replace(/[\s'\[,\]"]/, '')
                    .toLowerCase()
                    .includes(contain.toLowerCase())
                )
              }

              return e
            })
            .slice(0, take)
        )
      }, 300)
    })
  }

  @Mutation(() => Recipe)
  createRecipe(@Arg('newRecipeData') newRecipeData: NewRecipeInput) {
    recipes.push({
      ...newRecipeData,
      id:
        'saddd' +
        Math.floor(Math.random() * 3000) +
        'asd' +
        Math.floor(Math.random() * 3000),
      creationDate: new Date()
    })
    return Promise.resolve(newRecipeData)
  }
}

export default RecipeResolver
