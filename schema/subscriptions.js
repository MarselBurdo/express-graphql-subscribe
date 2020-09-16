
import sub from "graphql-subscriptions";
import gql from "graphql-tag"
import tools from "graphql-tools";

const { PubSub } = sub;
const { makeExecutableSchema } = tools;
export const pubsub= new PubSub()

const typeDefs = gql`

type Query{
  games:[game]
}

type game {
  pair: Int
  status: String
  id: ID
  teams:[String]
}

type Subscriptions{
  allGames: game
}
`

const resolvers={
  Subscriptions:{
    allGames:{
      subscribe: ()=> pubsub.asyncIterator('allGames')
    }
  }
}

export const subscribtionSchema = makeExecutableSchema({typeDefs, resolvers})
