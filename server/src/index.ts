import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { User } from './entity/User'
import * as express from 'express'
const { ApolloServer, gql } = require('apollo-server-express')

createConnection()
  .then(async (connection) => {
    console.log('Inserting a new user into the database...')
    const user = new User()

    user.firstName = 'Timber'

    user.lastName = 'Saw'
    user.age = 25
    await connection.manager.save(user)
    console.log('Saved a new user with id: ' + user.id)

    console.log('Loading users from the database...')
    const users = await connection.manager.find(User)
    console.log('Loaded users: ', users)

    console.log('Here you can setup and run express/koa/any other framework.')
  })
  .catch((error) => console.log(error))

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    nodes: [Node]
  }

  enum Status {
    PASS
    FAIL
  }

  type NodeMetaData {
    id: String!
    # status: Status!
    # durationMs: Int!
    # time: String!
    # branch: String!
    # reportId: String!
  }

  type LeafData {
    log: String
  }

  type InnerData {
    children: [NodeMetaData]
  }

  union NodeData = LeafData | InnerData

  type Node {
    metadata: NodeMetaData!
    data: NodeData!
    history: [NodeMetaData]!
  }
`

const nodes = [
  {
    metadata: {
      id: 'The Awakening',
    },
    data: {
      log: 'blah',
    },
    history: [],
  },
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    nodes: () => nodes,
  },
  Node: {
    metadata: (x: any) => x.metadata,
    data: (x: any) => x.data,
    history: (x: any) => x.history,
  },
  NodeData: {
    __resolveType(obj: any, _context: any, _info: any) {
      if (obj.hasOwnProperty('log')) {
        return 'LeafData'
      }
      return 'InnerData'
    },
  },
  NodeMetaData: {
    id: (x: any) => x.id,
  },
  LeafData: {
    log: (x: any) => x.log,
  },
  InnerData: {
    children: (x: any) => x.children,
  },
}

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers })

  await createConnection()

  const app = express()

  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )
}

startServer()
