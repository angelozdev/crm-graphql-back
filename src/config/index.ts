import dotenv from 'dotenv'

dotenv.config()

const config = {
  database: {
    password: process.env.TYPE_ORM_PASSWORD,
    dbname: process.env.TYPE_ORM_DBNAME,
    username: process.env.TYPE_ORM_USERNAME
  },
  jwt: {
    secret: process.env.JWT_SECRET_WORD
  },
  setup: {
    port: process.env.PORT
  }
}

export default config
