import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity()
class Clients {
  @ObjectIdColumn()
  id: ObjectID

  @Column()
  name: string
}

export default Clients
