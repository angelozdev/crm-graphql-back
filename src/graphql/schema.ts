import { gql } from 'apollo-server'

/* Schema */
const typeDefs = gql`
  type Course {
    title: String
  }

  type Technology {
    technology: String
  }

  type Query {
    getCourses: [Course]
    getTechnologies: [Technology]
  }
`

export default typeDefs
