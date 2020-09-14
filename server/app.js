import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import graphqlHTTP from "express-graphql";
import cors from "cors";

import schema from "../schema/schema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT | 4444;

app.use(cors());

app.use("/graphql", graphqlHTTP.graphqlHTTP({ schema, graphiql: true }));

async function start() {
  try {
    await mongoose.connect(process.env.NODE_DB_MONGO, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log("Server work!");
    });
  } catch (e) {
    console.log(e);
  }
}

start();
