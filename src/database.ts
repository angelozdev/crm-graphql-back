import { connect, ConnectionOptions } from 'mongoose'
import config from './config'

const {
  database: { dbname, password, username }
} = config

function connection() {
  const URI = `mongodb+srv://${username}:${password}@cluster0.pbvgr.mongodb.net/${dbname}?retryWrites=true&w=majority`
  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
  return connect(URI, options)
    .then(() => {
      console.log('DB Connected')
    })
    .catch((err) => {
      console.error(err.message)
      process.exit(1)
    })
}

export default connection
