import dotenv from "dotenv";
require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            return {
                loggedInUser: await getUser(req.headers.token),
            };
        },
    });

    await server.start();

    const app = express();
    app.use(graphqlUploadExpress(), logger("tiny"));

    server.applyMiddleware({ app });
    app.use("/static", express.static("uploads"));

    await new Promise((func) => app.listen({ port: PORT }, func));
    console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
};
startServer();
