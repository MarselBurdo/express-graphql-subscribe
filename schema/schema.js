import grapfql from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = grapfql;

import Team from "../models/team.js";
import Game from "../models/game.js";
import { pubsub } from "./subscriptions.js";

const TeamType = new GraphQLObjectType({
  name: "Team",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    skill: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
const GameType = new GraphQLObjectType({
  name: "Game",
  fields: () => ({
    id: { type: GraphQLID },
    teams: {
      type: new GraphQLList(TeamType),
      resolve({ teams }, args) {
        let tmp = [];
        teams.forEach((el) => {
          tmp.push(Team.findById(el));
        });

        return tmp;
      },
    },
    pair: { type: GraphQLInt },
    status: { type: GraphQLString },
    winFirst: { type: GraphQLBoolean },
    winSecond: { type: GraphQLBoolean },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    teams: {
      type: new GraphQLList(TeamType),
      resolve(parent, args) {
        return Team.find({});
      },
    },
    games: {
      type: new GraphQLList(GameType),
      async resolve(parent, args) {
        pubsub.publish("allGames", { addGames: await Game.find({}) });
        return await Game.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addGame: {
      type: GameType,
      args: {
        status: { type: GraphQLString },
        pair: { type: GraphQLInt },
      },
      resolve(parent, { status, pair }) {
        const game = Game.create({
          status,
          pair,
        });
        return game;
      },
    },
    addTeam: {
      type: TeamType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        skill: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { name, skill }) {
        const team = Team.create({
          name,
          skill,
        });
        return team;
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
