import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import graphqlHTTP from "express-graphql";
import graphql from "graphql";
import transport from "subscriptions-transport-ws";
import cors from "cors";

import schema from "../schema/schema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT | 4444;
const { subscribe, execute } = graphql;
const { SubscriptionServer } = transport;

app.use(cors());

app.use("/graphql", graphqlHTTP.graphqlHTTP({ schema, graphiql: true }));

const server = createServer(app);

async function start() {
  try {
    await mongoose.connect(process.env.NODE_DB_MONGO, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    server.listen(PORT, () => {
      console.log("Server work!");
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema,
        },
        {
          server: server,
          path: "/subscribtions",
        }
      );
    });
  } catch (e) {
    console.log(e);
  }
}

start();
