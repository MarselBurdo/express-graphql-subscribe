import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import graphqlHTTP from "express-graphql";
import graphql from "graphql";
import transport from "subscriptions-transport-ws";
import cors from "cors";

import { subscribtionSchema } from "../schema/subscriptions.js";
import schema from "../schema/schema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT | 4444;
const WS_PORT = process.env.WS_PORT| 4499;
const { subscribe, execute } = graphql;
const { SubscriptionServer } = transport;

app.use(cors());

const ws = createServer((req, res) => {
  res.writeHead(400);
  res.end();
});

ws.listen(WS_PORT, () => {
  console.log(`Websocket work! Go to ${WS_PORT}`);
});

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
      console.log(`Server work! Go to http://localhost:${PORT}/graphql`);
      new SubscriptionServer(
        {
          execute,
          subscribe,
          subscribtionSchema,
        },
        {
          server: ws,
          path: "/graphql",
        }
      );
    });
  } catch (e) {
    console.log(e);
  }
}

start();
