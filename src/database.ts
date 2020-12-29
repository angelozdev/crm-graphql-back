import { createConnection } from 'typeorm'
import config from './config'

const {
  typeorm: { dbname, password, username }
} = config

function connection() {
  return createConnection({
    type: 'mongodb',
    url: `mongodb+srv://${username}:${password}@cluster0.pbvgr.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.js'],
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('DB Connected')
    })
    .catch((err) => {
      console.error(err.message)
      process.exit(1)
    })
}

export default connection
